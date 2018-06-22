import Purchases from "../fields";
import School from "../../school/fields";
Meteor.publish("getAllPurchaseData", function(slug) {
  let schoolData = School.findOne({ slug: slug });
  console.log(
    "Purchases.find({ schoolId: schoolData._id })",
    Purchases.find({ schoolId: schoolData._id }).fetch()
  );
  return Purchases.find({ schoolId: schoolData._id });
});
