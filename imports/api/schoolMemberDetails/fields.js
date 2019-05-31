import config from '/imports/config';

const SchoolMemberDetails = new Mongo.Collection(config.collections.schoolMemberDetails);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
SchoolMemberDetails.attachSchema(
  new SimpleSchema({
    classTypeIds: {
      type: [String],
      optional: true,
    },
    schoolId: {
      type: String,
      optional: true,
    },
    sendMeSkillShapeNotification: {
      type: Boolean,
      optional: true,
    },
    adminNotes: {
      type: String,
      optional: true,
    },
    activeUserId: {
      type: String,
      optional: true,
    },
    inviteAccepted: {
      type: Boolean,
      optional: true,
    },
    classmatesNotes: {
      type: Object,
      optional: true,
      blackbox: true,
    },
    studentWithoutEmail: {
      type: Boolean,
      optional: true,
    },
    addedOn: {
      type: Date,
      optional: true,
    },
    emailAccess: {
      type: String,
      optional: true,
    },
    phoneAccess: {
      type: String,
      optional: true,
    },
  }),
);
Meteor.startup(() => {
  // FTS on the basis of first name last name and class types.
  if (Meteor.isServer) {
    SchoolMemberDetails._ensureIndex({
      firstName: 'text',
      lastName: 'text',
      classType: 'text',
    });
  }
});
SchoolMemberDetails.join(Meteor.users, 'activeUserId', 'profile', ['profile', 'emails']);

export default SchoolMemberDetails;
