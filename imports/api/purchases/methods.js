import Purchases from "./fields";
import School from "../school/fields";
Meteor.methods({
  addPurchase: function(payload) {
    return Purchases.insert(payload);
  },
  getAllPurchaseData: function(slug) {
    let schoolId = School.findOne({ slug: slug });
    let AllPurchaseData = Purchases.find({ schoolId: schoolId._id }).fetch();
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
  }
});
