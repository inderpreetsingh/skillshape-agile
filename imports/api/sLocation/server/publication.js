import SLocation from "../fields";
import { check } from 'meteor/check';

Meteor.publish("location.getSchoolLocation", function({ schoolId }) {
    check(schoolId, String);
   return SLocation.find({schoolId});
});

Meteor.publish("salocation", function() {
  return SLocation.find({});
});
