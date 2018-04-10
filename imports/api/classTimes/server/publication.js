import ClassTimes from "../fields";
import ClassInterest from "/imports/api/classInterest/fields";
import School from "/imports/api/school/fields";

Meteor.publish("classTimes.getclassTimes", function({ schoolId, classTypeId }) {
    let cursor = ClassTimes.find({ schoolId, classTypeId });
    return ClassTimes.publishJoinedCursors(cursor, { reactive: true }, this);
});

Meteor.publish("classTimes.getclassTimesForCalendar", function({schoolId, classTypeId, calendarStartDate, calendarEndDate, view}) {
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

    if(classTypeId) {
        condition.classTypeId = classTypeId;
    }

    let currentUser = Meteor.users.findOne(this.userId);
    let selfManagedClassTimeIds = [];
    // This is done to grab class time ids that are managed by current user everywhere.
    if(currentUser) {
        let schoolIds = currentUser.profile && currentUser.profile.schoolId;
        if(!_.isEmpty(schoolIds)) {
            classTimesData = ClassTimes.find({ schoolId: { $in: schoolIds }}).fetch();
            selfManagedClassTimeIds = classTimesData.map((item) => { return item && item._id});
        }
        if(selfManagedClassTimeIds && school) {
            selfManagedClassTimeIds.push(school._id);
        }
    } else {
        // This is done to grab Class Times of current School.
        if(school && school._id) {
            condition.schoolId = school._id;
        }
    }

    console.log("selfManagedClassTimeIds", selfManagedClassTimeIds)
    console.log("condition", JSON.stringify(condition))

    if(this.userId) {
        // Attending Class Times of current user.
        let classInterestCursor = ClassInterest.find({userId: this.userId});
        let classTimeIds = classInterestCursor.map((data) => {
            return data.classTimeId;
        })
        // Class time ids of school that is managed by current user.
        if(selfManagedClassTimeIds) {
            classTimeIds = _.union(selfManagedClassTimeIds, classTimeIds);
        }
        condition['$or'].push({_id: { $in: classTimeIds }})
        let classTimeCursor = ClassTimes.find(condition);
        result.push(classInterestCursor);
        result.push(classTimeCursor);
    } else {
        result.push(ClassTimes.find(condition));
    }

    return result;
});



Meteor.publish("classTimes.getclassTimesByClassTypeIds", function({ schoolId, classTypeIds }) {
    // console.log("classTimes.getclassTimesByClassTypeIds -->>", schoolId, classTypeIds);
    let cursor = ClassTimes.find({ schoolId, classTypeId: { $in: classTypeIds} });
    return ClassTimes.publishJoinedCursors(cursor, { reactive: true }, this);
});