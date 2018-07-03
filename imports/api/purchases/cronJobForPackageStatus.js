import Purchases from "./fields";
import isEmpty from "lodash/isEmpty";
SyncedCron.add({
  name: "cronJobForPackageStatus",
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text("every 1 mins");
  },
  job: function() {
    console.log("cron job is called");
    let activePurchasesData = Purchases.find({
      packageStatus: "active"
    }).fetch();
    console.log("----------------", activePurchasesData);
    let packageIds = [];
    activePurchasesData.map(currentPurchase => {
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      let expireyDate = currentPurchase.endDate;
      oldDate.setHours(0, 0, 0, 0);
      if (
        currentPurchase.endDate &&
        expireyDate.valueOf() == currentDate.valueOf()
      ) {
        packageIds.push(currentPurchase._id);
        let packageId = currentPurchase.packageId;
        let userId = currentPurchase.userId;
        let inActivePurchase = Purchases.findOne({
          status: "inactive",
          packageId: currentPurchase.packageId,
          userId: userId
        });
        if (inActivePurchase) {
          Purchases.update(
            {
              status: "inactive",
              packageId: currentPurchase.packageId,
              userId
            },
            { $set: { packageStatus: "active" } }
          );
        }
      }
    });
    console.log("at bottom", packageIds);
    if (!isEmpty(packageIds)) {
      Purchases.update(
        { _id: { $in: packageIds } },
        { $set: { packageStatus: "expired" } }
      );
    }
  }
});
