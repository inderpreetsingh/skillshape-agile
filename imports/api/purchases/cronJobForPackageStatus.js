import Purchases from "./fields";
import isEmpty from "lodash/isEmpty";
import { sendPackageExpiredEmail } from "/imports/api/email";
import SchoolMemberDetails from "./fields";
SyncedCron.add({
  name: "cronJobForPackageStatus",
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text("every 24 hours");
  },
  job: function() {
    let activePurchasesData = Purchases.find({
      packageStatus: "active",
      endDate: { $lte: new Date() }
    }).fetch();
    let packageIds = [];
<<<<<<< HEAD
    activePurchasesData.map(currentPurchase => {
      packageIds.push(currentPurchase._id);
      sendPackageExpiredEmail(
        currentPurchase.emailId,
        currentPurchase.userName,
        currentPurchase.packageName
      );
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
=======
    let expiredUserDetails = [];
    activePurchasesData.map(currentPurchase => {
      packageIds.push(currentPurchase._id);
      currentPurchase &&
        currentPurchase.emailId &&
        expiredUserDetails.push({
          emailId: currentPurchase.emailId,
          userName: currentPurchase.userName,
          packageName: currentPurchase.packageName
        });
      let packageId = currentPurchase.packageId;
      let userId = currentPurchase.userId;
      let inActivePurchase = Purchases.findOne({
        packageStatus: "inactive",
        packageId: currentPurchase.packageId,
        userId: userId
      });
      if (inActivePurchase) {
        Purchases.update(
          {
            packageStatus: "inactive",
            packageId: currentPurchase.packageId,
            userId: userId
          },
          { $set: { packageStatus: "active" } }
        );
      }
>>>>>>> 2a0e99a51cac58511e68bbae5d8c491de4436463
    });
    if (!isEmpty(packageIds)) {
      Purchases.update(
        { _id: { $in: packageIds } },
        { $set: { packageStatus: "expired" } }
      );
<<<<<<< HEAD
=======
      sendPackageExpiredEmail(expiredUserDetails);
      console.log("Email send to these users", expiredUserDetails);
>>>>>>> 2a0e99a51cac58511e68bbae5d8c491de4436463
    }
  }
});
