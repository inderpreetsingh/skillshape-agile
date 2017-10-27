category  = "Category";  // avoid typos, this string occurs many times.
//
Category = new Mongo.Collection(category);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
 Category.attachSchema(new SimpleSchema({
   name: {
     type: String,
     optional: true
   },programId: {
     type: String,
     optional: true
   }
 }));
