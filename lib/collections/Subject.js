subject  = "Subject";  // avoid typos, this string occurs many times.
//
Subject = new Mongo.Collection(subject);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
 Subject.attachSchema(new SimpleSchema({
   name: {
     type: String,
     optional: true
   },categoryId: {
     type: String,
     optional: true
   }
 }));
