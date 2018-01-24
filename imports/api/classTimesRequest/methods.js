import ClassTimesRequest from "./fields";
import get from 'lodash/get';
import { sendClassTimesRequest } from "/imports/api/email";

Meteor.methods({
    "classTimesRequest.notifyToSchool": function({schoolId, classTypeId, classTypeName}) {
    	if (this.userId && schoolId && classTypeId) {
    		console.log("classTimesRequest.notifyToSchool -->>", schoolId, classTypeId)
    		// first check your request already have or not
    		const classTimesRequestData = ClassTimesRequest.findOne({schoolId, classTypeId, userId: this.userId });
    		console.log("classTimesRequestData -->>",classTimesRequestData)
    		if(classTimesRequestData) {
    			return { message: "You already requested for this class"};
    		} else {
	    		let emailObj = {};
	    		const requestObj = {
	    			schoolId,
	    			classTypeId,
	    			createdAt: new Date(),
	    			notification: true,
	    			userId: this.userId,
	    		}
	    		ClassTimesRequest.insert(requestObj);

	    		const currentUserData = Meteor.users.findOne({_id: this.userId});
	    		const schoolOwnerData = Meteor.users.findOne({"profile.schoolId": schoolId});
				const userName = get(currentUserData, "profile.name") || `${get(currentUserData, "profile.firstName")} ${get(currentUserData, "profile.lastName")}`;

	    		if(schoolOwnerData && currentUserData) {
	    			const schoolOwnername = get(schoolOwnerData, "profile.name") || `${get(schoolOwnerData, "profile.firstName")} ${get(schoolOwnerData, "profile.lastName")}`;
	    			emailObj.to = schoolOwnerData.emails[0].address;
	    			emailObj.subject = "Class Interest";
	    			emailObj.text = `Hi ${schoolOwnername}, \n${userName} is interested in learning more about your ${classTypeName} class. \nPlease click this link to update your listing: \n${Meteor.absoluteUrl(`SchoolAdmin/${schoolId}/edit`)} \n\nThanks, \n\nEveryone from SkillShape.com`;
	    		} else {
	    			const superAdminData = Meteor.users.findOne({"roles": "Superadmin"});
	    			emailObj.to = superAdminData.emails[0].address;
	    			emailObj.subject = "School Admin not found",
	    			emailObj.text = `Hi SuperAdmin \nCorresponding to this schoolId ${schoolId} there is no admin assign yet \n\nThanks, \n\nEveryone from SkillShape.com`;
	    		}
	    		console.log("Email Obj -->>",JSON.stringify(emailObj, null, "  "))
	    		return sendClassTimesRequest({...emailObj});
    		}

    	} else {
			throw new Meteor.Error("Permission denied!!");
    	}
    }
})