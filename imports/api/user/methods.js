import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { check } from 'meteor/check';
import './fields';
import { userRegistrationAndVerifyEmail } from '/imports/api/email';
import { getUserFullName } from '/imports/util/getUserData';

Meteor.methods({
  'user.createUser': function ({
    name,
    email,
    userType,
    sendMeSkillShapeNotification,
    signUpType,
    birthYear,
    schoolName,
    password,
  }) {
    if (!isEmpty(name) && !isEmpty(email)) {
      /*
'Paul Steve Panakkal'.split(' ').slice(0, -1).join(' '); // returns "Paul Steve"
'Paul Steve Panakkal'.split(' ').slice(-1).join(' '); // returns "Panakkal"
'Paul Steve Panakkal'.split(' '); // retutrns ["Paul", "Steve", "Panakkal"]
*/
      const accessType = userType || 'Anonymous';
      const finalName = name.split(' ');
      const userObj = {
        email,
        password,
        profile: {
          firstName: finalName[0],
          lastName: finalName[1],
          passwordSetByUser: true,
          userType: accessType,
          sendMeSkillShapeNotification,
        },
        sign_up_service: signUpType || 'Unknown',
      };

      if (birthYear) {
        userObj.profile.birthYear = birthYear;
      }

      if (signUpType && signUpType === 'skillshape-signup') {
        userObj.term_cond_accepted = true;
      }

      const userId = Accounts.createUser(userObj);

      Roles.addUsersToRoles(userId, accessType);
      const userRec = Accounts.generateVerificationToken(userId);
      const urlToken = `${Meteor.absoluteUrl()}verify-email/${userRec.token}`;
      const user = Meteor.users.findOne(userId);
      const fromEmail = 'Notices@SkillShape.com';
      userRegistrationAndVerifyEmail(user, urlToken, password, fromEmail, email, schoolName);
      return { user, password, email };
    }
    throw new Meteor.Error('Cannot process due to lack of information');
  },
  'user.onSocialSignUp': function ({
    name, email, userType, sendMeSkillShapeNotification,
  }) {
    if (this.userId) {
      const accessType = userType || 'Anonymous';
      const userData = Meteor.users.findOne({ _id: this.userId });
      if (get(userData, 'profile.userType')) {
        return;
      }
      Meteor.users.update(
        {
          _id: this.userId,
        },
        {
          $set: {
            'profile.userType': accessType,
            sign_up_service: 'social-signup', // this indicates social sign-up i.e facebook or google.
          },
        },
      );

      Roles.addUsersToRoles(this.userId, accessType);
    }
  },
  'user.setPassword': function ({ password, logout }) {
    let userLogout = true;
    if (logout === false) userLogout = false;
    if (this.userId) {
      Meteor.users.update({ _id: this.userId }, { $set: { 'profile.passwordSetByUser': true } });
      Accounts.setPassword(this.userId, password, {
        logout: userLogout,
      });
    } else {
      throw new Meteor.Error('User not found!!');
    }
  },
  'user.editUser': function ({ doc, docId }) {
    check(docId, String);
    check(doc, Object);
    if (this.userId === docId) {
      return Meteor.users.update({ _id: docId }, { $set: doc });
    }
    throw new Meteor.Error('Permission Denied!!');
  },
  'user.sendVerificationEmailLink': function (email) {
    check(email, String);

    if (email) {
      const user = Meteor.users.findOne({ 'emails.address': email });
      if (user && user._id) {
        return Accounts.sendVerificationEmail(user._id);
      }
      throw new Meteor.Error(` User not found corresponding to this email address "${email}" `);
    }
    throw new Meteor.Error('Invalid email address!!');
  },
  'user.getUsers': function ({ limit, skip }) {
    check(limit, Number);
    check(skip, Number);
    if (this.userId && Roles.userIsInRole(this.userId, 'Superadmin')) {
      const filters = {};
      return {
        usersData: Meteor.users.find(filters, { limit, skip }).fetch(),
        usersCount: Meteor.users.find(filters).count(),
      };
    }
    return new Meteor.Error('Permission Denied!!');
  },
  'user.getAllUsersCount': function ({}) {
    if (this.userId && Roles.userIsInRole(this.userId, 'Superadmin')) {
      const filters = {};
      return {
        usersCount: Meteor.users.find(filters).count(),
      };
    }
    return new Meteor.Error('Permission Denied!!');
  },
  'user.checkForRegisteredUser': function ({ email }) {
    if (email) {
      const userData = Meteor.users.findOne({ 'emails.address': email });
      if (userData) {
        const userName = getUserFullName(userData);
        return {
          userInfo: `${userName}  at ${email} already exists.`,
          userId: userData._id,
        };
      }
      throw new Meteor.Error('No User Found with this Email!!!');
    } else {
      throw new Meteor.Error('Email Address not found!!');
    }
  },
  'user.getAllUsersEmail': function () {
    return Meteor.users.find({}, { fields: { emails: 1 } }).fetch();
  },
  'user.getSelectedUsersEmail': function (userIds) {
    if (userIds == 'All') {
      return Meteor.users.find({}, { fields: { emails: 1 } }).fetch();
    }
    return Meteor.users.find({ _id: { $in: userIds } }, { fields: { emails: 1 } }).fetch();
  },
  'user.getUsersFromIds': function (data) {
    const {
      studentsIds: ids, classTypeId, schoolId, classData, purchaseIds, limitAndSkip,
    } = data;
    const usersData = Meteor.users.find({ _id: { $in: ids } }, limitAndSkip).fetch();
    const purchaseData = Meteor.call('purchases.getPackagesFromPurchaseIds', purchaseIds);
    !isEmpty(usersData)
      && usersData.map((obj, index) => {
        const { _id: userId } = obj;
        const filter = { userId, classTypeId };
        obj.alreadyPurchasedData = Meteor.call('classPricing.signInHandler', filter);
        if (schoolId) {
          const result = Meteor.call('schoolMemberDetails.getNotes', {
            activeUserId: userId,
            schoolId,
          });
          const { notes, smdId } = result;
          obj.notes = notes;
          obj.smdId = smdId;
        }
      });
    const studentsData = studentsListMaker(usersData, classData, purchaseData);
    return studentsData;
  },
  'user.getUserDataFromId': function (_id) {
    return Meteor.users.findOne({ _id });
  },
  'user.changeEmailAddress': function (newEmail) {
    const results = Meteor.users.find({ 'emails.address': newEmail }).fetch();
    if (results.length > 0) {
      throw new Meteor.Error('already exist', 'User Already Exists with this email.');
    } else {
      return Meteor.users.update({ _id: this.userId }, { $set: { 'emails.0.address': newEmail } });
    }
  },
});
studentsListMaker = (studentsData, classData, purchaseData) => {
  const studentStatus = classData && classData ? classData.students : [];
  studentsData
    && studentsData.map((obj, index) => {
      studentStatus.map((obj1, index2) => {
        if (obj1.userId == obj._id) {
          {
            obj.status = get(obj1, 'status', null);
            obj.purchaseId = get(obj1, 'purchaseId', null);
          }
          !isEmpty(purchaseData)
            && purchaseData.map((purchaseRec) => {
              if (purchaseRec._id == obj1.purchaseId) {
                obj.purchaseData = purchaseRec;
              }
            });
        }
      });
    });
  return studentsData;
};
