
evaluation_type  = "EvaluationType";  // avoid typos, this string occurs many times.
//
EvaluationType = new Mongo.Collection(evaluation_type);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
 EvaluationType.attachSchema(new SimpleSchema({
   evaluationType: {
     type: String,
     optional: true
   },evaluationSubType: {
     type: String,
     optional: true
   },evaluationSubType: {
     type: [String],
     optional: true
   }
   ,notes: {
     type: String,
     optional: true
   }
   ,hasScore: {
     type: String,
     optional: true
   },skillMandatory: {
     type: String,
     optional: true
   }
 }));
