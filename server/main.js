import { Meteor } from "meteor/meteor";
import isEmpty from "lodash/isEmpty";
import _skillCategoryObj from "../imports/startup/server/skillCategoryDump";
import "../imports/startup/server";
import SkillCategory from "../imports/api/skillCategory/fields";
import SkillSubject from "../imports/api/skillSubject/fields";
import {userFeedBack} from "../imports/api/email";
import {welcomeEMail} from '/imports/api/email/welcome_email.js'
Meteor.startup(() => {
  // Accounts.config({
  //   sendVerificationEmail: true
  // });
  Accounts.emailTemplates.from = "admin <Notices@SkillShape.com>";
  // The public name of your application. Defaults to the DNS name of the application (eg: awesome.meteor.com).
  Accounts.emailTemplates.siteName = "skillshape";
  // A Function that takes a user object and returns a String for the subject line of the email.
  Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return "Confirm Your Email Address";
  };
  // A Function that takes a user object and a url, and returns the body text for the email.
  // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
  Accounts.emailTemplates.verifyEmail.html = function(user, url) {
    url = url.replace("#/", "");
    return welcomeEMail(Meteor.user(),url);
  };
  Accounts.urls.resetPassword = function(token) {
    return Meteor.absoluteUrl("reset-password/" + token);
  };
  // code to run on server at startup
  if (SkillSubject.find({ _mig_: 1 }).count() == 0) {
    SkillSubject.remove({});
    SkillCategory.remove({});

    for (var key in _skillCategoryObj) {
      key = key.trim()
      let objId = SkillCategory.insert({ name: key, _mig_: 1 });
      _skillCategoryObj[key].forEach(f => {
        f = f.trim();
        SkillSubject.insert({
          name: f,
          skillCategoryId: objId,
          _mig_: 1
        });
      });
    }
  } else {
    for (var key in _skillCategoryObj) {
      key = key.trim()
      const skillCategoryData = SkillCategory.findOne({ name: key, _mig_: 1 });
      if (isEmpty(skillCategoryData)) {
        let objId = SkillCategory.insert({ name: key, _mig_: 1 });
        _skillCategoryObj[key].forEach(f => {
          f = f.trim();
          SkillSubject.insert({
            name: f,
            skillCategoryId: objId,
            _mig_: 1
          });
        });
      } else {
        _skillCategoryObj[key].forEach(f => {
          f = f.trim();
          const skillSubjectData = SkillSubject.findOne({ name: f, _mig_: 1 });
          if (isEmpty(skillSubjectData)) {
            SkillSubject.insert({
              name: f,
              skillCategoryId: skillCategoryData._id,
              _mig_: 1
            });
          }
        });
      }
    }
  }

  // Adding the `Others` category here manual.
  if (!SkillCategory.findOne({ name: "Others" })) {
    SkillCategory.insert({ name: "Others", _mig: 1 });
  }

  // Adding the 'Others' skillsubject for each category
  // for (var key in _skillCategoryObj) {
  //   let obj = SkillCategory.findOne({ name: key, _mig_: 1 });
  //   _skillCategoryObj[key].forEach(f => {
  //     if (!SkillSubject.findOne({ name: "Others", skillCategoryId: obj._id }))
  //       SkillSubject.insert({
  //         name: "Others",
  //         skillCategoryId: obj._id,
  //         _mig_: 1
  //       });
  //   });
  // }
  // if(SkillCategory.findOne({}))
});

if (Meteor.isServer) {
  S3.config = {
    key: Meteor.settings.AWSAccessKeyId,
    secret: Meteor.settings.AWSSecretAccessKey,
    bucket: Meteor.settings.AWSBucket,
    region: Meteor.settings.AWSRegion
  };
  Accounts.onCreateUser(function(options, user) {
    if (options.sign_up_service) {
      user.sign_up_service = options.sign_up_service;
    }

    if (options.term_cond_accepted) {
      user.term_cond_accepted = options.term_cond_accepted;
    }

        if (user.services) {
            var service = _.keys(user.services)[0];
            if (service == 'facebook') {
                let email = user.services[service].email;
                user.profile = user.profile || {}
                user.profile.firstName = user.services.facebook.first_name;
                user.profile.lastName = user.services.facebook.last_name;
                user.name = `${user.profile.firstName} ${user.profile.lastName}`;
                user.emails = [{address: email, verified: true}]
                let existingUser = Meteor.users.findOne({'emails.address': email});
                if (!existingUser)
                    return user;

        // precaution, these will exist from accounts-password if used
        if (!existingUser.services)
          existingUser.services = { resume: { loginTokens: [] } };
        if (!existingUser.services.resume)
          existingUser.services.resume = { loginTokens: [] };

                // copy across new service info
                existingUser.services[service] = user.services[service];
                /*if(user.services.resume && user.services.resume.loginTokens) {
                    existingUser.services.resume.loginTokens.push(
                        user.services.resume.loginTokens[0]
                    );
                }*/
                // even worse hackery
                Meteor.users.remove({_id: existingUser._id}); // remove existing record
                return existingUser;
            } else if(service == 'google') {
                let email = user.services[service].email;
                user.profile = user.profile || {}
                user.profile.firstName = user.services.google.given_name;
                user.profile.lastName = user.services.google.family_name;
                user.profile.name = user.services.google.name;
                user.emails = [{address: email, verified: true}];

                let existingUser = Meteor.users.findOne({'emails.address': email});
                if (!existingUser)
                    return user;

        // precaution, these will exist from accounts-password if used
        if (!existingUser.services)
          existingUser.services = { resume: { loginTokens: [] } };
        if (!existingUser.services.resume)
          existingUser.services.resume = { loginTokens: [] };

                // copy across new service info
                existingUser.services[service] = user.services[service];
                /*if(user.services.resume && user.services.resume.loginTokens) {
                    existingUser.services.resume.loginTokens.push(
                        user.services.resume.loginTokens[0]
                    );
                }*/
        // even worse hackery
        Meteor.users.remove({ _id: existingUser._id }); // remove existing record
        return existingUser;
      }
    }

    // if (options.profile == null || options.profile == undefined) {
    //     user.profile = { "role": "Admin", "access_key": Math.random().toString(36).slice(2) }
    //     // Roles.addUsersToRoles(user._id,'admin')
    // } else {
    // }
    // user.profile = _.extend(user.profile, { "user_type": "C" });
    // if (options.preverfiedUser) {
    //     user.emails[0].verified = true;
    //     return user;
    // }
    user.profile = options.profile;
    return user;
  });

  // var userFeedBack = function(user, email, message, request, subject) {
  //     var fromEmail = "Notices@SkillShape.com";
  //     var toEmail = "Notices@SkillShape.com";
  //     Email.send({
  //         from: fromEmail,
  //         to: toEmail,
  //         replyTo: fromEmail,
  //         subject: "skillshape feedback",
  //         text: "Hi ,\nWe have feedback from : " + user + "(" + email + ")" +
  //             "\nHis feedback request is : " + request + "\n" +
  //             + (subject ? "\nSubject: "+subject+ "\n\n" : '') +
  //             "\nMessage : " + message + "\n\n" +
  //             "Thank you.\n" +
  //             "The skillshape Team.\n" + Meteor.absoluteUrl() + "\n"
  //         // + "http://www.graphical.io/assets/img/Graphical-IO.png"
  //     });
  // }

 

  var userPasswordReset = function(user, pass) {
    var fromEmail = "Notices@SkillShape.com";
    var toEmail = user.emails[0].address;
    Email.send({
      from: fromEmail,
      to: toEmail,
      replyTo: fromEmail,
      subject: "skillshape Password Reset",
      text:
        "Hi " +
        user.emails[0].address +
        ",\nYour password has been reset." +
        "\nYour new password is : " +
        pass +
        "\n\n" +
        "Thank you.\n" +
        "The skillshape Team.\n" +
        Meteor.absoluteUrl() +
        "\n"
      // +"http://www.graphical.io/assets/img/Graphical-IO.png"
    });
  };

  Meteor.publish("roles", function() {
    return Meteor.roles.find({});
  });

  var absolutePath = function(domain, href) {
    var url = require("url");
    var link = url.resolve(domain, href);
    return link;
  };

  Meteor.methods({
    sendVerificationLink() {
      var userId = Meteor.userId();
      if (userId) {
        return Accounts.sendVerificationEmail(userId);
      }
    },
    get_url: function(url) {
      return Meteor.http.get(url, {
        headers: { "User-Agent": "Meteor/1.0" },
        timeout: 25000
      });
    },
    sendfeedbackToAdmin: function(user, email, message, request, subject) {
      userFeedBack(user, email, message, request, subject);
      return true;
    }
  });
  var restServiceGetCall = function(url) {
    var result = HTTP.get(url);
    if (result.statusCode == 200) {
      response = JSON.parse(result.content);
      return response;
    } else {
      var json = JSON.parse(result.content);
      throw new Meteor.Error(result.statusCode, json.error);
    }
  };
}
