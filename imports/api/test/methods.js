
import {userRegistrationAndVerifyEmail} from "/imports/api/email";
Meteor.methods({
    'test.userReg':function () {
        try{
           
            userRegistrationAndVerifyEmail(Meteor.user(),
                "verificationToken",
                "passwd",
                "fromEmail",
                "naruto@ryaz.io",
                "schoolName")
        }
        catch(error){
			console.log('error in test methods', error)
        }
    }
})