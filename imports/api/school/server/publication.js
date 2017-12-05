import ClassType from "/imports/api/classType/fields";

Meteor.publish("school.getSchoolByGeoBound", function({zoom, NEPoint, SWPoint}) {
	console.log("school.getSchoolByGeoBound NEPoint-->>",NEPoint)
	console.log("school.getSchoolByGeoBound SWPoint-->>",SWPoint)
	const locationList =  SLocation.find({ loc: { $geoWithin: { $box: [NEPoint, SWPoint] } } });
	
	const schoolIds = locationList.fetch().map((locationObj) => {
        if(locationObj.schoolId)
        	return locationObj.schoolId;
    })

	console.log("Location count", locationList.count());
	console.log("School count", School.find({ _id: { $in: schoolIds}}).count());
	console.log("SkillClass count", SkillClass.find({ schoolId: { $in: schoolIds}}).count());
	console.log("ClassType count", ClassType.find({ schoolId: { $in: schoolIds}}).count());

	return [
		locationList, 
		School.find({ _id: { $in: schoolIds}}), 
		SkillClass.find({ schoolId: { $in: schoolIds}}),
		ClassType.find({ schoolId: { $in: schoolIds}}),
	]
});