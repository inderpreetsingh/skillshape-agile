import ClassTimesRequest, {ClassTimesRequestSchema} from "./fields";
import ClassType from '/imports/api/classType/fields.js';
import School from '/imports/api/school/fields.js';

import {sendRequestReceivedEmail, sendEmailForSubscription} from '/imports/api/email/index.js';
import { getUserFullName } from '/imports/util/getUserData';

import get from 'lodash/get';
import { sendClassTimesRequest } from "/imports/api/email";

Meteor.methods({
  "classTimesRequest.addRequest": function(data, subscriptionRequest) {
    if(!this.userId) {
      // check for user
      const userData = Meteor.users.findOne({"emails.address": data.email});
      if(userData) {
        throw new Meteor.Error("user exists","user data already exists with this email account");
      }
    }else if(this.userId) {
      const currentUser = Meteor.users.findOne({_id : this.userId});
      data.name = getUserFullName(currentUser);
      data.email = currentUser.emails[0].address;
      data.existingUser = true;
      data.userId = this.userId;
    }else {
      data.existingUser = false;
    }

    // Now we gonna validate the data..
    const validationContext = ClassTimesRequestSchema.newContext();
    data.createdAt = new Date();
    const isValid = validationContext.validate(data);

    // Verfiying the data send..
    if (isValid) {
      // console.log('adding price request..');
      const classTimesRequestAlreadyPresent = ClassTimesRequest.findOne({email: data.email, classTypeId: data.classTypeId, schoolId: data.schoolId});

      if(classTimesRequestAlreadyPresent) {
        return {
          message: "Already requested for class times for this class, with this email address"
        }
      }else {
        /***
        * 1. Now here we will have to send a mail to the school owner. (different emails for registered/unregistered user)
        * 2. Then send a mail to user in case the request is for subscribing to the updates..
        ***/
        const fromEmail = 'Notices@SkillShape.com';
        const schoolData = School.findOne({_id: data.schoolId});
        const classTypeName = data.classTypeId ? ClassType.findOne({_id: data.classTypeId}).name : '';
        const memberLink = this.userId ? `${Meteor.absoluteUrl()}schools/${schoolData.slug}/members` : '';
        const updateClassTimesLink = `${Meteor.absoluteUrl()}SchoolAdmin/${schoolData._id}/edit`;
        const schoolPageLink = `${Meteor.absoluteUrl()}schools/${schoolData.slug}`;
        const currentUserName = data.name;
        const requestFor = "Schedule";

        let ownerName = '';
        let classTimesRequestId = '';
        let toEmail = '';

         // 1. sending mail to the school owner.
         if(schoolData) {
            // Get Admin of School As school Owner
           const adminUser = Meteor.users.findOne(schoolData.admins[0] || schoolData.superAdmin);
           ownerName= getUserFullName(adminUser);
           toEmail = adminUser && adminUser.emails[0].address;
         }else {
           const schoolOwnerData = Meteor.users.findOne({"profile.schoolId": data.schoolId});
           ownerName = getUserFullName(schoolOwnerData);
           toEmail = schoolOwnerData && adminUser.emails[0].address;
         }

         sendRequestReceivedEmail({toEmail, fromEmail, ownerName, currentUserName,  classTypeName, schoolPageLink, updateLink: updateClassTimesLink, memberLink, requestFor});

         if(subscriptionRequest === 'save' || this.userId)
            classTimesRequestId = ClassTimesRequest.insert(data);

         //2. sending mail to the user.
         if(subscriptionRequest === 'save') {
           const toEmail = data.email;
           const updateFor = `schedule details of ${classTypeName || schoolData.name}`;
           const unsubscribeLink = `${Meteor.absoluteUrl()}unsubscribe?classTimesRequest=true&requestId=${classTimesRequestId}`;
           const subject = `Subscription for schedule of ${classTypeName || schoolData.name}`;
           const joinSkillShapeLink = `${Meteor.absoluteUrl()}`;
           console.log(toEmail, fromEmail, updateFor, currentUserName, subject, unsubscribeLink, joinSkillShapeLink);
           sendEmailForSubscription({toEmail, fromEmail, updateFor, currentUserName, subject, unsubscribeLink, joinSkillShapeLink});
         }

         return {
           'success': 'Your request has been received'
         }
      }
    }else {
      // Return the errors in case something is invalid.
      const invalidData = validationContext.invalidKeys()[0];
      throw new Meteor.Error(invalidData.name +' is '+ invalidData.value);
    }
  },
  'classTimesRequest.getRequestData': function(requestId) {
      const classTimesRequestData = ClassTimesRequest.findOne({_id: requestId});
      if(!classTimesRequestData) {
        throw new Meteor.Error('no class times data has been found with this id.');
      }

      return {
        classTypeName: ClassType.findOne({_id: classTimesRequestData.classTypeId}).name,
        schoolName: School.findOne({_id: classTimesRequestData.schoolId}).name
      }
    },
   'classTimesRequest.removeRequest': function(requestId) {
     return ClassTimesRequest.remove({_id: requestId});
    },
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
