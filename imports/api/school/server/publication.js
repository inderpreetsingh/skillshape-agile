import ClassType from "/imports/api/classType/fields";

Meteor.publish("school.getSchoolByGeoBound", function({zoomLevel, NEPoint, SWPoint}) {
	console.log("---- school.getSchoolByGeoBound called ----")
	return SLocation.find({ loc: { $geoWithin: { $box: [NEPoint, SWPoint] } } });
});