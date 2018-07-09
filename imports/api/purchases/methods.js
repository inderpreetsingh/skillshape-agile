import Purchases from "./fields";
import School from "../school/fields";
Meteor.methods({
  "purchases.addPurchase": function(payload) {
    return Purchases.insert(payload);
  },
  "purchases.getAllPurchaseData": function(slug, filters) {
    let schoolId = School.findOne({ slug: slug });
    let AllPurchaseData = Purchases.find(
      { schoolId: schoolId._id },
      { limit: filters.limit, skip: filters.skip }
    ).fetch();
    return AllPurchaseData;
  },
  "purchases.updatePurchases": function({ payload, recordId }) {
    Purchases.update(
      { _id: recordId },
      {
<<<<<<< HEAD
        $set: {
          stripeResponse: payload.stripeResponse,
          status: payload.status
        }
=======
        $set: payload
>>>>>>> stripe-changes
      }
    );
  },
  "purchases.purchasePageCount": function() {
    return Purchases.find().count();
  },
  "purchases.checkExisitingPackagePurchases": function(userId, packageId) {
    let result = Purchases.find({
      userId: userId,
      packageId: packageId
    }).fetch();
    let packageStatus = "active";
    if (result) {
      result.map(current => {
        if (current.packageStatus == "active") {
          packageStatus = "inactive";
        }
      });
      return packageStatus;
    } else {
      return packageStatus;
    }
  }
});
