import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import generator from "generate-password";

import "./fields.js";
import { userRegistrationAndVerifyEmail } from "/imports/api/email";
import { getUserFullName } from "/imports/util/getUserData";

Meteor.methods({
  "user.createUser": function({
    name,
    email,
    userType,
    sendMeSkillShapeNotification,
    signUpType,
    birthYear
  }) {
    if (!isEmpty(name) && !isEmpty(email)) {
      const password = generator.generate({
        length: 10,
        numbers: true
      });

      const accessType = userType || "Anonymous";

      const userObj = {
        email: email,
        password: password,
        profile: {
          name: name,
          passwordSetByUser: false,
          userType: accessType,
          sendMeSkillShapeNotification: sendMeSkillShapeNotification
        },
        sign_up_service: signUpType || "Unknown"
      };

      if (birthYear) {
        userObj.profile.birthYear = birthYear;
      }

      if (signUpType && signUpType === "skillshape-signup") {
        userObj.term_cond_accepted = true;
      }

      const userId = Accounts.createUser(userObj);

      Roles.addUsersToRoles(userId, accessType);
      const userRec = Accounts.generateVerificationToken(userId);
      let urlToken = `${Meteor.absoluteUrl()}verify-email/${userRec.token}`;
      let user = Meteor.users.findOne(userId);
      let fromEmail = "Notices@SkillShape.com";
      userRegistrationAndVerifyEmail(
        user,
        urlToken,
        password,
        fromEmail,
        email
      );
      return { user: user, password: password };
    } else {
      throw new Meteor.Error("Cannot process due to lack of information");
    }
  },
  "user.onSocialSignUp": function({
    name,
    email,
    userType,
    sendMeSkillShapeNotification
  }) {
    if (this.userId) {
      const accessType = userType || "Anonymous";
      let userData = Meteor.users.findOne({ _id: this.userId });
      if (get(userData, "profile.userType")) {
        return;
      } else {
        Meteor.users.update(
          {
            _id: this.userId
          },
          {
            $set: {
              "profile.userType": accessType,
              sign_up_service: "social-signup" // this indicates social sign-up i.e facebook or google.
            }
          }
        );

        Roles.addUsersToRoles(this.userId, accessType);
      }
    }
  },
  "user.setPassword": function({ password, logout }) {
    let userLogout = true;
    if (logout === false) userLogout = false;
    if (this.userId) {
      Meteor.users.update(
        { _id: this.userId },
        { $set: { "profile.passwordSetByUser": true } }
      );
      return Accounts.setPassword(this.userId, password, {
        logout: userLogout
      });
    } else {
      throw new Meteor.Error("User not found!!");
    }
  },
  "user.editUser": function({ doc, docId }) {
    if (this.userId === docId) {
      return Meteor.users.update({ _id: docId }, { $set: doc });
    } else {
      return new Meteor.Error("Permission Denied!!");
    }
  },
  "user.sendVerificationEmailLink": function(email) {
    if (email) {
      let user = Meteor.users.findOne({ "emails.address": email });
      if (user && user._id) {
        return Accounts.sendVerificationEmail(user._id);
      }
      throw new Meteor.Error(
        ` User not found corresponding to this email address "${email}" `
      );
    }
    throw new Meteor.Error("Invalid email address!!");
  },
  "user.getUsers": function({ limit, skip }) {
    if (this.userId && Roles.userIsInRole(this.userId, "Superadmin")) {
      const filters = {};
      return {
        usersData: Meteor.users
          .find(filters, { limit: limit, skip: skip })
          .fetch(),
        usersCount: Meteor.users.find(filters).count()
      };
    } else {
      return new Meteor.Error("Permission Denied!!");
    }
  },
  "user.getAllUsersCount": function({}) {
    if (this.userId && Roles.userIsInRole(this.userId, "Superadmin")) {
      const filters = {};
      return {
        usersCount: Meteor.users.find(filters).count()
      };
    } else {
      return new Meteor.Error("Permission Denied!!");
    }
  },
  "user.checkForRegisteredUser": function({ email,adminView }) {
    if (email) {
      const userData = Meteor.users.findOne({ "emails.address": email });
      if (userData) {
        let userName = getUserFullName(userData);
        return {
          userInfo: `${userName}  at ${email} already exists. Is this your ${!adminView ? "student ": " known"}?`,
          userId:userData._id
        };
      } else {
        throw new Meteor.Error("No User Found with this Email!!!");
      }
    } else {
      throw new Meteor.Error("Email Address not found!!");
    }
  },
 
});
