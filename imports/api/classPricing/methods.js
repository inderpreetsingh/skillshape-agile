import ClassPricing from "./fields";

Meteor.methods({
    "classPricing.addClassPricing": function(doc) {
        const user = Meteor.users.findOne(this.userId);
        // console.log("classPricing.addclassPricing methods called!!!");
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "classPricing_CUD" })) {
            // doc.remoteIP = this.connection.clientAddress;
            console.log(doc);
            return ClassPricing.insert(doc);
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "classPricing.removeClassPricing": function(doc) {
        const user = Meteor.users.findOne(this.userId);
        // console.log("classPricing.removeclassPricing methods called!!!",doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "classPricing_CUD" })) {
            return ClassPricing.remove({ _id: doc._id });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "classPricing.editclassPricing": function(doc_id, doc) {
        const user = Meteor.users.findOne(this.userId);
        // console.log("classPricing.editclassPricing methods called!!!",doc_id, doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "classPricing_CUD" })) {
            console.log(doc);
            return ClassPricing.update({ _id: doc_id }, { $set: doc });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    }
});