import ClassTimes from "../fields";
import ClassInterest from "/imports/api/classInterest/fields";

Meteor.publish("classTimes.getclassTimes", function({ schoolId, classTypeId }) {
    console.log("classTimes.getclassTimes -->>", schoolId, classTypeId);
    let cursor = ClassTimes.find({ schoolId, classTypeId });
    return ClassTimes.publishJoinedCursors(cursor, { reactive: true }, this);
});

Meteor.publish("classTimes.getclassTimesForCalendar", function({schoolId, calendarStartDate, calendarEndDate, view}) {
    console.log("classTimes.getclassTimesForCalendar -->>>",calendarStartDate, calendarEndDate);
    let startDate = '';
    let endDate = '';
    let result = []
    if (calendarStartDate && calendarEndDate) {
        startDate = new Date(calendarStartDate);
        endDate = new Date(calendarEndDate);
    } else {
        calendarStartDate = new Date();
        calendarEndDate = new Date();
        startDate = new Date(calendarStartDate.getFullYear(), calendarStartDate.getMonth(), 0);
        endDate = new Date(calendarEndDate.getFullYear(), calendarEndDate.getMonth(), 0);
    }

    let school = School.findOne({ $or: [{ _id: schoolId }, { slug: schoolId }] });
    let condition = {
        '$or': [
            { scheduleType: "oneTime", startDate: { '$gte': startDate } },
            { scheduleType: "onGoing", startDate: { '$lte': endDate } },
            { scheduleType: "recurring", endDate: { '$gte': startDate } },
        ],  
        schoolId: school && school._id 
    };
    if(view === "schoolCalendar") {
        if (school) {
            console.log("classTimes.getclassTimesForCalendar condition --->>", condition)
            result.push(ClassTimes.find(condition));
            // result.push(ClassTimes.publishJoinedCursors(cursor, { reactive: true }, this));
        } 
    }

    if(view === "myCalendar" && this.userId) {
        let classInterestCursor = ClassInterest.find({userId: this.userId})
        let classTimeIds = classInterestCursor.map((data) => {
            return data.classTimeId;
        })
        console.log("classTimeIds -->>",classTimeIds)
        condition['$or'].push({classTypeId: { $in: classTimeIds }})
        console.log("myCalendar condition -->>",condition)
        let classTimeCursor = ClassTimes.find(condition);
        result.push(classInterestCursor);
        result.push(classTimeCursor);
    }

    return result;
});