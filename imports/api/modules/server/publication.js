import Modules from "../fields";

Meteor.publish("school.getModules", function({ schoolId }) {
    return Modules.find({schoolId});
});