import SLocation from "../fields";

Meteor.publish("location.getSchoolLocation", function({ schoolId }) {
  return SLocation.find({ schoolId });
});

Meteor.publish("salocation", function() {
  return SLocation.find({});
});
