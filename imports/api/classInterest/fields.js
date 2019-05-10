import config from '/imports/config';

const ClassInterest = new Mongo.Collection(config.collections.classInterest);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
ClassInterest.attachSchema(
  new SimpleSchema({
    classTimeId: {
      type: String,
    },
    classTypeId: {
      type: String,
    },
    schoolId: {
      type: String,
    },
    userId: {
      type: String,
    },
    createdAt: {
      type: Date,
      optional: true,
    },
    deletedEvents: {
      type: Array,
      optional: true,
    },
    'deletedEvents.$': {
      type: String,
      blackbox: true,
    },
    eventId: {
      type: String,
      blackbox: true,
      optional: true,
    },
  }),
);

export default ClassInterest;
