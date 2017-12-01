import MonthlyPricing from "./fields";

Meteor.methods({
    "monthlyPricing.addMonthlyPricing": function(doc) {
        const user = Meteor.users.findOne(this.userId);
        // console.log("MonthlyPricing.addMonthlyPricing methods called!!!");
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "monthlyPricing_CUD" })) {
            // doc.remoteIP = this.connection.clientAddress;
            console.log(doc);
            return MonthlyPricing.insert(doc);
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "monthlyPricing.removeMonthlyPricing": function(doc) {
        const user = Meteor.users.findOne(this.userId);
        // console.log("MonthlyPricing.removeMonthlyPricing methods called!!!",doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "monthlyPricing_CUD" })) {
            return MonthlyPricing.remove({ _id: doc._id });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "monthlyPricing.editMonthlyPricing": function(doc_id, doc) {
        const user = Meteor.users.findOne(this.userId);
        // console.log("MonthlyPricing.editMonthlyPricing methods called!!!",doc_id, doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "monthlyPricing_CUD" })) {
            console.log(doc);
            return MonthlyPricing.update({ _id: doc_id }, { $set: doc });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    }
});