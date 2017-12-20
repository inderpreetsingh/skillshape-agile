import ClassTimes from "../fields";
import ClassInterest from "/imports/api/classInterest/fields";

Meteor.publish("classTimes.getclassTimes", function({ schoolId, classTypeId }) {
    console.log("classTimes.getclassTimes -->>", schoolId, classTypeId);
    let cursor = ClassTimes.find({ schoolId, classTypeId });
    return ClassTimes.publishJoinedCursors(cursor, { reactive: true }, this);
});

Meteor.publish("classTimes.getclassTimesForCalendar", function({schoolId, current_date, view}) {
    var date = '';
    let result = []
    if (current_date) {
        date = new Date(current_date);
    } else {
        current_date = new Date();
        date = new Date(current_date.getFullYear(), current_date.getMonth(), 0);
    }

    let school = School.findOne({ $or: [{ _id: schoolId }, { slug: schoolId }] });
    let condition = { "startDate": { '$gte': date }, schoolId: school && school._id };
    if(view === "schoolCalendar") {
        if (school) {
            console.log("classTimes.getclassTimesForCalendar --->>", condition)
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
        let classTimeCursor = ClassTimes.find({ $or: [{classTypeId: { $in: classTimeIds }}, {schoolId: school && school._id}], "startDate": { '$gte': date } });
        console.log("classTimeCursor data -->>",ClassTimes.find({ _id: { $in: classTimeIds }, "startDate": { '$gte': date } }).fetch())
        result.push(classInterestCursor);
        result.push(classTimeCursor);
    }

    return result;
});