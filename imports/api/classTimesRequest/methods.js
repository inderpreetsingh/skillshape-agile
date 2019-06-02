import ClassTimesRequest, {
  ClassTimesRequestSchema,
} from './fields';
import ClassType from '/imports/api/classType/fields';
import School from '/imports/api/school/fields';
import {
  check,
} from 'meteor/check';
import {
  sendRequestReceivedEmail,
  sendEmailForSubscription,
} from '/imports/api/email/';
import {
  getUserFullName,
} from '/imports/util/getUserData';
import {
  sendClassTimesRequest,
} from '/imports/api/email';

Meteor.methods({
  'classTimesRequest.addRequest': (dataCopy, subscriptionRequest) => {
    check(dataCopy, Object);
    check(subscriptionRequest, String);
    const data = dataCopy;
    if (!this.userId) {
      // check for user
      const userData = Meteor.users.findOne({
        'emails.address': data.email,
      });
      if (userData) {
        throw new Meteor.Error('user exists', 'user data already exists with this email account');
      }
    } else  {
      const currentUser = Meteor.users.findOne({
        _id: this.userId,
      });
      data.name = getUserFullName(currentUser);
      data.email = currentUser.emails[0].address;
      data.existingUser = true;
      data.userId = this.userId;
    } 

    // Now we gonna validate the data..
    const validationContext = ClassTimesRequestSchema.newContext();
    data.createdAt = new Date();
    data.notification = false;
    const isValid = validationContext.validate(data);

    // Verfiying the data send..
    if (isValid) {
      // console.log('adding price request..');
      const classTimesRequestAlreadyPresent = ClassTimesRequest.findOne({
        email: data.email,
        classTypeId: data.classTypeId,
        schoolId: data.schoolId,
      });

      if (classTimesRequestAlreadyPresent) {
        throw new Meteor.Error('Already requested for class times with this email address');
      } else {
        const fromEmail = 'Notices@SkillShape.com';
        const schoolData = School.findOne({
          _id: data.schoolId,
        });
        const classTypeName = data.classTypeId ? ClassType.findOne({
          _id: data.classTypeId,
        }).name : '';
        const {slug,_id:schoolId,admins,superAdmin} = schoolData;
        const memberLink = this.userId ? `${Meteor.absoluteUrl()}schools/${slug}/members?userId=${this.userId}` : '';
        const updateClassTimesLink = `${Meteor.absoluteUrl()}SchoolAdmin/${schoolId}/edit`;
        const schoolPageLink = `${Meteor.absoluteUrl()}schools/${slug}`;
        const currentUserName = data.name;
        const requestFor = 'Class time';

        let ownerName = '';
        let classTimesRequestId = '';
        let toEmail = '';

        // 1. sending mail to the school owner.
        if (admins || superAdmin) {
          // Get Admin of School As school Owner
          const adminUser = Meteor.users.findOne(admins[0] || superAdmin);
          ownerName = getUserFullName(adminUser);
          toEmail = adminUser && adminUser.emails[0].address;
        } else {
          const schoolOwnerData = Meteor.users.findOne({
            'profile.schoolId': data.schoolId,
          });
          ownerName = getUserFullName(schoolOwnerData);
          toEmail = schoolOwnerData && schoolOwnerData.emails[0].address;
        }

        sendRequestReceivedEmail({
          toEmail,
          fromEmail,
          ownerName,
          currentUserName,
          classTypeName,
          schoolPageLink,
          updateLink: updateClassTimesLink,
          memberLink,
          requestFor,
        });

        if (subscriptionRequest === 'save' || this.userId) {
          classTimesRequestId = ClassTimesRequest.insert(data);
        }

        // 2. sending mail to the user.
        if (subscriptionRequest === 'save') {
          const updateFor = `schedule details of ${classTypeName || schoolData.name}`;
          const unsubscribeLink = `${Meteor.absoluteUrl()}unsubscribe?classTimesRequest=true&requestId=${classTimesRequestId}`;
          const subject = `Subscription for schedule of ${classTypeName || schoolData.name}`;
          const joinSkillShapeLink = `${Meteor.absoluteUrl()}`;
          sendEmailForSubscription({
            toEmail: data.email,
            fromEmail,
            updateFor,
            currentUserName,
            subject,
            unsubscribeLink,
            joinSkillShapeLink,
          });
        }

        return {
          success: 'Your request has been received',
        };
      }
    } else {
      // Return the errors in case something is invalid.
      const invalidData = validationContext.invalidKeys()[0];
      throw new Meteor.Error(`${invalidData.name} is ${invalidData.value}`);
    }
  },
  'classTimesRequest.getRequestData': (requestId) => {
    check(requestId, String);
    const classTimesRequestData = ClassTimesRequest.findOne({
      _id: requestId,
    });
    if (!classTimesRequestData) {
      throw new Meteor.Error('no class times data has been found with this id.');
    }

    return {
      classTypeName: ClassType.findOne({
        _id: classTimesRequestData.classTypeId,
      }).name,
      schoolName: School.findOne({
        _id: classTimesRequestData.schoolId,
      }).name,
    };
  },
  'classTimesRequest.removeRequest': (requestId) => {
    check(requestId, String);

    return ClassTimesRequest.remove({
      _id: requestId,
    });
  },
  'classTimesRequest.notifyToSchool': ({
    schoolId,
    classTypeId,
    classTypeName,
  }) => {
    check(schoolId, String);
    check(classTypeId, String);
    check(classTypeName, String);

    if (this.userId && schoolId && classTypeId) {
      const classTimesRequestData = ClassTimesRequest.findOne({
        schoolId,
        classTypeId,
        userId: this.userId,
      });
      if (classTimesRequestData) {
        return {
          message: 'You already requested for this class',
        };
      }
      const requestObj = {
        schoolId,
        classTypeId,
        createdAt: new Date(),
        notification: true,
        userId: this.userId,
      };
      ClassTimesRequest.insert(requestObj);

      let superAdminData;
      const currentUserData = Meteor.users.findOne({
        _id: this.userId,
      });
      const schoolOwnerData = Meteor.users.findOne({
        'profile.schoolId': schoolId,
      });

      if (!schoolOwnerData) {
        superAdminData = Meteor.users.findOne({
          roles: 'Superadmin',
        });
      }
      sendClassTimesRequest({
        currentUserData,
        schoolOwnerData,
        superAdminData,
        schoolId,
        classTypeName,
      });
      return {
        emailSuccess: true,
      };
    }
    throw new Meteor.Error('Permission denied!!');
  },
  'classTimesRequest.updateRequest': (data = {}) => {
    const old = ClassTimesRequest.findOne({
      userId: data.userId,
      classTypeId: data.classTypeId,
    });
    if (old && old.notification === data.notification) {
      return 1;
    }
    try {
      const res = ClassTimesRequest.update({
        userId: data.userId,
        classTypeId: data.classTypeId,
      }, {
        $set: data,
      }, {
        upsert: true,
      });
      return res;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },
  'classTimesRequest.getUserRecord': (classTypeId = '') => ClassTimesRequest.findOne({
    userId: this.userId,
    classTypeId,
  }),
});
