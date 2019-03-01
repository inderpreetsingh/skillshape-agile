
import { check } from 'meteor/check';
import { get, isEmpty,cloneDeep,isArray,compact } from 'lodash';
import { sendEmail } from "/imports/api/email";

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
  }
});
