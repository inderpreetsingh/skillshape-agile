import isEmpty from 'lodash/isEmpty';
import ClassType from '../fields';
import ClassPricing from '/imports/api/classPricing/fields';
import ClassTimes from '/imports/api/classTimes/fields';
import Media from '/imports/api/media/fields';
import MonthlyPricing from '/imports/api/monthlyPricing/fields';
import School from '/imports/api/school/fields';

Meteor.publish('classType.getclassType', function ({ schoolId }) {
  // console.log("classType.getclassType pub -->>",schoolId)
  const cursor = ClassType.find({ schoolId });
  // let data = ClassType.publishJoinedCursors(cursor,{ reactive: true }, this);
  // data.map((cursorData)=>{
  // 	console.log("testing---->",cursorData.fetch());
  // })
  return ClassType.publishJoinedCursors(cursor, { reactive: true }, this);
});

Meteor.publish('classType.getClassTypesByFilter', function (filter) {
  const cursor = ClassType.find(filter);
  return ClassType.publishJoinedCursors(cursor, { reactive: true }, this);
});

Meteor.publish('classType.getClassTypeWithIds', function ({ classTypeIds }) {
  const cursor = ClassType.find({ _id: { $in: classTypeIds } });
  // let data = ClassType.publishJoinedCursors(cursor,{ reactive: true }, this);
  // data.map((cursorData)=>{
  // 	console.log("testing---->",cursorData.fetch());
  // })
  return ClassType.publishJoinedCursors(cursor, { reactive: true }, this);
});

Meteor.publish('classType.getClassTimesWithIds', function ({ classTypeId }) {
  if (!classTypeId) {
    // this.ready();
    return null;
  }
  const cursor = ClassTimes.find({ classTypeId });
  return ClassTimes.publishJoinedCursors(cursor, { reactive: true }, this);
});

Meteor.publish('classType.getClassTypeWithClassTimes', function ({ classTypeId }) {
  const cursor = ClassType.find({ _id: classTypeId });
  const classTypeData = cursor.fetch();

  if (isEmpty(classTypeData)) {
    return [];
  }

  // const classTimesCursor = ClassTimes.find({ classTypeId: classTypeId });

  const publishJoinedCursors = ClassType.publishJoinedCursors(cursor, { reactive: true }, this);

  // console.log(publishJoinedCursors, "===============");
  publishJoinedCursors.push(ClassTimes.find({ classTypeId }));
  publishJoinedCursors.push(School.find({ _id: classTypeData[0].schoolId }));
  publishJoinedCursors.push(ClassPricing.find({ classTypeId: { $in: [classTypeId] } }));
  publishJoinedCursors.push(MonthlyPricing.find({ classTypeId: { $in: [classTypeId] } }));
  publishJoinedCursors.push(Media.find({ schoolId: classTypeData[0].schoolId }));

  return publishJoinedCursors;
});
