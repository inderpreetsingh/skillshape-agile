import EnrollmentFees from "../fields";
import { check } from 'meteor/check';

Meteor.publish("enrollmentFee.getEnrollmentFee", function ({ schoolId }) {

	// console.log("enrollmentFee.getEnrollmentFee -->>",schoolId)
	let cursor = EnrollmentFees.find({ schoolId });
	return EnrollmentFees.publishJoinedCursors(cursor, { reactive: true }, this);
});

// selecting based on multiple classes
Meteor.publish("enrollmentFee.getClassTypesEnrollMentFee", function ({ classTypeIds }) {
	check(classTypeIds, [String]);

	let cursor = EnrollmentFees.find({ classTypeId: { $in: classTypeIds } });
	return EnrollmentFees.publishJoinedCursors(cursor, { reactive: true }, this);
});

Meteor.publish("enrollmentFee.getEnrollmentFeeByClassTypeId", function ({ classTypeId }) {
	check(classTypeId, String);
	let cursor = EnrollmentFees.find({ classTypeId });
	return EnrollmentFees.publishJoinedCursors(cursor, { reactive: true }, this);
});
Meteor.publish("enrollmentFee.getEnrollmentFeeFromId", function ({ _id }) {
	// console.log("enrollmentFee.getEnrollmentFee -->>",schoolId)
	let cursor = EnrollmentFees.find({ _id:{$in:_id} });
	return EnrollmentFees.publishJoinedCursors(cursor, { reactive: true }, this);
});
