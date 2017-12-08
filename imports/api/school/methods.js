import ClassType from "/imports/api/classType/fields";

Meteor.methods({
	editSchool: function (id, data) {
		let schoolData = School.findOne({_id: id});
		if(schoolData && schoolData.name !== data.name) {
	    	ClassType.update({schoolId: id}, { $set:{ "filters.schoolName": data.name }})	
		}
        return School.update({ _id: id }, { $set: data });
    },
	getClassesForMap: function ({schoolId}) {
		return {
			school: School.findOne({ _id: schoolId}), 
			// skillClass: Classes.find({ schoolId: schoolId}).fetch(),
			// classType: ClassType.find({ schoolId: schoolId}).fetch(),
		}
	}
})