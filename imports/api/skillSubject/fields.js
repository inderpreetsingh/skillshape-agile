import config from "/imports/config";

const SkillSubject = new Mongo.Collection(config.collections.skillSubject);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
SkillSubject.attachSchema(new SimpleSchema({
    name: {
        type: String,
    },
    createdAt: {
        type: Date,
        optional: true
    },
    skillCategoryId: {
        type: String,
    },
    _mig_: {
        type: Number,
        optional: true
    }
}));

Meteor.startup(function() {
    if (Meteor.isServer) {
        SkillSubject._ensureIndex({ "name": "text" });
    }
});

export default SkillSubject;