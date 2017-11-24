import config from "/imports/config"

const Modules = new Mongo.Collection(config.collections.modules);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
Modules.attachSchema(new SimpleSchema({
    name: {
        type: String,
    },
    skillId: {
        type: String,
    },
    schoolId: {
        type: String,
    },
    createdAt: {
        type: Date,
        optional: true
    },
    // plannedStart: {
    //     type: String,
    // },
    // plannedEnd: {
    //     type: String,
    // },
    notes: {
        type: String,
        optional: true
    },
    duration: { //duration in minutes
        type: String,
    },
    remoteIP: {
        type: String,
        optional: true
    }
}));

Meteor.startup(function() {
    if (Meteor.isServer) {
        Modules._ensureIndex({ "name": 1, "schoolId": 1 });
    }
});

export default Modules;