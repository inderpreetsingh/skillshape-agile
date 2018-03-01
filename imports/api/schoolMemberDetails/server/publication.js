import SchoolMemberDetails from "../fields";
import School from "/imports/api/school/fields.js";
import ClassType from "/imports/api/classType/fields.js";
import isEmpty from "lodash/isEmpty"

Meteor.publish("schoolMemberDetails.getSchoolMemberWithSchool", function({ slug, classTypeIds, memberName}) {
	console.log("slug, classTypeIds, memberName",slug, classTypeIds, memberName)
	if(this.userId && slug) {

		let schoolMemberfilter = {};
		let schoolCursor = School.find({slug:slug});
		let schoolData = schoolCursor.fetch();
		if(isEmpty(schoolData)) {
			return [];
		} else {
			console.log("schoolData",schoolData)
			console.log("ClassType",ClassType.find({schoolId: schoolData[0]._id}).fetch())
			return [
				schoolCursor,
				ClassType.find({schoolId: schoolData[0]._id})
			]
		}
	} else if(this.userId) {

		let activeUserRec = SchoolMemberDetails.find({activeUserId:this.userId}).fetch();
		console.log("activeUserRec -->>",activeUserRec)
		let classTypeIds = activeUserRec.map(data => data.classTypeIds)

		if(!isEmpty(activeUserRec) && !isEmpty(classTypeIds)) {
			return [
				ClassType.find({ _id: { $in: classTypeIds } })
			]
		} else {
			return [];
		}

	} else {
		throw new Meteor.Error("Access Denied!!!");
	}
});