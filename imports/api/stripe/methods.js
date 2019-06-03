import { check } from 'meteor/check';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import UserStripeData from './fields';
import School from '../school/fields';
import EnrollmentFees from '../enrollmentFee/fields';
import ClassSubscription from '../classSubscription/fields';
import ClassPricing from '../classPricing/fields';
import MonthlyPricing from '/imports/api/monthlyPricing/fields';
import {
  sendPackagePurchasedEmailToStudent,
  sendPackagePurchasedEmailToSchool,
} from '/imports/api/email/index';
import { getExpiryDateForPackages } from '/imports/util/expiraryDateCalculate';
// chargeCard for  creating charge and purchasing package
// getStripeToken for getting stripe account id
// :":":":":":":"" classtypeids removed
const stripe = require('stripe')(Meteor.settings.stripe.PRIVATE_KEY);

Meteor.methods({
  'stripe.chargeCard': async function (
    stripeToken,
    desc,
    packageId,
    packageType,
    schoolId,
    expDuration,
    expPeriod,
    noOfClasses,
    planId,
    contract,
  ) {
    let recordId;
    try {
      check(stripeToken, String);
      check(desc, String);
      check(packageId, String);
      check(packageType, String);
      check(schoolId, String);
      let amount;
      let currency;
      let userName;
      let userEmail;
      let packageName;
      let schoolName;
      let schoolEmail;
      let status;
      let contractLength = 0;
      let payAsYouGo = false;
      let payUpFront = false;
      const monthlyAttendance = {};
      let classTypeIds = [];
      packageName = desc;
      // Get amount and currency from database using package ids
      if (packageType == 'EP') {
        const enrollmentData = EnrollmentFees.findOne({ _id: packageId });
        classTypeIds = get(enrollmentData, 'classTypeId', []);
        currency = enrollmentData.currency;
        amount = enrollmentData.cost;
        if (get(enrollmentData, 'noExpiration', false)) {
          expDuration = 30;
          expPeriod = 'Years';
        } else {
          expDuration = get(enrollmentData, 'expDuration', 30);
          expPeriod = get(enrollmentData, 'expPeriod', 'Years');
        }
      } else if (packageType == 'CP') {
        const classData = ClassPricing.findOne({ _id: packageId });
        classTypeIds = get(classData, 'classTypeId', []);
        currency = get(classData, 'currency', '$');
        amount = get(classData, 'cost', 0);
        if (get(classData, 'noExpiration', false)) {
          expDuration = 30;
          expPeriod = 'Years';
        } else {
          expDuration = get(classData, 'expDuration', 30);
          expPeriod = get(classData, 'expPeriod', 'Years');
        }
      } else {
        const MonthlyData = MonthlyPricing.findOne({ 'pymtDetails.planId': planId });
        classTypeIds = get(MonthlyData, 'classTypeId', []);
        MonthlyData.pymtDetails.map((current, index) => {
          if (current.planId == planId) {
            amount = current.cost;
            currency = current.currency;
            contractLength = current.month;
          }
          if (MonthlyData.duPeriod) {
            monthlyAttendance.duPeriod = MonthlyData.duPeriod;
            monthlyAttendance.noClasses = MonthlyData.noClasses;
            monthlyAttendance.startDate = new Date();
            monthlyAttendance.max = MonthlyData.noClasses;
          }
        });
        payAsYouGo = get(MonthlyData, 'pymtType.payAsYouGo', false);
        payUpFront = get(MonthlyData, 'pymtType.payUpFront', false);
        expPeriod = 'Months';
        if (contract == 'useOldContract') {
          Meteor.call(
            'purchases.isAlreadyPurchased',
            {
              userId: this.userId,
              planId,
              packageId,
              packageType,
              pymtType: get(MonthlyData, 'pymtType', {}),
            },
            async (err, res) => {
              amount = get(res, 'amount', 0);
              contractLength = get(res, 'contractLength', 0);
            },
          );
        }
      }
      // Get currency name and correct amount using multipleFactor from config
      config.currency.map((data, index) => {
        if (data.value == currency) {
          currency = data.label;
          amount = String(amount);
          if (amount.indexOf('.') == -1) {
            amount = parseInt(
              String(amount)
                .split('.')
                .join(''),
            ) * data.multiplyFactor;
          } else {
            amount = parseInt(
              String(amount)
                .split('.')
                .join(''),
            );
          }
        }
      });
      const { userId } = this;
      let endDate;
      let startDate;
      const user = Meteor.user();
      const schoolData = School.findOne({ _id: schoolId });
      schoolEmail = schoolData.email;
      schoolName = schoolData.name;
      const superAdminId = schoolData.superAdmin;
      let stripeAccountId = UserStripeData.findOne({ userId: superAdminId });
      if (!stripeAccountId.stripe_user_id) {
        throw new Meteor.Error('School not connected stripe yet.');
      }

      stripeAccountId = stripeAccountId.stripe_user_id;
      const token = stripeToken;
      const skillshapeAmount = Math.round(amount * (2.9 / 100) + 40);
      const destinationAmount = Math.round(amount - skillshapeAmount);
      const stripeRequest = {
        amount,
        currency,
        description: desc,
        source: token,
        destination: {
          amount: destinationAmount,
          account: stripeAccountId,
        },
        // receipt_email: 'naruto@ryaz.io'
      };

      startDate = new Date();
      endDate = getExpiryDateForPackages(startDate, expPeriod, expDuration);
      let payload = {
        userId,
        stripeRequest,
        emailId: user.emails[0].address,
        userName: user.profile.firstName || user.profile.name,
        packageName: desc,
        createdOn: new Date(),
        packageId,
        packageType,
        schoolId,
        status: 'inProgress',
        startDate,
        endDate,
        noClasses: noOfClasses,
        fee: Math.round(amount * (2.9 / 100) + 30),
        amount: amount / 100,
        contractLength,
        payUpFront,
        payAsYouGo,
        currency,
        monthlyAttendance,
        paymentMethod: 'stripe',
      };
      recordId = Meteor.call('purchases.addPurchase', payload);
      const charge = await stripe.charges.create(stripeRequest);
      status = get(charge, 'status', 'error');
      payload = {
        stripeResponse: charge,
        status,
      };
      const currentUserRec = Meteor.users.findOne(this.userId);
      Meteor.call('purchases.updatePurchases', { payload, recordId });
      userName = currentUserRec.profile.name || currentUserRec.profile.firstName;
      userEmail = currentUserRec.emails[0].address;
      const memberData = {
        schoolId,
        activeUserId: currentUserRec._id,
        classTypeIds,
      };
      Meteor.call('schoolMemberDetails.addNewMember', memberData);
      Meteor.call(
        'purchases.checkExisitingPackagePurchases',
        userId,
        packageId,
        (error, result) => {
          status = result;
          payload = { packageStatus: status };
          Meteor.call('purchases.updatePurchases', { payload, recordId });
        },
      );
      // stripe.balance.retrieve(function(err, balance) {
      // });
      sendPackagePurchasedEmailToStudent(userName, userEmail, packageName);
      sendPackagePurchasedEmailToSchool(schoolName, schoolEmail, userName, userEmail, packageName);
      return 'Payment Successfully Done';
    } catch (error) {
      console.log('TCL: error in stripe.chargeCard', error);
      payload = {
        stripeResponse: error,
        status: 'Error',
      };
      Meteor.call('purchases.updatePurchases', { payload, recordId });
      throw new Meteor.Error((error && error.message) || 'Something went wrong!!!');
    }
  },
  'stripe.getStripeToken': function (code) {
    check(code, String);
    try {
      const result = Meteor.http.call(
        'POST',
        `https://connect.stripe.com/oauth/token?client_secret=${
          Meteor.settings.stripe.PRIVATE_KEY
        }&code=${code}&grant_type=authorization_code`,
      );

      const payload = {
        userId: this.userId,
        stripe_user_id: result.data.stripe_user_id,
        stripe_user_refresh_token: result.data.refresh_token,
      };

      const userData = UserStripeData.findOne({
        userId: this.userId,
      });
      if (!userData) {
        Meteor.call('stripe.addStripeJsonForUser', payload);
        return 'Successfully Connected';
      }
      return 'Your acoount is already connected!!';
    } catch (error) {
      throw new Meteor.Error(
        error.response.statusCode,
        error.response && error.response.data && error.response.data.error_description,
      );
    }
  },
  'stripe.addStripeJsonForUser': function (data) {
    check(data, Object);
    UserStripeData.insert(data);
    Meteor.users.update({ _id: this.userId }, { $set: { 'profile.stripeStatus': true } });
  },
  'stripe.disconnectStripeUser': function (superAdminId) {
    Meteor.users.update({ _id: superAdminId }, { $set: { 'profile.stripeStatus': false } });
    UserStripeData.remove({ userId: superAdminId });
    return 'Successfully Disconnected';
  },
  'stripe.findAdminStripeAccount': function (superAdminId = this.userId) {
    if (superAdminId) {
      const result = UserStripeData.findOne({
        userId: superAdminId,
        stripe_user_id: { $exists: true },
      });
      if (result) {
        return true;
      }
      return false;
    }
    return false;
  },
  // creating plan for on monthly package creation
  'stripe.createStripePlan': async function (currencyCode, interval, amount) {
    try {
      const { productId } = Meteor.settings;
      const plan = await stripe.plans.create({
        product: productId,
        currency: currencyCode, // currency code should be in lower case
        interval,
        amount,
      });
      return plan.id;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },
  'stripe.createStripeProduct': function (productId) {
    try {
      check(productId, String);
      stripe.products.retrieve(productId, (err, product) => {
        // asynchronously called
        if (!product && err && err.message.indexOf('No such product') != -1) {
          // Create a service product
          stripe.products.create(
            {
              name: 'Skillshape Monthly Package Product',
              type: 'service',
              id: productId,
            },
            (err, result) => {
              if (result && result.id) {
                return result.id;
              }
              throw new Meteor.Error((err && err.message) || 'Something went wrong!!!');
            },
          );
        }
      });
    } catch (err) {}
  },
  'stripe.handleCustomerAndSubscribe': async function (
    token,
    planId,
    schoolId,
    packageName,
    packageId,
    monthlyPymtDetails,
  ) {
    check(planId, String);
    check(schoolId, String);
    check(packageName, String);
    check(packageId, String);
    check(monthlyPymtDetails, [Object]);
    // customer creation and subscribe if new otherwise straight to subscribe
    let startDate;
    let classTypeIds;
    let subscriptionRequest;
    let subscriptionDbId;
    let payload;
    let subscriptionResponse;
    let stripeCusId;
    let stripeCusIds = [];
    let fee;
    let currency;
    let contractLength;
    const monthlyAttendance = {};
    try {
      const { userId } = this;
      const userObject = Meteor.user();
      const emailId = userObject.emails[0].address;
      const userName = userObject.profile.firstName || userObject.profile.name;
      if (token) {
        const currentUserProfile = Meteor.users.findOne({
          _id: userId,
          stripeCusIds: { $exists: true },
        });
        // find stripeCusId from users ond create a new one and store in the users collection
        const stripeCustomer = await stripe.customers.create({
          description: `${emailId} ${packageName}`,
          source: token,
        });
        stripeCusId = stripeCustomer.id;
        if (!isEmpty(currentUserProfile) && isArray(currentUserProfile.stripeCusIds)) {
          currentUserProfile.stripeCusIds.push(stripeCusId);
          stripeCusIds = currentUserProfile.stripeCusIds;
        } else {
          stripeCusIds.push(stripeCusId);
        }
        Meteor.users.update({ _id: userId }, { $set: { stripeCusIds } });
      }
      startDate = new Date();
      endDate = getExpiryDateForPackages(startDate, 'Months', monthlyPymtDetails[0].month);
      subscriptionRequest = {
        customer: stripeCusId,
        items: [{ plan: planId }],
      };
      const MonthlyData = MonthlyPricing.findOne({ 'pymtDetails.planId': planId });
      classTypeIds = get(MonthlyData, 'classTypeId', []);
      if (MonthlyData.duPeriod) {
        monthlyAttendance.duPeriod = MonthlyData.duPeriod;
        monthlyAttendance.duPeriod = MonthlyData.noClasses;
        monthlyAttendance.startDate = new Date();
        monthlyAttendance.max = MonthlyData.noClasses;
      }
      MonthlyData.pymtDetails.map((current, index) => {
        if (current.planId == planId) {
          fee = parseInt(
            String(current.cost)
              .split('.')
              .join(''),
          );
          amount = current.cost;
          currency = current.currency;
          contractLength = current.month;
        }
      });
      payload = {
        userId,
        startDate,
        endDate,
        status: 'inProgress',
        packageId,
        packageName,
        schoolId,
        subscriptionRequest,
        emailId,
        planId,
        fee,
        currency,
        contractLength,
        monthlyAttendance,
        amount,
        autoWithdraw: true,
        userName,
      };
      // insert subscription  progress in classSubscription
      subscriptionDbId = ClassSubscription.insert(payload);
      if (token) {
        subscriptionResponse = await stripe.subscriptions.create(subscriptionRequest);
        // get subscription id
        payload = {
          subscriptionId: subscriptionResponse.id,
        };
        // add subscription id in collection
        ClassSubscription.update({ _id: subscriptionDbId }, { $set: payload });
        const memberData = {
          schoolId,
          activeUserId: userId,
          classTypeIds,
        };
        Meteor.call('schoolMemberDetails.addNewMember', memberData);
      }
      return true;
    } catch (err) {
      const { message } = err;
      payload = { status: 'error', errorMessage: message };
      ClassSubscription.update({ _id: subscriptionDbId }, { $set: payload });
      throw new Meteor.Error(message || 'Something went wrong');
    }
  },
  'stripe.handleOtherPaymentMethods': function (data) {
    try {
      let {
        userId,
        packageId,
        schoolId,
        packageType,
        paymentMethod,
        packageName,
        noClasses,
        planId,
      } = data;
      const user = Meteor.users.findOne({ _id: userId });
      let payload;
      let status;
      let userName;
      let emailId;
      let amount;
      let classTypeIds;
      const monthlyAttendance = {};
      let currency;
      let expDuration;
      let expPeriod;
      let contractLength = 0;
      let payAsYouGo = false;
      let payUpFront = false;
      let autoWithdraw = false;
      let startDate;
      let endDate;
      let recordId;
      emailId = user.emails[0].address;
      userName = user.profile.firstName || user.profile.name;
      paymentMethod = data.paymentMethod;
      status = 'succeeded';
      if (packageType == 'EP') {
        const enrollmentData = EnrollmentFees.findOne({ _id: packageId });
        classTypeIds = get(enrollmentData, 'classTypeId', []);
        currency = enrollmentData.currency;
        amount = enrollmentData.cost;
        if (get(enrollmentData, 'noExpiration', false)) {
          expDuration = 30;
          expPeriod = 'Years';
        } else {
          expDuration = get(enrollmentData, 'expDuration', 30);
          expPeriod = get(enrollmentData, 'expPeriod', 'Years');
        }
      } else if (packageType == 'CP') {
        const classData = ClassPricing.findOne({ _id: packageId });
        classTypeIds = get(classData, 'classTypeId', []);
        currency = get(classData, 'currency', '$');
        amount = get(classData, 'cost', 0);
        if (get(classData, 'noExpiration', false)) {
          expDuration = 30;
          expPeriod = 'Years';
        } else {
          expDuration = get(classData, 'expDuration', 30);
          expPeriod = get(classData, 'expPeriod', 'Years');
        }
      } else {
        const MonthlyData = MonthlyPricing.findOne({ 'pymtDetails.planId': planId });
        classTypeIds = get(MonthlyData, 'classTypeId', []);
        MonthlyData.pymtDetails
          && MonthlyData.pymtDetails.map((current, index) => {
            if (current.planId == planId) {
              amount = current.cost;
              if (get(MonthlyData, 'pymtType.payUpFront', false)) {
                amount *= current.month;
              }
              currency = current.currency;
              contractLength = current.month;
            }
            if (MonthlyData.duPeriod) {
              monthlyAttendance.duPeriod = MonthlyData.duPeriod;
              monthlyAttendance.noClasses = MonthlyData.noClasses;
              monthlyAttendance.startDate = new Date();
              monthlyAttendance.max = MonthlyData.noClasses;
              noClasses = MonthlyData.noClasses;
            }
          });
        payAsYouGo = get(MonthlyData, 'pymtType.payAsYouGo', false);
        payUpFront = get(MonthlyData, 'pymtType.payUpFront', false);
        autoWithdraw = get(MonthlyData, 'pymtType.autoWithDraw', false);
        expPeriod = 'Months';
      }
      // Get currency name and correct amount using multipleFactor from config
      config.currency.map((data, index) => {
        if (data.value == currency) {
          currency = data.label;
          amount = String(amount);
          if (amount.indexOf('.') == -1) {
            amount = parseInt(
              String(amount)
                .split('.')
                .join(''),
            ) * data.multiplyFactor;
          } else {
            amount = parseInt(
              String(amount)
                .split('.')
                .join(''),
            );
          }
        }
      });
      startDate = new Date();
      endDate = getExpiryDateForPackages(startDate, expPeriod, expDuration);
      payload = {
        userId,
        emailId,
        userName,
        packageName,
        createdOn: new Date(),
        packageId,
        packageType,
        schoolId,
        status,
        startDate,
        endDate,
        noClasses,
        fee: Math.round(amount * (2.9 / 100) + 30),
        amount: amount / 100,
        contractLength,
        payAsYouGo,
        payUpFront,
        autoWithdraw,
        currency,
        monthlyAttendance,
        paymentMethod,
        packageStatus: 'active',
      };
      result = Meteor.call('purchases.checkExisitingPackagePurchases', userId, packageId);
      status = result;
      payload.packageStatus = status;
      recordId = Meteor.call('purchases.addPurchase', payload);
      const memberData = {
        schoolId,
        activeUserId: userId,
        classTypeIds,
      };
      Meteor.call('schoolMemberDetails.addNewMember', memberData);
      return recordId;
    } catch (error) {
      console.log('error in ​stripe.handleOtherPaymentMethods', error);
    }
  },
});
