import config from "/imports/config";

const SLocation = new Mongo.Collection(config.collections.sLocation);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
const Schema = {}
Schema.Room = new SimpleSchema({
    id: {
      optional: true,
      type: String
    },
    name: {
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


Meteor.startup(function() {
    
});

export default SLocation;