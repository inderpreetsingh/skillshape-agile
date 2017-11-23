s_location = "SLocation"; // avoid typos, this string occurs many times.
//
SLocation = new Mongo.Collection(s_location);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */

 Schema = {}
 Schema.Room = new SimpleSchema({
    id: {
      optional: true,
      type: String
    },name: {
       optional: true,
       type: String
     },
     capicity: {
        optional: true,
        type: Number
    }
 });
SLocation.attachSchema(new SimpleSchema({
    createdBy: {
        type: String,
        optional: true
    },
    schoolId: {
        type: String,
        optional: true
    },
    title: {
        type: String,
        optional: true
    },
    address: {
        type: String,
        optional: true
    },
    geoLat: {
        type: String,
        optional: true
    },
    geoLong: {
        type: String,
        optional: true
    },
    maxCapacity: {
        type: String,
        optional: true
    },
    city: {
        type: String,
        optional: true
    },
    state: {
        type: String,
        optional: true
    },
    neighbourhood: {
        type: String,
        optional: true
    },
    zip: {
        type: String,
        optional: true
    },
    country: {
        type: String,
        optional: true
    },
    loc: {
        type: [Number], // [<longitude>, <latitude>]
        index: '2d', // create the geospatial index
        optional: true,
        decimal: true
    },
    "rooms.$": {
        type: Schema.Room,
        optional: true
    },
}));
if (Meteor.isServer) {
    Meteor.publish("SchoolLocation", function(schoolId){
      return SLocation.find({schoolId:schoolId});
    });
    SLocation._ensureIndex({ loc: "2d" });
    /*SLocation._ensureIndex({ loc: "2dsphere" });*/
    /*createIndex({point:"2dsphere"});*/
    Meteor.methods({
      addLocation:function(data){
         return SLocation.insert(data);
      },
      editLocation:function(id,data){
         return SLocation.update({_id:id}, {$set:data});
      },
      removeLocation:function(id){
        SLocation.remove({_id:id});
      },
      addRoom:function(data,location){
        console.log(data);
        console.log(location);
        return SLocation.update({_id:location},{$push:{"rooms":data}});
      },
      editRoom:function(data,location){
        console.log(data);
        console.log(location);
        return SLocation.update({_id:location,"rooms.id": data.id},{$set:{"rooms.$":data}});
      },
      roomRemove : function(id,location){
          SLocation.update({_id:location},{$pull:{"rooms":{id:id}}},{multi: true});
          return true;
      }
    });
}
