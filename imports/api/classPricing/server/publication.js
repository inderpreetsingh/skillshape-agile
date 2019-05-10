import { check } from 'meteor/check';
import ClassPricing from '../fields';

Meteor.publish('classPricing.getClassPricing', ({ schoolId }) => {
  check(schoolId, String);
  // console.log("classPricing.getClassPricing -->>",schoolId)
  const cursor = ClassPricing.find({ schoolId });
  return ClassPricing.publishJoinedCursors(cursor, { reactive: true }, this);
});


Meteor.publish('classPricing.getClassPricingWithClassId', ({ classTypeId }) => {
  check(classTypeId, String);
  // console.log("classPricing.getClassPricing -->>",schoolId)
  const cursor = ClassPricing.find({ classTypeId });
  return ClassPricing.publishJoinedCursors(cursor, { reactive: true }, this);
});


Meteor.publish('classPricing.getClassPricingFromId', ({ _id }) => {
  check(_id, String);
  // console.log("classPricing.getClassPricing -->>",schoolId)
  const cursor = ClassPricing.find({ _id: { $in: _id } });
  return ClassPricing.publishJoinedCursors(cursor, { reactive: true }, this);
});
