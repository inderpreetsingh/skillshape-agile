import ClassTimes from "../fields";
import ClassInterest from "/imports/api/classInterest/fields";
import School from "/imports/api/school/fields";
import ClassType from "/imports/api/classType/fields";

Meteor.publish("classTimes.getclassTimes", function({ schoolId, classTypeId }) {
  let cursor = ClassTimes.find({ schoolId, classTypeId });
  return ClassTimes.publishJoinedCursors(cursor, { reactive: true }, this);
});

Meteor.publish("classTimes.getclassTimesForCalendar", function({
  schoolId,
  classTypeId,
  calendarStartDate,
  calendarEndDate,
  view
}) {
  let startDate = "";
  let endDate = "";
  let result = [];
  let school;
  // console.log("schoolId, classTypeId, calendarStartDate, calendarEndDate, view", schoolId, classTypeId, calendarStartDate, calendarEndDate, view)
  if (calendarStartDate && calendarEndDate) {
    startDate = new Date(calendarStartDate);
    endDate = new Date(calendarEndDate);
  } else {
    calendarStartDate = new Date();
    calendarEndDate = new Date();
    startDate = new Date(
      calendarStartDate.getFullYear(),
      calendarStartDate.getMonth(),
      0
    );
    endDate = new Date(
      calendarEndDate.getFullYear(),
      calendarEndDate.getMonth(),
      0
    );
  }

  let condition = {
    $or: [
      // { scheduleType: "oneTime", "scheduleDetails.oneTime": {"$exists": true}, "scheduleDetails.oneTime.startDate": { '$gte': startDate } },
      // { scheduleType: "OnGoing", startDate: { '$lte': endDate } },
      // { scheduleType: "recurring", endDate: { '$gte': startDate } },
    ]
  };

  // School View
  if (view == "SchoolView") {
    school = School.findOne({ $or: [{ _id: schoolId }, { slug: schoolId }] });
    // condition.schoolId = school && school._id;
  }
  // Class Type View
  if (view == "ClassType") {
    let classTypeRec = ClassType.findOne({ _id: classTypeId });
    let schoolId = classTypeRec && classTypeRec.schoolId;
    condition["$or"].push({ classTypeId: classTypeId, schoolId });
  }

  // Class I am Managing.
  if (this.userId) {
    let currentUser = Meteor.users.findOne(this.userId);
    let schoolIds = [];

    // This is done to grab class time ids that are managed by current user everywhere.
    if (currentUser) {
      schoolIds = (currentUser.profile && currentUser.profile.schoolId) || [];
    }
    if (school) {
      schoolIds.push(school._id);
    }

    // Attending Class Times of current user.
    let classInterestCursor = ClassInterest.find({ userId: this.userId });
    let classTimeIds = classInterestCursor.map(data => {
      return data.classTimeId;
    });

    // My Calander View and I don't manage any school and I have no class Interests.
    if (view == "MyCalendar") {
      if (_.isEmpty(schoolIds) && _.isEmpty(classTimeIds)) {
        return [];
      }
    }

    condition["$or"].push({ _id: { $in: classTimeIds } });
    if (schoolIds && schoolIds.length > 0) {
      condition["$or"].push({ schoolId: { $in: schoolIds } });
    }
    // console.log("schoolIds====>",schoolIds)
    let classTimeCursor = ClassTimes.find(condition);
    // let classTypeData = ClassType.find({schoolId: { $in: schoolIds }})
    // console.log("view", view);
    result.push(classInterestCursor);
    result.push(classTimeCursor);
    // result.push(classTypeData);
  } else {
    // User is not login then show only class times of that School only.
    let schoolIds = [];
    if (school) {
      schoolIds.push(school._id);
    }
    condition["$or"].push({ schoolId: { $in: schoolIds } });
    condition.schoolId = { $in: schoolIds };
    // console.log("condition",JSON.stringify(condition));
    result.push(ClassTimes.find(condition));
  }

  return result;
});

Meteor.publish("classTimes.getclassTimesByClassTypeIds", function({
  schoolId,
  classTypeIds
}) {
  // console.log("classTimes.getclassTimesByClassTypeIds -->>", schoolId, classTypeIds);
  let cursor = ClassTimes.find({
    schoolId,
    classTypeId: { $in: classTypeIds || [] }
  });
  return ClassTimes.publishJoinedCursors(cursor, { reactive: true }, this);
});

Meteor.publish("classTime.getclassType", function({ classTypeIds }) {
  let cursor = ClassType.find({ _id: { $in: classTypeIds } });
  return ClassType.publishJoinedCursors(cursor, { reactive: true }, this);
});
