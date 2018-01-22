import isEmpty from 'lodash/isEmpty';
import generator from 'generate-password';

import './fields.js';

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
	        Accounts.sendVerificationEmail(userId);

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
	}
})