import config from "/imports/config"

const ClassTimesRequest = new Mongo.Collection(config.collections.classTimesRequest);

/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */

//TODO: Once it's fully implemented will change some of the optional fields true to false.
export const ClassTimesRequestSchema = new SimpleSchema({
    name: {
      type: String,
      optional: true
    },
    email: {
      type: String,
      optional: true,
    },
    schoolId: {
        type: String,
    },
    classTypeId: {
        type: String,
    },
    userId: {
        type: String,
        optional: true,
    },
    existingUser: {
        type: Boolean,
        optional: true,
    },
    notification: {
        type: Boolean,
        optional: true,
    },
    createdAt: {
        type: Date,
        optional: true
    },
})

ClassTimesRequest.attachSchema(ClassTimesRequestSchema);

export default ClassTimesRequest;
