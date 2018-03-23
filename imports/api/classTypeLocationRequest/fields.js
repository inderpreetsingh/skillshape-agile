import config from "/imports/config"

const ClassTypeLocationRequest = new Mongo.Collection(config.collections.classTypeLocationRequest);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
ClassTypeLocationRequest.attachSchema(new SimpleSchema({
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
    classTypeName: {
        type: String,
        optional:true
    }
}));

export default ClassTypeLocationRequest;