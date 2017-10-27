monthly_pricing  = "MonthlyPricing";  // avoid typos, this string occurs many times.
//
MonthlyPricing = new Mongo.Collection(monthly_pricing);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
 MonthlyPricing.attachSchema(new SimpleSchema({
   packageName: {
     type: String,
     optional: true
   },pymtType: {
     type: String,
     optional: true
   },classTypeId: {
     type: String,
     optional: true
   },
   oneMonCost: {
     type: Number,
     optional: true
   },
   threeMonCost: {
     type: Number,
     optional: true
   },sixMonCost: {
     type: Number,
     optional: true
   },annualCost: {
     type: Number,
     optional: true
   },lifetimeCost: {
     type: Number,
     optional: true
   },
   schoolId:{
     type: String,
     optional: true
   }
 }));
if(Meteor.isServer){
  Meteor.publish("MonthlyPricing", function(schoolId){
    return MonthlyPricing.find({schoolId:schoolId});
  });
  Meteor.methods({
    addMonthlyPackages:function(doc){
      return MonthlyPricing.insert(doc)
    },
    updateMonthlyPackages:function(id,doc){
      return MonthlyPricing.update({_id:id}, {$set:doc});
    },
    removeMonthlyPackages:function(id){
      return MonthlyPricing.remove({_id:id});
    }
  });
}
