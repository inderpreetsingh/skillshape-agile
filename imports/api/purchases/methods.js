import Purchases from "./fields";
import School from "../school/fields";
Meteor.methods({
  "purchases.addPurchase": function(payload) {
    return Purchases.insert(payload);
  },
  "purchases.getAllPurchaseData": function(slug, filters) {
    console.log("AllPurchaseData", filters);
    let schoolId = School.findOne({ slug: slug });
    let AllPurchaseData = Purchases.find(
      { schoolId: schoolId._id },
      { limit: filters.limit, skip: filters.skip }
    ).fetch();

    return AllPurchaseData;
  },
  "purchases.updatePurchases": function({ payload, recordId }) {
    // console.log("payload and recordid inupdate Purchases ", payload, recordId);
    Purchases.update(
      { _id: recordId },
      {
        $set: payload
      }
    );
  },
  "purchases.purchasePageCount": function() {
    return Purchases.find().count();
  }
});
