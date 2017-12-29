import ClassType from "../fields";

Meteor.publish("classType.getclassType", function({ schoolId }) {
    
    console.log("classType.getclassType pub -->>",schoolId)
    let cursor = ClassType.find({schoolId});
    // let data = ClassType.publishJoinedCursors(cursor,{ reactive: true }, this);
    // data.map((cursorData)=>{
    // 	console.log("testing---->",cursorData.fetch());
    // })
    return ClassType.publishJoinedCursors(cursor,{ reactive: true }, this);
});