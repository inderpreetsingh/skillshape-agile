import ClassTimes from "./fields";

Meteor.methods({
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
            return ClassTimes.remove({ _id: doc._id });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
});