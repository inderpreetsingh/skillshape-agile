skill_type  = "SkillType";  // avoid typos, this string occurs many times.
//
SkillType = new Mongo.Collection(skill_type);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
SkillType.attachSchema(new SimpleSchema({
   name: {
     type: String,
     optional: true
   }
 }));
if(Meteor.isServer){

  Meteor.publish("SkillType", function(argument){
    return SkillType.find({},{sort:{"name": 1}})
  });

  Meteor.methods({
    addSkillType:function(doc){
       return SkillType.insert(doc)
    }
  });
}
