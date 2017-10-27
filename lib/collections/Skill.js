skill  = "Skill";  // avoid typos, this string occurs many times.
//
Skill = new Mongo.Collection(skill);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
 Skill.attachSchema(new SimpleSchema({
   categoryTag: {
     type: [String],
     optional: true
   },
   subjectTag: {
     type: [String],
     optional: true
   }
   ,
   ownTags: {
     type: [String],
     optional: true
   }
   ,
   minmaxOrLevel: {
     type: [String],
     optional: true
   }
   ,
   reqForLevelId: {
     type: String,
     optional: true
   },
   prerequisitesSkill: {
     type: [String],
     optional: true
   },skillGroup: {
     type: [String],
     optional: true
   },requiredFor: {
     type: [String],
     optional: true
   },similarSkill: {
     type: [String],
     optional: true
   }
   ,iconpic: {
     type: String,
     optional: true
   },name: {
     type: String,
     optional: true
   },basicInstruction: {
     type: String,
     optional: true
   },variationInstruction: {
     type: String,
     optional: true
   },counterInstructions: {
     type: String,
     optional: true
   },notesToStudents: {
     type: String,
     optional: true
   },
   teachingPointers: {
     type: String,
     optional: true
   },
   notesToInstructors: {
     type: String,
     optional: true
   },
   mediaList: {
     type: [String],
     optional: true
   }
 }));
