import ClassTimes from "../fields";
import ClassInterest from "/imports/api/classInterest/fields";
import School from "/imports/api/school/fields";

Meteor.publish("classTimes.getclassTimes", function({ schoolId, classTypeId }) {
    // console.log("classTimes.getclassTimes -->>", schoolId, classTypeId);
    let cursor = ClassTimes.find({ schoolId, classTypeId });
    return ClassTimes.publishJoinedCursors(cursor, { reactive: true }, this);
});

Meteor.publish("classTimes.getclassTimesForCalendar", function({schoolId, classTypeId, calendarStartDate, calendarEndDate, view}) {
    // console.log("classTimes.getclassTimesForCalendar schoolId -->>>", schoolId, classTypeId);
    let startDate = '';
    let endDate = '';
    let result = [];
    let school;

    if (calendarStartDate && calendarEndDate) {
        startDate = new Date(calendarStartDate);
        endDate = new Date(calendarEndDate);
    } else {
        calendarStartDate = new Date();
        calendarEndDate = new Date();
        startDate = new Date(calendarStartDate.getFullYear(), calendarStartDate.getMonth(), 0);
        endDate = new Date(calendarEndDate.getFullYear(), calendarEndDate.getMonth(), 0);
    }

    if(schoolId) {
        school = School.findOne({ $or: [{ _id: schoolId }, { slug: schoolId }] });
    }

    let condition = {
        '$or': [
            { scheduleType: "oneTime", "scheduleDetails.oneTime": {"$exists": true}, "scheduleDetails.oneTime.startDate": { '$gte': startDate } },
            { scheduleType: "OnGoing", startDate: { '$lte': endDate } },
            { scheduleType: "recurring", endDate: { '$gte': startDate } },
        ],
    };

    if(school && school._id) {
        condition.schoolId = school._id;
    }

    if(classTypeId) {
        condition.classTypeId = classTypeId;
    }

    if(view === "schoolCalendar") {
        if (school) {
            // console.log("classTimes.getclassTimesForCalendar condition --->>", condition)
            result.push(ClassTimes.find(condition));
            // result.push(ClassTimes.publishJoinedCursors(cursor, { reactive: true }, this));
        }
    }

    if(view === "myCalendar" && this.userId) {
        let classInterestCursor = ClassInterest.find({userId: this.userId})
        let classTimeIds = classInterestCursor.map((data) => {
            return data.classTimeId;
        })
        // console.log("classTimeIds -->>",classTimeIds)
        condition['$or'].push({classTypeId: { $in: classTimeIds }})
        // console.log("myCalendar condition -->>",condition)
        let classTimeCursor = ClassTimes.find(condition);
        result.push(classInterestCursor);
        result.push(classTimeCursor);
    }

    return result;
});



Meteor.publish("classTimes.getclassTimesByClassTypeIds", function({ schoolId, classTypeIds }) {
    // console.log("classTimes.getclassTimesByClassTypeIds -->>", schoolId, classTypeIds);
    let cursor = ClassTimes.find({ schoolId, classTypeId: { $in: classTypeIds} });
    return ClassTimes.publishJoinedCursors(cursor, { reactive: true }, this);
});