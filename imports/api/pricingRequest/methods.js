import PricingRequest,{PricingRequestSchema} from './fields.js';
import {sendPriceInfoRequestEmail, sendEmailForSubscription} from '/imports/api/email/index.js';
import SchoolMemberDetails from '/imports/api/schoolMemberDetails/fields.js';
import ClassType from '/imports/api/classType/fields.js';
import School from '/imports/api/school/fields.js';

import { getUserFullName } from '/imports/util/getUserData';

Meteor.methods({
  'pricingRequest.addRequest': function(data,schoolData,subscriptionRequest) {

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
    const validationContext = PricingRequestSchema.newContext();
    data.createdAt = new Date();
    const isValid = validationContext.validate(data);

    // Verfiying the data send..
    if (isValid) {
      let pricingRequestAlreadyPresent;
      if(data.classTypeId) {
        pricingRequestAlreadyPresent = PricingRequest.findOne({email: data.email, classTypeId: data.classTypeId, schoolId: data.schoolId});
      }else {
        pricingRequestAlreadyPresent = PricingRequest.findOne({email: data.email, schoolId: data.schoolId , classTypeId : {$exists: false}});
      }
      // console.info('pricingRequestAlreadyPresent',pricingRequestAlreadyPresent,PricingRequest.find({email: data.email, schoolId: data.schoolId, classTypeId : {$exists: false}}).fetch(),"request already present..")
      if(pricingRequestAlreadyPresent) {
        return {
          message: "Already requested for price for this class, with this email address"
        }
      }else {
        const fromEmail = 'Notices@SkillShape.com';
        const classTypeName = data.classTypeId && ClassType.findOne({_id: data.classTypeId}).name;
        const updatePriceLink = `${Meteor.absoluteUrl()}SchoolAdmin/${schoolData._id}/edit`;
        const schoolPageLink = `${Meteor.absoluteUrl()}schools/${schoolData.slug}`;
        const currentUserName = data.name;

        let ownerName = "";
        let memberLink = "";
        let pricingRequestId = '';
        let toEmail = ''; // Needs to replace by Admin of School

        /***
         * 1. Now here we will have to send a mail to the school owner. (different emails for registered/unregistered)
         * 2. Then sending a new mail to user in case the request is for subscribing to the updates..
         ***/

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

         if(this.userId) {
            memberLink = `${Meteor.absoluteUrl()}schools/${schoolData.slug}/members`;
         }
         // console.log(updatePriceLink, schoolPageLink, currentUserName, ownerName, fromEmail, toEmail, memberLink);
         // sendPriceInfoRequestEmail({toEmail, fromEmail, ownerName, currentUserName,  classTypeName, schoolPageLink, updatePriceLink, memberLink});

         if(subscriptionRequest === 'save' || this.userId)
            pricingRequestId = PricingRequest.insert(data);

         //2. sending mail to the user.
         if(subscriptionRequest === 'save') {
           const toEmail = data.email;
           const updateFor = `pricing details of ${classTypeName || schoolData.name}`;
           const unsubscribeLink = `${Meteor.absoluteUrl()}unsubscribe?pricingRequest=true&requestId=${pricingRequestId}`;
           const subject = `Subscription for prices of ${classTypeName || schoolData.name}`;
           const joinSkillShapeLink = `${Meteor.absoluteUrl()}`;
           //sendEmailForSubscription({toEmail, fromEmail, updateFor, currentUserName, subject, unsubscribeLink, joinSkillShapeLink});
         }

         return {
           'success': 'Your request has been received'
         }
      }
    }else {
      // Return the errors in case something is invalid.
      const invalidData = validationContext.invalidKeys()[0];
      console.log("validation errors...",validationContext.invalidKeys());
      throw new Meteor.Error(invalidData.name +' is '+ invalidData.value);
    }
  },
  'pricingRequest.getSubscriptionData': function(requestId) {
      const pricingRequestData = PricingRequest.findOne({_id: requestId});
      if(!pricingRequestData) {
        throw new Meteor.Error('no pricing data has been found with this id.');
      }

      return {
        classTypeName: ClassType.findOne({_id: pricingRequestData.classTypeId}).name,
        schoolName: School.findOne({_id: pricingRequestData.schoolId}).name
      }
    },
   'pricingRequest.removeRequest': function(requestId) {
     return PricingRequest.remove({_id: requestId});
   }
})
