import config from "/imports/config"
import ClassType from "/imports/api/classType/fields";

const SchoolMemberDetails = new Mongo.Collection(config.collections.schoolMemberDetails);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
SchoolMemberDetails.attachSchema(new SimpleSchema({
    packageName: {
        type: String,
        optional: true
    },
    classTypeId: {
        type: [String],
        optional: true
    },
    classTypeName: {
        type: [String],
        optional: true
    },
    schoolId: {
        type: [String],
        optional: true
    },
    memberName: {
        type: String,
        optional:true
    },
    memberEmail: {
        type: String,
        optional:true
    },
    createdBy: {
        type: String // This should be a user who created school member.
    }
}));

export default SchoolMemberDetails;