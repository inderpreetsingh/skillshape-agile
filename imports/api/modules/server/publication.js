import Modules from "../fields";

Meteor.publish("modules.getModules", function({ schoolId }) {
	
    let cursor = Modules.find({schoolId});
    return Modules.publishJoinedCursors(cursor,{ reactive: true }, this);
});