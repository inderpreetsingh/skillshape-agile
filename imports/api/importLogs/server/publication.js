import ImportLogs from "../fields";

Meteor.publish("importLogs.getAllLogs", function() {
    return ImportLogs.find();
});