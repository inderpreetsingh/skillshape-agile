import Purchases from "./fields";
import School from "../school/fields";
Meteor.methods({
  addPurchase: function(payload) {
    console.log("in purchase methods");
    Purchases.insert(payload);
  },
  getAllPurchaseData: function(slug) {
    let schoolId = School.findOne({ slug: slug });
    let AllPurchaseData = Purchases.find({ schoolId: schoolId._id }).fetch();
    return AllPurchaseData;
  }
});
