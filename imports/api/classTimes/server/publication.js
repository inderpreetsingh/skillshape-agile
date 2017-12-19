import ClassTimes from "../fields";

Meteor.publish("classTimes.getclassTimes", function({ schoolId, classTypeId }) {
    console.log("classTimes.getclassTimes -->>", schoolId, classTypeId);
    let cursor = ClassTimes.find({ schoolId, classTypeId });
    return ClassTimes.publishJoinedCursors(cursor, { reactive: true }, this);
});

Meteor.publish("classTimes.getclassTimesForCalendar", function(schoolId, current_date) {
    var date = '';
    if (current_date) {
        date = new Date(current_date);
    } else {
        current_date = new Date();
        date = new Date(current_date.getFullYear(), current_date.getMonth(), 0);
    }
    school = School.findOne({ $or: [{ _id: schoolId }, { slug: schoolId }] });
    if (school) {
        var condition = { "startDate": { '$gte': date }, schoolId: school._id };
        console.log("classTimes.getclassTimesForCalendar --->>", condition)
        let cursor = ClassTimes.find(condition);
        return ClassTimes.publishJoinedCursors(cursor, { reactive: true }, this);
    } else {
        this.ready();
    }
});