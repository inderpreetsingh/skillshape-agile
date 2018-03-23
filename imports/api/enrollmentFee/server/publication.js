import EnrollmentFees from "../fields";

Meteor.publish("enrollmentFee.getEnrollmentFee", function({ schoolId }) {
	console.log("enrollmentFee.getEnrollmentFee -->>",schoolId)
	let cursor = EnrollmentFees.find({schoolId});
    return EnrollmentFees.publishJoinedCursors(cursor,{ reactive: true }, this);
});