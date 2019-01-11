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
      let schoolName, schoolEmail,schoolId,schoolData, userName, userEmail, packageName,newActivePackages=0;
      let activePurchasesData = Purchases.find({
        packageStatus: "active",
        endDate: { $lte: new Date() }
      }).fetch();
      let activeSubscriptionData = ClassSubscription.find({
        status: "successful",
        endDate: { $lte: new Date() }
      }).fetch();
      console.log('TCL:expired packages found--->', activePurchasesData.length);
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
          sendPackageExpiredEmailToSchool( schoolName, schoolEmail, userName, userEmail, packageName );
          }
        let packageId = currentPurchase.packageId;
        let userId = currentPurchase.userId;
        let days = (currentPurchase.startDate-currentPurchase.endDate)/(1000 * 60 * 60 * 24);
        let startDate = new Date();
        let endDate = new Date(new Date().getTime()+(days*24*60*60*1000));
        let result = Purchases.update( { packageStatus: "inActive", packageId, userId, }, { $set: { packageStatus: "active",startDate, endDate } } );
        newActivePackages = result + newActivePackages ;  
      });
      console.log('TCL: Package made active', newActivePackages);
      if (!isEmpty(packageIds)) {
        Purchases.update(
          { _id: { $in: packageIds } },
          { $set: { packageStatus: "expired" } }
        );
        packageIds.map((_id)=>{
          Meteor.call("purchases.addTransactionEntry",_id,'expired');
        })
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
