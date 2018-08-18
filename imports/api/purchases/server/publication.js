import Purchases from "../fields";
import School from "../../school/fields";
import { check } from 'meteor/check';
Meteor.publish("purchases.getAllPurchaseData", function (slug, filters) {
  check(slug, String);
  check(filters, Object);
  let schoolData = School.findOne({ slug: slug });
  let cursor = Purchases.find({ schoolId: schoolData._id }, filters);
  return Purchases.publishJoinedCursors(cursor, { reactive: true }, this);
});
Meteor.publish("purchases.getPurchasesListByMemberId", function (filter) {
  check(filters, Object);
  return Purchases.find(filter);
});
