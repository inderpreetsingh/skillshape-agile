program  = "Program";  // avoid typos, this string occurs many times.
//
Program = new Mongo.Collection(program);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
 Program.attachSchema(new SimpleSchema({
  name: {
    type: String,
    optional: true
  },schoolId: {
    type: String,
    optional: true
  },description: {
    type: String,
    optional: true
  },levelCount: {
    type: String,
    optional: true
  },defaultMinmaxOrLevel: {
    type: String,
    optional: true
  },scoreMin: {
    type: String,
    optional: true
  }
  ,scoreMax: {
    type: String,
    optional: true
  }
  }));
