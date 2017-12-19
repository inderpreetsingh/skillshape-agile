import config from "/imports/config"

const ClassTimes = new Mongo.Collection(config.collections.classTimes);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
ClassTimes.attachSchema(new SimpleSchema({
    name: {
        type: String,
    },
    desc: {
        type: String,
        optional: true
    },
    schoolId: {
        type: String,
    },
    classTypeId: {
        type: String,
    },
    scheduleType: {
        type: String,
        optional: true,
    },
    startDate: {
        type: Date,
        optional: true
    },
    endDate: {
        type: Date,
        optional: true
    },
    duration: {
        type: Number,
        optional: true
    },
    roomId: {
        type: String,
        optional: true
    },
    scheduleDetails: {
        type: Object,
        optional: true,
        blackbox: true,
    },
    createdAt: {
        type: Date,
        optional: true
    },
}));


Meteor.startup(function() {
    if (Meteor.isServer) {
        // Modules._ensureIndex({ "name": 1, "schoolId": 1 });
    }
});

export default ClassTimes;