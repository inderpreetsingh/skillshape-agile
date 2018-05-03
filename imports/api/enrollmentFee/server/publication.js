import EnrollmentFees from "../fields";

Meteor.publish("enrollmentFee.getEnrollmentFee", function({ schoolId }) {
	// console.log("enrollmentFee.getEnrollmentFee -->>",schoolId)
	let cursor = EnrollmentFees.find({schoolId});
    return EnrollmentFees.publishJoinedCursors(cursor,{ reactive: true }, this);
});

Meteor.publish("enrollmentFee.getClassTypeEnrollMentFree",function({ classTypeId }) {
	let cursor = EnrollmentFees.find({classTypeId: {$in : [classTypeId]}});
		return EnrollmentFees.publishJoinedCursors(cursor, {reactive: true}, this);
});
