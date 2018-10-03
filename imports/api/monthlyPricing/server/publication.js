import MonthlyPricing from "../fields";

Meteor.publish("monthlyPricing.getMonthlyPricing", function({ schoolId }) {
  // console.log("monthlyPricing.getMonthlyPricing -->>",schoolId)
  let cursor = MonthlyPricing.find({ schoolId, deleted: false });
  return MonthlyPricing.publishJoinedCursors(cursor, { reactive: true }, this);
});
