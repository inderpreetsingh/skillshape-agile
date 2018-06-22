import Purchases from "../fields";
import School from "../../school/fields";
Meteor.publish("getAllPurchaseData", function(slug, caller) {
  let schoolData = School.findOne({ slug: slug });
  console.log(" slug is ", slug);
  if (caller) {
    console.log("caller in if");
    let cursor = Purchases.find({ schoolId: schoolData._id });
    return Purchases.publishJoinedCursors(cursor, { reactive: true }, this);
  }
  console.log("without caller");

  return Purchases.find({ schoolId: schoolData._id });
});
