class_type = "ClassType"; // avoid typos, this string occurs many times.
//
ClassType = new Mongo.Collection(class_type);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
ClassType.attachSchema(new SimpleSchema({
    createdBy: {
        type: String,
        optional: true
    },
    schoolId: {
        type: String,
        optional: true
    },
    name: {
        type: String,
        optional: true
    },
    desc: {
        type: String,
        optional: true
    },
    skillTypeId: {
        type: String,
        optional: true
    },
    classTypeImg: {
        type: String,
        optional: true
    },
    classes: {
        type: [String],
        optional: true
    },
    tags:{
        type:String,
        optional:true
    }
}));

ClassType.allow({
    insert: function () {
        return true;
    },
    update: function () {
        return true;
    },
    remove: function () {
        return true;
    }
});


if(Meteor.isServer){

  ClassType._ensureIndex({name:"text",desc:"text"});
  Meteor.publish("classTypeBySchool", function(schoolId){
    return ClassType.find({schoolId:schoolId})
  });
Meteor.methods({
  "addClassType": function (doc) {
    return ClassType.insert(doc);
  },
  "updateClassType" : function(id,doc){
    return ClassType.update({_id:id}, {$set:doc});
  },
  "removeClassType" : function(id){
    SkillClass.remove({classTypeId:id});
    ClassSchedule.remove({skillClassId:id});
    ClassType.remove({_id:id});
  }

});
}
