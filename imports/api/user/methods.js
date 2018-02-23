import isEmpty from 'lodash/isEmpty';
import generator from 'generate-password';

import './fields.js';
import { userRegistrationAndVerifyEmail } from "/imports/api/email";


Meteor.methods({
	"user.createUser": function({ name, email, userType, sendMeSkillShapeNotification}) {
		if(!isEmpty(name) && !isEmpty(email) ) {

			const password = generator.generate({
			    length: 10,
			    numbers: true
			});
			const accessType = userType || "Anonymous";

			const userId = Accounts.createUser({
	            email: email,
	            password: password,
	            profile: {
	                name: name,
	            	passwordSetByUser: false,
	            	userType: accessType,
	            	sendMeSkillShapeNotification: sendMeSkillShapeNotification,
	            },
	        });
            Roles.addUsersToRoles(userId, accessType);
            const userRec = Accounts.generateVerificationToken(userId);
	        let urlToken = `${Meteor.absoluteUrl()}verify-email/${userRec.token}`;
	        let user = Meteor.users.findOne(userId);
	        let fromEmail = "Notices@SkillShape.com";
	        userRegistrationAndVerifyEmail(user,urlToken, password,fromEmail, email);
	        return {user:user,password:password};
		} else {
			throw new Meteor.Error("Cannot process due to lack of information");
		}
	},
	"user.onSocialSignUp": function({ name, email, userType, sendMeSkillShapeNotification }) {
	    console.log("this.userId", this.userId);
	    if (this.userId) {
	        const accessType = userType || "Anonymous";

	        Meteor.users.update({
	            _id: this.userId
	        }, {
	            $set: {
	                'profile.userType': accessType,
	            }
	        });

	        Roles.addUsersToRoles(this.userId, accessType);
	    }
	},
	"user.setPassword": function({password}) {
		if(this.userId) {
			Meteor.users.update({ _id: this.userId},{ $set: { "profile.passwordSetByUser": true } });
			return Accounts.setPassword(this.userId, password)
		} else {
			throw new Meteor.Error("User not found!!");
		}
	},
	"user.editUser": function({ doc, docId}) {
     	if(this.userId === docId){
       		return Meteor.users.update({_id: docId},{$set:doc});
     	} else {
     		return new Meteor.Error("Permission Denied!!");
     	}
    },
    "user.sendVerificationEmailLink": function(email) {
    	if(email) {
	    	let user = Meteor.users.findOne({"emails.address": email})
	    	if(user && user._id) {
	    		return Accounts.sendVerificationEmail(user._id);
	    	}
	    	throw new Meteor.Error(` User not found corresponding to this email address "${email}" ` );
    	}
    	throw new Meteor.Error("Invalid email address!!");
    }
})