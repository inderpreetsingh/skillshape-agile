import Purchases from "./fields";
import School from "../school/fields";
Meteor.methods({
  addPurchase: function(payload) {
    return Purchases.insert(payload);
  },
  getAllPurchaseData: function(slug, filters) {
    console.log("AllPurchaseData", filters);
    let schoolId = School.findOne({ slug: slug });
    let AllPurchaseData = Purchases.find(
      { schoolId: schoolId._id },
      { limit: filters.limit, skip: filters.skip }
    ).fetch();

    return AllPurchaseData;
  },
  updatePurchases: function(payload, recordId) {
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
  purchasePageCount: function() {
    return Purchases.find().count();
  }
});
