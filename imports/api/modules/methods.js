import Modules from "./fields";

Meteor.methods({
    "module.addModule": function(doc) {
        const user = Meteor.users.findOne(this.userId);
        // console.log("module.addModule methods called!!!");
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "modules_CUD" })) {
            // doc.remoteIP = this.connection.clientAddress;
            doc.createdAt = new Date();
            console.log(doc);
            return Modules.insert(doc);
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "module.removeModule": function(doc) {
        const user = Meteor.users.findOne(this.userId);
        // console.log("module.removeModule methods called!!!",doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "modules_CUD" })) {
            return Modules.remove({ _id: doc._id });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "module.editModule": function(doc_id, doc) {
        const user = Meteor.users.findOne(this.userId);
        // console.log("module.editModule methods called!!!",doc_id, doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "modules_CUD" })) {
            console.log(doc);
            return Modules.update({ _id: doc_id }, { $set: doc });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    }
});