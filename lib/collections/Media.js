media  = "Media1";  // avoid typos, this string occurs many times.
//
Media = new Mongo.Collection(media);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
 Media.attachSchema(new SimpleSchema({
   mType: {
     type: String,
     optional: true
   },mFormat: {
     type: String,
     optional: true
   },title: {
     type: String,
     optional: true
   },desc: {
     type: String,
     optional: true
   },sourcePath: {
     type: String,
     optional: true
   },studentId: {
     type: String,
     optional: true
   },instrcutorId: {
     type: String,
     optional: true
   },skillId: {
     type: String,
     optional: true
   },createdBy: {
     type: String,
     optional: true
   },createdAt: {
     type: Date,
     optional: true
   }
 }));
