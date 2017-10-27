module  = "Module";  // avoid typos, this string occurs many times.
//
Module = new Mongo.Collection(module);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
 Module.attachSchema(new SimpleSchema({
   skillId: {
     type: String,
     optional: true
   },name: {
     type: String,
     optional: true
   }
   ,timeMins: {
     type: String,
     optional: true
   }
 }));
