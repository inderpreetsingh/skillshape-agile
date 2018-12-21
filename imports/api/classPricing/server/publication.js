import ClassPricing from "../fields";
import { check } from 'meteor/check';

Meteor.publish("classPricing.getClassPricing", function ({ schoolId }) {
	// console.log("classPricing.getClassPricing -->>",schoolId)
	let cursor = ClassPricing.find({ schoolId });
	return ClassPricing.publishJoinedCursors(cursor, { reactive: true }, this);
});


Meteor.publish("classPricing.getClassPricingWithClassId", function ({ classTypeId }) {
	// console.log("classPricing.getClassPricing -->>",schoolId)
	let cursor = ClassPricing.find({ classTypeId });
	return ClassPricing.publishJoinedCursors(cursor, { reactive: true }, this);
});


Meteor.publish("classPricing.getClassPricingFromId", function ({ _id }) {
	// console.log("classPricing.getClassPricing -->>",schoolId)
	let cursor = ClassPricing.find({ _id });
	return ClassPricing.publishJoinedCursors(cursor, { reactive: true }, this);
});