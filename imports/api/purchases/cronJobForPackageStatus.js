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
    });
    if (!isEmpty(packageIds)) {
      Purchases.update(
        { _id: { $in: packageIds } },
        { $set: { packageStatus: "expired" } }
      );
      sendPackageExpiredEmail(expiredUserDetails);
      console.log("Email send to these users", expiredUserDetails);
    }
  }
});
