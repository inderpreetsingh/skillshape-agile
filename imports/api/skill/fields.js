import config from "/imports/config";

const Skills = new Mongo.Collection(config.collections.skills);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
Skills.attachSchema(new SimpleSchema({
    name: {
        type: String,
    },
    createdAt: {
        type: Date,
        optional: true
    },
    remoteIP: {
        type: String,
        optional: true
    }
}));

Meteor.startup(function() {
    if (Meteor.isServer) {
        Skills._ensureIndex({ "name": "text" });
    }
});

export default Skills;