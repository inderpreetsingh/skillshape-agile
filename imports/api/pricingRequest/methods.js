import PricingRequest,{PricingRequestSchema} from './fields.js';
import {sendPriceInfoRequestEmail, sendEmailForSubscription} from '/imports/api/email/index.js';
import SchoolMemberDetails from '/imports/api/schoolMemberDetails/fields.js';
import ClassType from '/imports/api/classType/fields.js';

import { getUserFullName } from '/imports/util/getUserData';


Meteor.methods({
  'pricingRequest.addRequest': function(data,schoolData,subscriptionRequest) {
    const validationContext = PricingRequestSchema.newContext();
    data.createdAt = new Date();
    const isValid = validationContext.validate(data);

    if(!this.userId) {
      // check for user
      const userData = Meteor.users.findOne({"emails.address": data.email});
      if(userData) {
        throw new Meteor.Error("user exists","user data already exists with this email account");
      }
    }else if(this.userId) {
      data.existingUser = true;
      data.userId = this.userId;
      data.email = Meteor.users.findOne({_id: this.userId}).emails[0].address;
    }else {
      data.existingUser = false;
    }

    // Verfiying the data send..
    if (isValid) {
      // console.log('adding price request..');
      const pricingRequestAlreadyPresent = PricingRequest.findOne({email: data.email, classTypeId: data.classTypeId, schoolId: data.schoolId});

      if(pricingRequestAlreadyPresent) {

        return {
          message: "Already requested for price for this class, with this email address"
        }
      }else {
        const fromEmail = 'Notices@SkillShape.com';
        const classTypeName = ClassType.findOne({_id: data.classTypeId}).name;
        const updatePriceLink = `${Meteor.absoluteUrl()}SchoolAdmin/${schoolData.schoolId}/edit`;
        /**
         * 1. Now here we will have to send a mail to the school owner. (different emails for registered/unregistered)
         * 2. Then sending a new mail to user in case the request is for subscribing to the updates..
         */

         // 1. sending mail to the school owner.
         let ownerName = "";
         let memberLink = "";
         let pricingRequestId = ''
         let toEmail = 'sam@skillshape.com'; // Needs to replace by Admin of School
         if(schoolData) {
             // Get Admin of School As school Owner
             const adminUser = Meteor.users.findOne(schoolData.admins[0] || schoolData.superAdmin);
             console.log(adminUser,"admin user");
             ownerName= getUserFullName(adminUser);
             console.log(ownerName,"ownerName")
             toEmail = ownerName && adminUser.emails[0].address;
         }
         let currentUser = Meteor.users.findOne(this.userId);
         let currentUserName = getUserFullName(currentUser) || data.name;
         let schoolMemberData = SchoolMemberDetails.findOne({activeUserId: this.userId});

         if(schoolMemberData) {
             memberLink = `${Meteor.absoluteUrl()}schools/${schoolData.slug}/members`;
         }
         toEmail = 'singhs.ishwer@gmail.com';
         sendPriceInfoRequestEmail({toEmail,fromEmail,ownerName, classTypeName,currentUserName,updatePriceLink, memberLink});

         if(subscriptionRequest === 'save' || this.userId)
            pricingRequestId = pricingRequestId = PricingRequest.insert(data);

         //2. sending mail to the user.
         if(subscriptionRequest === 'save') {
           const toEmail = data.email;
           const updateFor = `Pricing details for ${classTypeName}`;
           const currentUserName = data.name;
           const unsubscribeLink = `${Meteor.absoluteUrl()}unsubscribe?pricingRequest=true&requestId=${pricingRequestId}`;
           const subject = `Subscription for prices of ${classTypeName}`;
           const joinSkillShapeLink = `${Meteor.absoluteUrl()}`;
           console.log(subject,joinSkillShapeLink,unsubscribeLink,currentUserName,updateFor,toEmail);
           sendEmailForSubscription({toEmail, fromEmail, updateFor, currentUserName, subject, unsubscribeLink, joinSkillShapeLink});
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
  }
})
