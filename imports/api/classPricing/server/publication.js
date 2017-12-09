import ClassPricing from "../fields";

Meteor.publish("classPricing.getClassPricing", function({ schoolId }) {
	console.log("classPricing.getClassPricing -->>",schoolId)
	return ClassPricing.find({schoolId});
});