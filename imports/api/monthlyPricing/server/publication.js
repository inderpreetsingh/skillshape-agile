import MonthlyPricing from "../fields";

Meteor.publish("monthlyPricing.getMonthlyPricing", function({ schoolId }) {
	
	console.log("monthlyPricing.getMonthlyPricing -->>",schoolId)
    return MonthlyPricing.find({schoolId});
});