import isEmpty from 'lodash/isEmpty';

import ClassType from "../fields";
import ClassTimes from "/imports/api/classTimes/fields";
import School from "/imports/api/school/fields";

Meteor.publish("classType.getclassType", function({ schoolId }) {

    console.log("classType.getclassType pub -->>",schoolId)
    let cursor = ClassType.find({schoolId});
    // let data = ClassType.publishJoinedCursors(cursor,{ reactive: true }, this);
    // data.map((cursorData)=>{
    // 	console.log("testing---->",cursorData.fetch());
    // })
    return ClassType.publishJoinedCursors(cursor,{ reactive: true }, this);
});

Meteor.publish("classType.getClassTypeWithClassTimes", function({ classTypeId }) {

    let cursor = ClassType.find({_id: classTypeId});
    let classTypeData = cursor.fetch();

    if(isEmpty(classTypeData)) {
        return [];
    }

	let publishJoinedCursors = ClassType.publishJoinedCursors(cursor,{ reactive: true }, this)
    publishJoinedCursors.push(ClassTimes.find({ classTypeId: classTypeId  }));
    publishJoinedCursors.push(School.find({ _id: classTypeData[0].schoolId  }));

	return publishJoinedCursors
});