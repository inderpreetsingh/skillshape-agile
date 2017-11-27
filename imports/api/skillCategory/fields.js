import config from "/imports/config";

const SkillCategory = new Mongo.Collection(config.collections.skillCategory);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
SkillCategory.attachSchema(new SimpleSchema({
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
        SkillCategory._ensureIndex({ "name": "text" });
    }
});

export default SkillCategory;