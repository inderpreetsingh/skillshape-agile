import isEmpty from 'lodash/isEmpty';

Meteor.methods({
	"user.createUser": function({ name, email, userType}) {
		if(!isEmpty(name) && !isEmpty(email) ) {

			//Create user first
			const id = Accounts.createUser({
	            email: email,
	            // TODO: Check if this gets hashed.
	            password: password,
	            profile: {
	               role: userType || 'Normal',
	               name: name
	            }
	        });
			console.log("user.createUser id-->>",id);

			//Then create token
			var token = Accounts._generateStampedLoginToken()
            Accounts._insertLoginToken(user.userId, token);

            let userId = this.userId;
            Accounts.sendVerificationEmail( userId );
		}
	}
})