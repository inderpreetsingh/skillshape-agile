import config from "/imports/config"

const ImportLogs = new Mongo.Collection(config.collections.importLogs);

/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
ImportLogs.attachSchema(new SimpleSchema({
    fileName: {
        type: String,
    },
    status: {
        type: String,
        defaultValue: "IN-PROGRESS",
        allowedValues: [
        				"IN-PROGRESS",
        				"COMPLETED"
        			]
    },
    totalRecord: {
        type: Number,
        defaultValue: 0
    },
    sucessCount: {
        type: Number,
        defaultValue: 0
    },
    errorRecordCount: {
    	type: Number,
        defaultValue: 0
    },
    errorRecord: {
        type: [Object],
        optional: true
    }
}));

Meteor.startup(function() {
    if (Meteor.isServer) {
        // Classes._dropIndex("c2_filters.location");
        ImportLogs._ensureIndex({ fileName:"text" });
    }
});

export default ImportLogs;