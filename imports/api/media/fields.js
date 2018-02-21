import config from "/imports/config"

const Media = new Mongo.Collection(config.collections.media);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
Media.attachSchema(new SimpleSchema({
    type: {
        type: String,
    },
    name: {
        type: String,
    },
    desc: {
        type: String,
        optional: true
    },
    sourcePath: {
        type: String,
    },
    schoolId: {
        type: String,
    },
    createdBy: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    memberId: { // Needs to delete this If media uploads from School member page
        type: String,
        optional: true
    },
    taggedUserIds: {
        type: [String],
        optional:true
    }

}));

Media.join(Meteor.users, "taggedUserIds", "taggedUserData", ["profile"]);

// Media.join(Meteor.users, "createdBy", "creator", ["profile"]);

Meteor.startup(function() {
    if (Meteor.isServer) {
        Media._ensureIndex({ "name": "text" });
    }
});

export default Media;