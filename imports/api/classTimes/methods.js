import ClassTimes from "./fields";
import ClassType from "/imports/api/classType/fields";
import SLocation from "/imports/api/sLocation/fields";
import ClassInterest from "/imports/api/classInterest/fields";

Meteor.methods({
    "classTimes.getClassTimes": function({ schoolId, classTypeId, classTimeId, locationId}) {
        console.log("classTimes.getClassTimes -->>",schoolId, classTypeId, classTimeId)
        // console.log("SchoolSchool -->>",School.find({ _id: schoolId}))
        return {
            school: School.findOne({ _id: schoolId}), 
            classTimes: ClassTimes.findOne({ _id: classTimeId}), 
            classType: ClassType.findOne({ _id: classTypeId}), 
            location: SLocation.findOne({ _id: locationId}), 
        }
    },
    "classTimes.addClassTimes": function(doc) {
        const user = Meteor.users.findOne(this.userId);
        console.log("classTimes.addClassTimes methods called!!!", doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "ClassTimes_CUD" })) {
            // doc.remoteIP = this.connection.clientAddress;
            doc.createdAt = new Date();
            // console.log(doc);
            return ClassTimes.insert(doc);
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "classTimes.editClassTimes": function(doc_id, doc) {
        const user = Meteor.users.findOne(this.userId);
        // console.log("classTimes.editClassTimes methods called!!!",doc_id, doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "ClassTimes_CUD" })) {
            console.log(doc);
            return ClassTimes.update({ _id: doc_id }, { $set: doc });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "classTimes.removeClassTimes": function(doc) {
        const user = Meteor.users.findOne(this.userId);
        // console.log("classTimes.removeClassTimes methods called!!!",doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "ClassTimes_CUD" })) {
            ClassInterest.remove({classTimeId: doc._id})
            return ClassTimes.remove({ _id: doc._id });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
});