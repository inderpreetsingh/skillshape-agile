import config from "/imports/config"

const Classes = new Mongo.Collection(config.collections.classes);

/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
Classes.attachSchema(new SimpleSchema({
    isTemplate: {
        type: String,
        optional: true
    },
    isRecurring: {
        type: String,
        optional: true
    },
    className: {
        type: String,
        optional: true
    },
    plannedStart: {
        type: String,
        optional: true
    },
    durationMins: {
        type: Date,
        optional: true
    },
    planStartTime: {
        type: String,
        optional: true
    },
    planEndTime: {
        type: String,
        optional: true
    },
    classImagePath: {
        type: String,
        optional: true
    },
    classDescription: {
        type: String,
        optional: true
    },
    plannedEnd: {
        type: String,
        optional: true
    },
    actualStart: {
        type: Date,
        optional: true
    },
    actualEnd: {
        type: Date,
        optional: true
    },
    notes: {
        type: Date,
        optional: true
    },
    locationId: {
        type: String,
        optional: true
    },
    masterRecurringClassId: {
        type: String,
        optional: true
    },
    classTypeId: {
        type: String,
        optional: true
    },
    repeats: {
        type: String,
        optional: true
    },
    schoolId: {
        type: String,
        optional: true
    },
    isNeedIgnore: {
        type: String,
        optional: true
    },
    tab_option: {
        type: String,
        optional: true
    },
    room: {
        type: String,
        optional: true
    },
    filters: {
    	type: Object,
        optional: true
    },
	"filters.classPriceCost": {
		type: Number,
    	optional: true
	},
	"filters.monthlyPriceCost": {
		type: Object,
		optional: true,
    	blackbox: true
	},
    "filters.location": {
        type: [Number], 
        optional: true,
        decimal: true
    },
    "filters.schoolName": {
        type: String,
        optional: true,
    },
}));

Meteor.startup(function() {
    if (Meteor.isServer) {
        // Classes._dropIndex("c2_filters.location");
        Classes._ensureIndex({ "filters.schoolName": 'text', className:"text", classDescription:"text" });
    }
});

export default Classes;