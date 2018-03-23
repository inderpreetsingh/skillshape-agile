import MonthlyPricing from "../fields";

Meteor.publish("monthlyPricing.getMonthlyPricing", function({ schoolId }) {
	
	console.log("monthlyPricing.getMonthlyPricing -->>",schoolId)
    let cursor = MonthlyPricing.find({schoolId});
    return MonthlyPricing.publishJoinedCursors(cursor,{ reactive: true }, this);
});