import config from "/imports/config"

const ClassTimesRequest = new Mongo.Collection(config.collections.classTimesRequest);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
ClassTimesRequest.attachSchema(new SimpleSchema({
    schoolId: {
        type: String,
    },
    classTypeId: {
        type: String,
    },
    userId: {
        type: String,
    },
    notification: {
        type: Boolean,
    },
    createdAt: {
        type: Date,
        optional: true
    },
}));

export default ClassTimesRequest;