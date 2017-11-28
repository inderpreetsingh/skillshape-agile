import ClassType from "../fields";

Meteor.publish("classType.getclassType", function({ schoolId }) {
    
    let cursor = ClassType.find({schoolId});
    return ClassType.publishJoinedCursors(cursor,{ reactive: true }, this);
});