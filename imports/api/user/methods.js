import isEmpty from 'lodash/isEmpty';
import generator from 'generate-password';

import './fields.js';

Meteor.methods({
	"user.createUser": function({ name, email, userType}) {
		if(!isEmpty(name) && !isEmpty(email) ) {

			var password = generator.generate({
			    length: 10,
			    numbers: true
			});
			const userId = Accounts.createUser({
	            email: email,
	            password: password,
	            profile: {
	                name: name,
	            	passwordSetByUser: false,
	            },
	        });
	        Accounts.sendVerificationEmail(userId);
		} else {
			throw new Meteor.Error("Cannot process due to lack of information");
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