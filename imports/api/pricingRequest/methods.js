import { check } from 'meteor/check';
import PricingRequest, { PricingRequestSchema } from './fields';
import ClassType from '/imports/api/classType/fields';
import { sendEmailForSubscription, sendRequestReceivedEmail } from '/imports/api/email/index';
import School from '/imports/api/school/fields';
import { getUserFullName } from '/imports/util/getUserData';

Meteor.methods({
  'pricingRequest.addRequest': function (data, subscriptionRequest) {
    check(subscriptionRequest, String);
    check(data, Object);
    if (!this.userId) {
      // check for user
      const userData = Meteor.users.findOne({ 'emails.address': data.email });
      if (userData) {
        throw new Meteor.Error('user exists', 'user data already exists with this email account');
      }
    } else {
      const currentUser = Meteor.users.findOne({ _id: this.userId });
      data.name = getUserFullName(currentUser);
      data.email = currentUser.emails[0].address;
      data.existingUser = true;
      data.userId = this.userId;
    }

    // Now we gonna validate the data..
    const validationContext = PricingRequestSchema.newContext();
    data.createdAt = new Date();
    data.notification = false;
    const isValid = validationContext.validate(data);

    // Verfiying the data send..
    if (isValid) {
      let pricingRequestAlreadyPresent;
      if (data.classTypeId) {
        pricingRequestAlreadyPresent = PricingRequest.findOne({
          email: data.email,
          classTypeId: data.classTypeId,
          schoolId: data.schoolId,
        });
      } else {
        pricingRequestAlreadyPresent = PricingRequest.findOne({
          email: data.email,
          schoolId: data.schoolId,
          classTypeId: { $exists: false },
        });
      }
      // console.info('pricingRequestAlreadyPresent',pricingRequestAlreadyPresent,PricingRequest.find({email: data.email, schoolId: data.schoolId, classTypeId : {$exists: false}}).fetch(),"request already present..")
      if (pricingRequestAlreadyPresent) {
        throw new Meteor.Error(
          'Already requested for price for this class, with this email address',
        );
      } else {
        /** *
         * 1. Now here we will have to send a mail to the school owner. (different emails for registered/unregistered)
         * 2. Then send a mail to user in case the request is for subscribing to the updates..
         ** */
        const fromEmail = 'Notices@SkillShape.com';
        const schoolData = School.findOne({ _id: data.schoolId });
        const {
          _id: schoolId, slug, admins, superAdmin,
        } = schoolData;
        const classTypeName = data.classTypeId
          ? ClassType.findOne({ _id: data.classTypeId }).name
          : '';
        const memberLink = this.userId ? `${Meteor.absoluteUrl()}schools/${slug}/members` : '';
        const updatePriceLink = `${Meteor.absoluteUrl()}SchoolAdmin/${schoolId}/edit`;
        const schoolPageLink = `${Meteor.absoluteUrl()}schools/${slug}`;
        const currentUserName = data.name;
        const requestFor = 'Pricing';

        let ownerName = '';
        let toEmail = '';
        let pricingRequestId = '';

        // 1. sending mail to the school owner.
        if (superAdmin || admins) {
          // Get Admin of School As school Owner
          const adminUser = Meteor.users.findOne(admins[0] || superAdmin);
          ownerName = getUserFullName(adminUser);
          toEmail = adminUser && adminUser.emails[0].address;
        } else {
          const schoolOwnerData = Meteor.users.findOne({ 'profile.schoolId': data.schoolId });
          ownerName = getUserFullName(schoolOwnerData);
          toEmail = schoolOwnerData && adminUser.emails[0].address;
        }

        sendRequestReceivedEmail({
          toEmail,
          fromEmail,
          ownerName,
          currentUserName,
          classTypeName,
          schoolPageLink,
          updateLink: updatePriceLink,
          memberLink,
          requestFor,
        });

        if (subscriptionRequest === 'save' || this.userId) pricingRequestId = PricingRequest.insert(data);

        // 2. sending mail to the user.
        if (subscriptionRequest === 'save') {
          const toEmail = data.email;
          const updateFor = `pricing details of ${classTypeName || schoolData.name}`;
          const unsubscribeLink = `${Meteor.absoluteUrl()}unsubscribe?pricingRequest=true&requestId=${pricingRequestId}`;
          const subject = `Subscription for prices of ${classTypeName || schoolData.name}`;
          const joinSkillShapeLink = `${Meteor.absoluteUrl()}`;
          sendEmailForSubscription({
            toEmail,
            fromEmail,
            updateFor,
            currentUserName,
            subject,
            unsubscribeLink,
            joinSkillShapeLink,
          });
        }

        return {
          success: 'Your request has been received',
        };
      }
    } else {
      // Return the errors in case something is invalid.
      const invalidData = validationContext.invalidKeys()[0];
      // console.log("validation errors...",validationContext.invalidKeys());
      throw new Meteor.Error(`${invalidData.name} is ${invalidData.value}`);
    }
  },
  'pricingRequest.getRequestData': function (requestId) {
    check(requestId, String);
    const pricingRequestData = PricingRequest.findOne({ _id: requestId });
    if (!pricingRequestData) {
      throw new Meteor.Error('no pricing data has been found with this id.');
    }
    const classTypeData = ClassType.findOne({ _id: pricingRequestData.classTypeId });

    return {
      classTypeName: classTypeData && classTypeData.name,
      schoolName: School.findOne({ _id: pricingRequestData.schoolId }).name,
    };
  },
  'pricingRequest.removeRequest': function (requestId) {
    check(requestId, String);
    return PricingRequest.remove({ _id: requestId });
  },
});
