import config from "/imports/config";
import ClassType from "/imports/api/classType/fields";

const SchoolMemberDetails = new Mongo.Collection(
  config.collections.schoolMemberDetails
);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
SchoolMemberDetails.attachSchema(
  new SimpleSchema({
    firstName: {
      optional: true,
      type: String
    },
    lastName: {
      optional: true,
      type: String
    },
    phone: {
      optional: true,
      type: String
    },
    pic: {
      optional: true,
      type: String
    },
    medium: {
      optional: true,
      type: String
    },
    low: {
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
      type: String,
      optional: true
    },
    sendMeSkillShapeNotification: {
      type: Boolean,
      optional: true
    },
    adminNotes: {
      type: String,
      optional: true
    },
    createdBy: {
      // Memeber who created an entry for new member.
      type: String,
      optional: true
    },
    email: {
      type: String,
      optional: true
    },
    activeUserId: {
      type: String,
      optional: true
    },
    inviteAccepted: {
      type: Boolean,
      optional: true
    },
    classmatesNotes: {
      type: Object,
      optional: true,
      blackbox: true
    },
    birthYear: {
      type: String,
      optional: true
    },
    studentWithoutEmail: {
      type: Boolean,
      optional: true
    },
    packageDetails: {
      type: Object,
      blackbox: true,
      optional: true
    }
  })
);
Meteor.startup(function() {
  // FTS on the basis of first name last name and class types.
  if (Meteor.isServer) {
    SchoolMemberDetails._ensureIndex({
      firstName: "text",
      lastName: "text",
      classType: "text"
    });
  }
});
SchoolMemberDetails.join(Meteor.users, "activeUserId", "profile", ["profile"]);
export default SchoolMemberDetails;
