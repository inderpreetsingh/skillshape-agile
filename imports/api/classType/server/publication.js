import isEmpty from "lodash/isEmpty";

import ClassType from "../fields";
import ClassTimes from "/imports/api/classTimes/fields";
import School from "/imports/api/school/fields";
import ClassPricing from "/imports/api/classPricing/fields";
import MonthlyPricing from "/imports/api/monthlyPricing/fields";
import Media from "/imports/api/media/fields";

Meteor.publish("classType.getclassType", function({ schoolId }) {
  // console.log("classType.getclassType pub -->>",schoolId)
  let cursor = ClassType.find({ schoolId });
  // let data = ClassType.publishJoinedCursors(cursor,{ reactive: true }, this);
  // data.map((cursorData)=>{
  // 	console.log("testing---->",cursorData.fetch());
  // })
  return ClassType.publishJoinedCursors(cursor, { reactive: true }, this);
});

Meteor.publish("classType.getClassTimesWithId", function({ classTypeId }) {
  let cursor = ClassTimes.find({ classTypeId: classTypeId });
  return ClassTimes.publishJoinedCursors(cursor, { reactive: true }, this);
});

Meteor.publish("classType.getClassTimesWithIds", function(classTypeIds) {
  let cursor = ClassTimes.find({ classTypeId: { $in: classTypeIds } });
  return ClassTimes.publishJoinedCursors(cursor, { reactive: true }, this);
});

Meteor.publish("classType.getClassTypeWithClassTimes", function({
  classTypeId
}) {
  let cursor = ClassType.find({ _id: classTypeId });
  let classTypeData = cursor.fetch();

  if (isEmpty(classTypeData)) {
    return [];
  }

  // const classTimesCursor = ClassTimes.find({ classTypeId: classTypeId });

  let publishJoinedCursors = ClassType.publishJoinedCursors(
    cursor,
    { reactive: true },
    this
  );

  // console.log(publishJoinedCursors, "===============");
  publishJoinedCursors.push(ClassTimes.find({ classTypeId: classTypeId }));
  publishJoinedCursors.push(School.find({ _id: classTypeData[0].schoolId }));
  publishJoinedCursors.push(
    ClassPricing.find({ classTypeId: { $in: [classTypeId] } })
  );
  publishJoinedCursors.push(
    MonthlyPricing.find({ classTypeId: { $in: [classTypeId] } })
  );
  publishJoinedCursors.push(
    Media.find({ schoolId: classTypeData[0].schoolId })
  );

  return publishJoinedCursors;
});
