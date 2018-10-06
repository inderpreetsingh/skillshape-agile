import Purchases from "./fields";
import isEmpty from "lodash/isEmpty";
import ClassSubscription from '/imports/api/classSubscription/fields';
import School from '/imports/api/school/fields';
import { sendPackageExpiredEmail ,sendPackageExpiredEmailToSchool} from "/imports/api/email";
var stripe = require("stripe")(Meteor.settings.stripe.PRIVATE_KEY);
SyncedCron.add({
  name: "cron Job For Package Status",
  schedule: function (parser) {
    // parser is a later.parse object
    return parser.text("every 24 hours");
  },
  job: function () {
    try {
      let schoolName, schoolEmail,schoolId,schoolData, userName, userEmail, packageName;
      let activePurchasesData = Purchases.find({
        packageStatus: "active",
        endDate: { $lte: new Date() }
      }).fetch();
      let activeSubscriptionData = ClassSubscription.find({
        status: "successful",
        endDate: { $lte: new Date() }
      }).fetch();
      let packageIds = [];
      activePurchasesData.map(currentPurchase => {
        packageIds.push(currentPurchase._id);
        userEmail = currentPurchase.emailId;
        userName = currentPurchase.userName;
        packageName = currentPurchase.packageName;
        schoolId = currentPurchase.schoolId;
        schoolData = School.findOne({_id:schoolId});
        schoolEmail = schoolData.email;
        schoolName = schoolData.name;
        if (userEmail && userName && packageName) {
          sendPackageExpiredEmail(
            userEmail,
            userName,
            packageName
          );
        }
        if (schoolName && schoolEmail&& userName&& userEmail&& packageName) {
          sendPackageExpiredEmailToSchool(
              schoolName, schoolEmail, userName, userEmail, packageName
            );
          }
        let packageId = currentPurchase.packageId;
        let userId = currentPurchase.userId;
        Purchases.update(
          {
            packageStatus: "inactive",
            packageId: currentPurchase.packageId,
            userId: userId
          },
          { $set: { packageStatus: "active" } }
        );
      });
      if (!isEmpty(packageIds)) {
        Purchases.update(
          { _id: { $in: packageIds } },
          { $set: { packageStatus: "expired" } }
        );
      }
      //make expired subscription in classSubscription collection
      // if the end date in past and cancel the subscription from stripe
      if (!isEmpty(activeSubscriptionData)) {
        let canceledSubscriptionsIds = [];
        activeSubscriptionData.map((current, index) => {
          subscriptionId = current.subscriptionId;
          stripe.subscriptions.del(
            subscriptionId,
            Meteor.bindEnvironment(function (err, confirmation) {
              // asynchronously called
              console.log(err, confirmation);
              if (confirmation) {
                ClassSubscription.update({ subscriptionId }, { $set: { status: 'expired', subscriptionCancelResponse: confirmation } });
              }
            })
          );
        })
      }
    }
    catch (error) {
      console.log("error in cron job found", error)
    }

  }
});
