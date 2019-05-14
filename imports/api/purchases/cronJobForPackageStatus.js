import isEmpty from 'lodash/isEmpty';
import Purchases from './fields';
import ClassSubscription from '/imports/api/classSubscription/fields';
import School from '/imports/api/school/fields';
import { sendPackageExpiredEmail, sendPackageExpiredEmailToSchool } from '/imports/api/email';

const stripe = require('stripe')(Meteor.settings.stripe.PRIVATE_KEY);

SyncedCron.add({
  name: 'cron Job For Package Status',
  schedule(parser) {
    // parser is a later.parse object
    return parser.text('every 1 hours');
  },
  job() {
    try {
      let schoolName; let schoolEmail; let schoolId; let schoolData; let userName; let userEmail; let packageName; let
        newActivePackages = 0;
      const activePurchasesData = Purchases.find({
        packageStatus: 'active',
        endDate: { $lte: new Date() },
      }).fetch();
      console.log('current expired  purchases which is active still', activePurchasesData.length);
      const activeSubscriptionData = ClassSubscription.find({
        status: 'successful',
        endDate: { $lte: new Date() },
      }).fetch();
      console.log('current expired subscriptions which is active still', activeSubscriptionData.length);
      const packageIds = [];
      activePurchasesData.map((currentPurchase) => {
        packageIds.push(currentPurchase._id);
        userEmail = currentPurchase.emailId;
        userName = currentPurchase.userName;
        packageName = currentPurchase.packageName;
        schoolId = currentPurchase.schoolId;
        schoolData = School.findOne({ _id: schoolId });
        schoolEmail = schoolData.email;
        schoolName = schoolData.name;
        try {
          if (userEmail && userName && packageName) {
            sendPackageExpiredEmail(
              userEmail,
              userName,
              packageName,
            );
          }
          if (schoolName && schoolEmail && userName && userEmail && packageName) {
            sendPackageExpiredEmailToSchool(schoolName, schoolEmail, userName, userEmail, packageName);
          }
        } catch (error) {
			  	console.log('error in expired email code in cron job error', error);
        }
        const { packageId } = currentPurchase;
        const { userId } = currentPurchase;
        const days = (currentPurchase.startDate - currentPurchase.endDate) / (1000 * 60 * 60 * 24);
        const startDate = new Date();
        const endDate = new Date(new Date().getTime() + (days * 24 * 60 * 60 * 1000));
        const result = Purchases.update({ packageStatus: 'inActive', packageId, userId }, { $set: { packageStatus: 'active', startDate, endDate } });
        newActivePackages = result + newActivePackages;
      });
      console.log('New packages activated', newActivePackages);
      if (!isEmpty(packageIds)) {
        Purchases.update(
          { _id: { $in: packageIds } },
          { $set: { packageStatus: 'expired' } },
          { multi: true },
        );
        packageIds.forEach((_id) => {
          Meteor.call('purchases.addTransactionEntry', _id, 'expired');
        });
      }
      // make expired subscription in classSubscription collection
      // if the end date in past and cancel the subscription from stripe
      if (!isEmpty(activeSubscriptionData)) {
        const canceledSubscriptionsIds = [];
        activeSubscriptionData.map((current, index) => {
          subscriptionId = current.subscriptionId;
          stripe.subscriptions.del(
            subscriptionId,
            Meteor.bindEnvironment((err, confirmation) => {
              // asynchronously called
              ClassSubscription.update({ subscriptionId }, { $set: { status: 'expired', subscriptionCancelResponse: confirmation } });
            }),
          );
        });
      }
    } catch (error) {
      console.log('error in cron job found', error);
    }
  },
});
