evaluation  = "Evaluation";  // avoid typos, this string occurs many times.
//
Evaluation = new Mongo.Collection(evaluation);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
 Evaluation.attachSchema(new SimpleSchema({
   evaluationTypeId: {
     type: String,
     optional: true
   },evaluationSubTypeId: {
     type: String,
     optional: true
   }
   ,classId: {
     type: String,
     optional: true
   }
   ,studentId: {
     type: String,
     optional: true
   }
   ,affectStudentId: {
     type: String,
     optional: true
   }
   ,instructorId: {
     type: String,
     optional: true
   }
   ,notes: {
     type: String,
     optional: true
   } ,score: {
      type: String,
      optional: true
  } ,levelScoreId: {
   type: String,
   optional: true
 } ,skillId: {
    type: String,
    optional: true
  }
  ,mediaList: {
    type: [String],
    optional: true
  }
 }));
