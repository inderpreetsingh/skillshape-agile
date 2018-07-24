userDemand  = "UserDemand";  // avoid typos, this string occurs many times.
//
UserDemand = new Mongo.Collection(userDemand);

/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
UserDemand.attachSchema(new SimpleSchema({
    email: {
     type: String,
     optional: true
   },location: {
     type: String,
     optional: true
   },
   skill: {
     type: String,
     optional: true
   },
   classPrice: {
     type: String,
     optional: true
   },
   monthPrice: {
     type: String,
     optional: true
   }
   ,dateOfJoin: {
     type: Date,
     optional: true
   }
 }));
 if(Meteor.isServer){
   Meteor.methods({
     addUserDemand: function(doc) {
       doc.dateOfJoin = new Date();
       return UserDemand.insert(doc);
     }
     });
   }
