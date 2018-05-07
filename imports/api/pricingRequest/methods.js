import PricingRequest,{PricingRequestSchema} from './fields.js';

Meteor.methods({
  'pricingRequest.addRequest': function(data,schoolAdminId,subscriptionRequest) {
    const validationContext = PricingRequestSchema.newContext();
    const isValid = validationContext.validate(data);
    data.createdAt = new Date();

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
      const pricingRequestAlreadyPresent = PricingRequest.find({email: data.email}).fetch()[0];
      if(pricingRequestAlreadyPresent) {
        return {
          message: "Already requested for price with this email address"
        }
      }else {
        /**
         * 1. Now here we will have to send a mail to the school owner. (different emails for registered/unregistered)
         * 2. Then sending a new mail in case the request is for subscribing to the updates..
         *
         */

         // Send Email to Admin of School if admin available
         let ownerName;
         const toEmail = 'sam@skillshape.com'; // Needs to replace by Admin of School
         const fromEmail = 'Notices@SkillShape.com';
         const updatePriceLink = `${Meteor.absoluteUrl()}SchoolAdmin/${data.schoolId}/edit`;
         if(schoolAdminId) {
             // Get Admin of School As school Owner
             let adminUser = Meteor.users.findOne(schoolAdminId);
             ownerName= getUserFullName(adminUser);
             toEmail = adminUser.emails[0].address;
         }
         if(!ownerName) {
             // Owner Name will be Sam
             ownerName = 'Sam'
         }
         let currentUser = Meteor.users.findOne(this.userId);
         let currentUserName = getUserFullName(currentUser) || data.name;
        //  sendPriceInfoRequestEmail({toEmail,fromEmail,updatePriceLink, ownerName, currentUserName});
         return {emailSent:true};

         if(subscriptionRequest === 'save')
             PricingRequest.insert(data);

      }
    }else {
      // Return the errors in case something is invalid.
      const invalidData = validationContext.invalidKeys()[0];
      console.log("validation errors...",validationContext.invalidKeys());
      throw new Meteor.Error(invalidData.name +' is '+ invalidData.value);
    }
  }
})
