import ClassPricing from "../fields";

Meteor.publish("classPricing.getClassPricing", function({ schoolId }) {
	// console.log("classPricing.getClassPricing -->>",schoolId)
	let cursor = ClassPricing.find({schoolId});
    return ClassPricing.publishJoinedCursors(cursor,{ reactive: true }, this);
});