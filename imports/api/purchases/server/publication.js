import Purchases from "../fields";
import School from "../../school/fields";
Meteor.publish("getAllPurchaseData", function(slug, filters) {
  console.log("slug, filters", slug, filters);
  let schoolData = School.findOne({ slug: slug });
  let cursor = Purchases.find({ schoolId: schoolData._id }, filters);
  return Purchases.publishJoinedCursors(cursor, { reactive: true }, this);
});
