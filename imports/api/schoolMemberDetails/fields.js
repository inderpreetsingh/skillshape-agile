import config from "/imports/config"
import ClassType from "/imports/api/classType/fields";

const SchoolMemberDetails = new Mongo.Collection(config.collections.schoolMemberDetails);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
SchoolMemberDetails.attachSchema(new SimpleSchema({
    name: {
        type: String,// Required
    },
    firstName: {
        optional: true,
        type: String,
    },
    lastName: {
        optional: true,
        type: String
    },
    phone: {
        optional: true,
        type: Number
    },
    pic: {
        optional: true,
        type: String
    },
    dob: {
        optional: true,
        type: Date
    },
    address: {
        optional: true,
        type: String
    },
    gender: {
        optional: true,
        type: String
    },
    expertise: {
        optional: true,
        type: String
    },
    state: {
        optional: true,
        type: String
    },
    role: {
        optional: true,
        type: String
    },
    classTypeIds: {
        type: [String],
        optional: true
    },
    schoolId: {
        type: [String],
        optional: true
    },
    sendMeSkillShapeNotification: {
        type: Boolean,
        optional: true
    },
    notes: {
        type: String,
        optional: true
    },
    createdBy: { // Memeber who created an entry for new member.
        type: String,
    },
    email: {
        type: String,
        optional:true
    },
    packageName: { // Students can have package name.
        type: String,
        optional: true
    }
}));

export default SchoolMemberDetails;