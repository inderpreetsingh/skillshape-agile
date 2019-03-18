import config from "/imports/config"

const ClaimSchoolRequest = new Mongo.Collection(config.collections.claimSchoolRequest);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
ClaimSchoolRequest.attachSchema(new SimpleSchema({
    schoolId: {
        type: String,
    },
    schoolName: {
        type: String,
    },
    schoolEmail: {
        type: String,
        optional:true
    },
    userId: {
        type: String,
    },
    userEmail: {
        type: String
    },
    userName: {
        type: String
    },
    status: {
        type: String,  // approved, rejected, pending
        optional: true
    },
    approvedBy: {
        type: String,  // if superadmin then request is approved by system
        optional: true
    },
    createdAt: {
        type: Date,
        optional: true
    },
    emailCount: {
        type: Number,
        optional: true,
        defaultValue: 0
    }
}));

export default ClaimSchoolRequest;