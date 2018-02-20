import config from "/imports/config";

const School = new Mongo.Collection(config.collections.school);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
School.attachSchema(new SimpleSchema({
  is_publish: {
    type: String,
    optional: true
  },
  name: {
    type: String,
    optional: true
  },
  website: {
    type: String,
    optional: true
  },
  phone: {
    type: String,
    optional: true
  },
  schooldesc: {
    type: String,
    optional: true
  },
  address: {
    type: String,
    optional: true
  },
  schoolGroupId: {
    type: String,
    optional: true
  },
  tag: {
    type: String,
    optional: true
  },
  quote: {
    type: String,
    optional: true
  },
  message: {
    type: String,
    optional: true
  },
  categoryCalled: {
    type: String,
    optional: true
  },
  subjectCalled: {
    type: String,
    optional: true
  },
  levelCalled: {
    type: String,
    optional: true
  },
  phone: {
    type: String,
    optional: true
  },
  claimed: {
    type: String,
    optional: true
  },
  logoImg: {
    type: String,
    optional: true
  },
  topBarColor: {
    type: String,
    optional: true
  },
  bodyColour: {
    type: String,
    optional: true
  },
  backGroundVideoUrl: {
    type: String,
    optional: true
  },
  moduleColour: {
    type: String,
    optional: true
  },
  font: {
    type: String,
    optional: true
  },
  mainImage: {
    type: String,
    optional: true
  },
  aboutHtml: {
    type: String,
    optional: true
  },
  studentNotesHtml: {
    type: String,
    optional: true
  },
  scoreMin: {
    type: String,
    optional: true
  },
  scoreMax: {
    type: String,
    optional: true
  },
  userId: {
    type: String,
    optional: true
  },
  email: {
    type: String,
    optional: true
  },
  firstName:{
    type: String,
    optional: true
  },
  lastName:{
    type: String,
    optional: true
  },
  admins: {
    type: [String],
    optional: true
  },
  superAdmin: {
    type: String,
    optional: true
  }
}));

School.join(Meteor.users, "admins", "adminsData", ["profile"]);

Meteor.startup(function() {
    if (Meteor.isServer) {
        School._ensureIndex({ name: "text", website: "text" });
    }
});

export default School;