import SLocation from "./fields";

Meteor.methods({
    "location.addLocation": function(doc) {
        const user = Meteor.users.findOne(this.userId);
        console.log("location.addModule methods called!!!");
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "SLocation_CUD" })) {
            // doc.remoteIP = this.connection.clientAddress;
            doc.createdAt = new Date();
            console.log("location.addModule doc -->>",doc);
            return SLocation.insert(doc);
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "location.editLocation": function(doc_id, doc) {
        const user = Meteor.users.findOne(this.userId);
        console.log("location.editModule methods called!!!",doc_id, doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "SLocation_CUD" })) {
            console.log(doc);
            return SLocation.update({ _id: doc_id }, { $set: doc });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "location.removeLocation": function(doc) {
        const user = Meteor.users.findOne(this.userId);
        console.log("location.removeModule methods called!!!",doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "SLocation_CUD" })) {
            return SLocation.remove({ _id: doc._id });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    }
});