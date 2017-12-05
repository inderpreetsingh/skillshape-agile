import ClassType from "/imports/api/classType/fields";

Meteor.methods({
	getClassesForMap: function ({schoolId}) {
		return {
			school: School.findOne({ _id: schoolId}), 
			skillClass: SkillClass.find({ schoolId: schoolId}).fetch(),
			classType: ClassType.find({ schoolId: schoolId}).fetch(),
		}
	}
})