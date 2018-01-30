import { Meteor } from 'meteor/meteor';
import _skillCategoryObj from "../imports/startup/server/skillCategoryDump";
import "../imports/startup/server";
import SkillCategory from "../imports/api/skillCategory/fields";
import SkillSubject from "../imports/api/skillSubject/fields";

Meteor.startup(() => {
    // Accounts.config({
    //   sendVerificationEmail: true
    // });
    Accounts.emailTemplates.from = 'admin <Notices@SkillShape.com>';
    // The public name of your application. Defaults to the DNS name of the application (eg: awesome.meteor.com).
    Accounts.emailTemplates.siteName = 'skillshape';
    // A Function that takes a user object and returns a String for the subject line of the email.
    Accounts.emailTemplates.verifyEmail.subject = function(user) {
        return 'Confirm Your Email Address';
    };
    // A Function that takes a user object and a url, and returns the body text for the email.
    // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
    Accounts.emailTemplates.verifyEmail.text = function(user, url) {
        url = url.replace('#/', '');
        return 'click on the following link to verify your email address: ' + url;
    };
    Accounts.urls.resetPassword = function(token) {
        return Meteor.absoluteUrl('reset-password/' + token);
    };
    // code to run on server at startup


    if (SkillSubject.find({ _mig_: 1 }).count() == 0) {
        console.log("_____SkillSubject dump start___");
        SkillSubject.remove({});
        SkillCategory.remove({});

        for (var key in _skillCategoryObj) {
            let objId = SkillCategory.insert({ name: key, _mig_: 1 })
            _skillCategoryObj[key].forEach((f) => {
                SkillSubject.insert({
                    name: f,
                    skillCategoryId: objId,
                    _mig_: 1
                });
            })
        }
    }

});

if (Meteor.isServer) {
    S3.config = {
        key: 'AKIAIUDOMFJ4ZGYKIO6Q',
        secret: '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',
        bucket: 'skillshape',
        region: 'us-west-1'
    };
    Accounts.onCreateUser(function(options, user) {
        if (options.profile == null || options.profile == undefined) {
            user.profile = { "role": "Admin", "access_key": Math.random().toString(36).slice(2) }
            // Roles.addUsersToRoles(user._id,'admin')
            // console.log(Roles.userIsInRole(Meteor.userId(),'admin'));
        } else {
            user.profile = options.profile;
        }
        user.profile = _.extend(user.profile, { "user_type": "C" });
        if (options.preverfiedUser) {
            user.emails[0].verified = true;
            return user;
        }
        return user;
    });

    var userFeedBack = function(user, email, message, request) {
        var fromEmail = "Notices@SkillShape.com";
        var toEmail = "Notices@SkillShape.com";
        Email.send({
            from: fromEmail,
            to: toEmail,
            replyTo: fromEmail,
            subject: "skillshape Feedback",
            text: "Hi ,\nWe have feedback from : " + user + "(" + email + ")" +
                "\nHis feedback request is : " + request + "\n" +
                "\nMessage : " + message + "\n\n" +
                "Thank you.\n" +
                "The skillshape Team.\n" + Meteor.absoluteUrl() + "\n"
            // + "http://www.graphical.io/assets/img/Graphical-IO.png"
        });
    }

    var userPasswordReset = function(user, pass) {
        var fromEmail = "Notices@SkillShape.com";
        var toEmail = user.emails[0].address;
        Email.send({
            from: fromEmail,
            to: toEmail,
            replyTo: fromEmail,
            subject: "skillshape Password Reset",
            text: "Hi " + user.emails[0].address + ",\nYour password has been reset." +
                "\nYour new password is : " + pass + "\n\n" +
                "Thank you.\n" +
                "The skillshape Team.\n" + Meteor.absoluteUrl() + "\n"
            // +"http://www.graphical.io/assets/img/Graphical-IO.png"
        });
    }

    Meteor.publish("roles", function() {
        return Meteor.roles.find({});
    });

    var absolutePath = function(domain, href) {
        var url = require('url');
        var link = url.resolve(domain, href)
        return link
    }


    Meteor.methods({
        sendVerificationLink() {
            var userId = Meteor.userId();
            if (userId) {
                return Accounts.sendVerificationEmail(userId);
            }
        },
        get_url: function(url) {
            return Meteor.http.get(url, { headers: { "User-Agent": "Meteor/1.0" }, timeout: 25000 });
        },
        sendfeedbackToAdmin: function(user, email, message, request) {
            userFeedBack(user, email, message, request)
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