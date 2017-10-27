level  = "Level";  // avoid typos, this string occurs many times.
//
Level = new Mongo.Collection(level);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
 Level.attachSchema(new SimpleSchema({
   title: {
     type: String,
     optional: true
   },requirement: {
     type: String,
     optional: true
   },sequence: {
     type: String,
     optional: true
   },programId: {
     type: String,
     optional: true
   },minTime: {
     type: String,
     optional: true
   }
 }));
