import Purchases from "./fields";
import School from "../school/fields";
Meteor.methods({
  "stripe.addPurchase": function(payload) {
    return Purchases.insert(payload);
  },
  "stripe.getAllPurchaseData": function(slug, filters) {
    console.log("AllPurchaseData", filters);
    let schoolId = School.findOne({ slug: slug });
    let AllPurchaseData = Purchases.find(
      { schoolId: schoolId._id },
      { limit: filters.limit, skip: filters.skip }
    ).fetch();

    return AllPurchaseData;
  },
  "stripe.updatePurchases": function(payload, recordId) {
    console.log("payload and recordid inupdate Purchases ", payload, recordId);
    Purchases.update(
      { _id: recordId },
      {
        $set: {
          stripe_Response: payload.stripe_Response,
          status: payload.status
        }
      }
    );
  },
  "stripe.purchasePageCount": function() {
    return Purchases.find().count();
  }
});
