import Modules from "./fields";

Meteor.methods({
    "school.addModule": function(doc) {
        const user = Meteor.users.findOne(this.userId);
        console.log("school.addModule methods called!!!");
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "modules_CUD" })) {
            doc.remoteIP = this.connection.clientAddress;
            doc.createdAt = new Date();
            console.log(doc);
            return Modules.insert(doc);
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "school.removeModule": function(doc) {
        const user = Meteor.users.findOne(this.userId);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "modules_CUD" })) {
            console.log(doc);
            return Modules.remove({ _id: doc._id });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "school.editModule": function(doc_id, doc) {
        const user = Meteor.users.findOne(this.userId);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "modules_CUD" })) {
            console.log(doc);
            return Modules.update({ _id: doc_id }, { $set: doc });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    }
});