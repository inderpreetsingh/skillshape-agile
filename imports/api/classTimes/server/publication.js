import ClassTimes from "../fields";

Meteor.publish("classTimes.getclassTimes", function({ schoolId, classTypeId }) {
    console.log("classTimes.getclassTimes -->>",schoolId, classTypeId);
    let cursor = ClassTimes.find({schoolId, classTypeId});
    return ClassTimes.publishJoinedCursors(cursor,{ reactive: true }, this);
});