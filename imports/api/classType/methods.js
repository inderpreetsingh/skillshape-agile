import ClassType from "./fields";
import ClassTimes from "/imports/api/classTimes/fields";
import ClassInterest from "/imports/api/classInterest/fields";

Meteor.methods({
    "classType.getClassType": function({schoolId}) {
        
        return ClassType.find({schoolId}).fetch();
    },
    "classType.addClassType": function(doc) {
         const user = Meteor.users.findOne(this.userId);
        // console.log("classType.addClassType methods called!!!");
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "classType_CUD" })) {
            // doc.remoteIP = this.connection.clientAddress;
            doc.createdAt = new Date();
            return ClassType.insert(doc);
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "classType.editClassType": function(doc_id, doc) {
        const user = Meteor.users.findOne(this.userId);
        console.log("classType.editClassType methods called!!!",doc_id, doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "classType_CUD" })) {
            return ClassType.update({ _id: doc_id }, { $set: doc });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "classType.removeClassType": function(doc) {
        const user = Meteor.users.findOne(this.userId);
        console.log("classType.removeClassType methods called!!!",doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "classType_CUD" })) {
            ClassTimes.remove({classTypeId: doc._id})
            ClassInterest.remove({classTypeId: doc._id})
            return ClassType.remove({ _id: doc._id });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    }
});