import ClassType from "/imports/api/classType/fields";
import School from "./fields";

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
		}
	},
	"school.getConnectedSchool": function (userId) {
        let schoolList = []
        const user = Meteor.users.findOne({ _id: userId });
        if (user && user.profile && user.profile.classIds && user.profile.classIds.length > 0) {
	        classIds = user.profile.classIds
	        let demand = Demand.find({ userId: userId, classId: { $in: classIds } })
	        schoolList = demand.map(function (a) {
	          return a.schoolId
	        })
        }
        return School.find({ _id: { $in: schoolList } }).fetch();
    },
    "school.getMySchool": function (school_id, userId) {
        console.log("school.getMySchool -->>",school_id);
        school = School.findOne({ _id: school_id });
        if (school) {

        } else {
        	Meteor.users.update({ _id: userId }, { $set: { "profile.schoolId": " " } });
        }
      	return School.find({ _id: school_id }).fetch();
    },
    "school.claimSchool": function (userId, schoolId) {
        const data = {}
        data.userId = userId;
        data.claimed = 'Y'
        School.update({ _id: schoolId }, { $set: data });
        return Meteor.users.update({ _id: data.userId }, { $set: { "profile.schoolId": schoolId, "profile.acess_type": "school" } });
    },
    "school.publishSchool": function (schoolId, is_publish) {
        
        return School.update({ _id: schoolId }, { $set: { "is_publish": is_publish } });
    }
})