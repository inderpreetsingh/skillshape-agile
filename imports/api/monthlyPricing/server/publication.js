import MonthlyPricing from "../fields";

Meteor.publish("monthlyPricing.getMonthlyPricing", function ({ schoolId }) {
  // console.log("monthlyPricing.getMonthlyPricing -->>",schoolId)
  let cursor = MonthlyPricing.find({ schoolId, deleted: false });
  return MonthlyPricing.publishJoinedCursors(cursor, { reactive: true }, this);
});

Meteor.publish("monthlyPricing.getMonthlyPricingWithClassId", function ({ classTypeId }) {
  // console.log("monthlyPricing.getMonthlyPricing -->>",schoolId)
  let cursor = MonthlyPricing.find({ classTypelId, deleted: false });
  return MonthlyPricing.publishJoinedCursors(cursor, { reactive: true }, this);
});


Meteor.publish("monthlyPricing.getMonthlyPricingFromId", function ({ _id }) {
  // console.log("monthlyPricing.getMonthlyPricing -->>",schoolId)
  let cursor = MonthlyPricing.find({ _id, deleted: false });
  return MonthlyPricing.publishJoinedCursors(cursor, { reactive: true }, this);
});
