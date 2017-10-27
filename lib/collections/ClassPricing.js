

class_pricing  = "ClassPricing";  // avoid typos, this string occurs many times.
//
ClassPricing = new Mongo.Collection(class_pricing);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
 ClassPricing.attachSchema(new SimpleSchema({
   packageName: {
     type: String,
     optional: true
   },cost: {
     type: Number,
     optional: true
   },
   classTypeId :{
     type: String,
     optional: true
   },noClasses:{
     type: String,
     optional: true
   },start:{
     type: String,
     optional: true
   },finish:{
     type: String,
     optional: true
   },
   schoolId: {
       type: String,
       optional: true
   }
 }));
if(Meteor.isServer){
  Meteor.publish("ClassPricing", function(schoolId){
    return ClassPricing.find({schoolId:schoolId});
  });
  Meteor.methods({
    addClassPricing:function(doc){
      return ClassPricing.insert(doc)
    },
    updateClassPricing:function(id,doc){
      return ClassPricing.update({_id:id}, {$set:doc});
    },
    removeClassPricing:function(id){
      return ClassPricing.remove({_id:id});
    }
  });
}
