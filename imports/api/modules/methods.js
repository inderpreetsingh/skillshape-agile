import Modules from "./fields";
import { check } from 'meteor/check';

Meteor.methods({
    "module.addModule": function(doc) {
        check(doc, Object);

        const user = Meteor.users.findOne(this.userId);
        // console.log("module.addModule methods called!!!");
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "modules_CUD" })) {
            // doc.remoteIP = this.connection.clientAddress;
            doc.createdAt = new Date();
            return Modules.insert(doc);
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "module.removeModule": function(doc) {
        check(doc, Object);

        const user = Meteor.users.findOne(this.userId);
        // console.log("module.removeModule methods called!!!",doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "modules_CUD" })) {
            return Modules.remove({ _id: doc._id });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "module.editModule": function(doc_id, doc) {
        check(doc, Object);
        check(doc_id, String);
        const user = Meteor.users.findOne(this.userId);
        // console.log("module.editModule methods called!!!",doc_id, doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "modules_CUD" })) {
            return Modules.update({ _id: doc_id }, { $set: doc });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    }
});