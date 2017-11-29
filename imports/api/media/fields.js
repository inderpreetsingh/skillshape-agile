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
        optional: true
    },
    name: {
        type: String,
        optional: true
    },
    desc: {
        type: String,
        optional: true
    },
    sourcePath: {
        type: String,
        optional: true
    },
    schoolId: {
        type: String,
        optional: true
    },
    createdBy: {
        type: String,
        optional: true
    },
    createdAt: {
        type: Date,
        optional: true
    }
}));


Meteor.startup(function() {

});

export default Media;