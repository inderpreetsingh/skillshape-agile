import ClassTimesRequest from "./fields";
import get from 'lodash/get';
import { sendClassTimesRequest } from "/imports/api/email";

Meteor.methods({
    "classTimesRequest.notifyToSchool": function({schoolId, classTypeId, classTypeName}) {
    	if (this.userId && schoolId && classTypeId) {
    		// console.log("classTimesRequest.notifyToSchool -->>", schoolId, classTypeId)
    		// first check your request already have or not
    		const classTimesRequestData = ClassTimesRequest.findOne({schoolId, classTypeId, userId: this.userId });
    		// console.log("classTimesRequestData -->>",classTimesRequestData)
    		if(classTimesRequestData) {
    			return { message: "You already requested for this class"};
    		} else {
	    		const requestObj = {
	    			schoolId,
	    			classTypeId,
	    			createdAt: new Date(),
	    			notification: true,
	    			userId: this.userId,
	    		}
	    		ClassTimesRequest.insert(requestObj);

				let superAdminData;
	    		const currentUserData = Meteor.users.findOne({_id: this.userId});
	    		const schoolOwnerData = Meteor.users.findOne({"profile.schoolId": schoolId});

				if(!schoolOwnerData) {
	    			superAdminData = Meteor.users.findOne({"roles": "Superadmin"});
				}
	    		sendClassTimesRequest({currentUserData, schoolOwnerData, superAdminData, schoolId, classTypeName});
    		    return {emailSuccess:true};
            }

    	} else {
			throw new Meteor.Error("Permission denied!!");
    	}
    }
})