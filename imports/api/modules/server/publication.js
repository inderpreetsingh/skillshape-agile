import Modules from "../fields";
import { check } from 'meteor/check';

Meteor.publish("modules.getModules", function({ schoolId }) {
    check(schoolId, String);
	
    let cursor = Modules.find({schoolId});
    return Modules.publishJoinedCursors(cursor,{ reactive: true }, this);
});