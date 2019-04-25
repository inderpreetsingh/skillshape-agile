
import { check } from 'meteor/check';
import { errorBoundaryEmail, sendEmail ,userRegistrationAndVerifyEmail} from "/imports/api/email";

Meteor.methods({
  "emailMethods.sendEmail": function (data) {
    try {
     check(data,Object);
      sendEmail(data);
      return true;
    } catch (error) {
      console.log('​error in emailMethods.sendEmail', error)
      throw new Meteor.Error(error);
    }
  },
  "emailMethods.testEmailVerifyPage":function () {
    userRegistrationAndVerifyEmail(Meteor.user(),
    "verificationToken",
    "passwd",
    "fromEmail",
    "naruto@ryaz.io",
    "schoolName")
  },
  'emailMethods.errorBoundary':({error,errorInfo,url})=>{
    errorBoundaryEmail({error,errorInfo,url});
}
});
