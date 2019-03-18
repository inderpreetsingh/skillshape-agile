
import {userRegistrationAndVerifyEmail} from "/imports/api/email";
Meteor.methods({
    'test.userReg':function () {
        try{
           
            userRegistrationAndVerifyEmail(Meteor.user(),
                "verificationToken",
                "passwd",
                "fromEmail",
                "ramesh.bansal@daffodilsw.com",
                "schoolName")
        }
        catch(error){
			console.log('error in test methods', error)
        }
    }
})