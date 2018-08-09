import MonthlyPricing from "./fields";
import ClassType from "/imports/api/classType/fields";
import isEmpty from "lodash/isEmpty";

function updateHookForClassType({ classTypeId, doc }) {
    if (classTypeId && _.isArray(classTypeId)) {
        const allCost = doc && {
            oneMonCost: doc.oneMonCost && parseInt(doc.oneMonCost),
            threeMonCost: doc.threeMonCost && parseInt(doc.threeMonCost),
            sixMonCost: doc.sixMonCost && parseInt(doc.sixMonCost),
            annualCost: doc.annualCost && parseInt(doc.annualCost),
            lifetimeCost: doc.lifetimeCost && parseInt(doc.lifetimeCost),
        }
        ClassType.update({ _id: { $in: classTypeId } }, { $set: { "filters.monthlyPriceCost": allCost } });
    }
    return;
}

Meteor.methods({
    "monthlyPricing.addMonthlyPricing": function ({ doc }) {
        const user = Meteor.users.findOne(this.userId);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "monthlyPricing_CUD" })) {
            // doc.remoteIP = this.connection.clientAddress;
            updateHookForClassType({ classTypeId: doc.classTypeId, doc });
            return MonthlyPricing.insert(doc);
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "monthlyPricing.editMonthlyPricing": function ({ doc_id, doc }) {
        const user = Meteor.users.findOne(this.userId);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "monthlyPricing_CUD" })) {

            let monthlyPriceData = MonthlyPricing.findOne({ _id: doc_id });
            let diff = _.difference(monthlyPriceData.classTypeId, doc.classTypeId);
            if (diff && diff.length > 0) {
                updateHookForClassType({ classTypeId: diff, doc: null });
            }
            updateHookForClassType({ classTypeId: doc.classTypeId, doc });
            return MonthlyPricing.update({ _id: doc_id }, { $set: doc });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "monthlyPricing.removeMonthlyPricing": function ({ doc }) {
        const user = Meteor.users.findOne(this.userId);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "monthlyPricing_CUD" })) {
            updateHookForClassType({ classTypeId: doc.classTypeId, doc: null });
            return MonthlyPricing.remove({ _id: doc._id });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "monthlyPricing.handleClassTypes": function ({ classTypeId, selectedIds, diselectedIds }) {
        MonthlyPricing.update({classTypeId:null},{$set:{classTypeId:[]}})        
        try {
            if (!isEmpty(diselectedIds)) {
                let result = MonthlyPricing.update({ _id: { $in: diselectedIds } }, { $pop: { classTypeId } }, { multi: true })
            }
            if (!isEmpty(selectedIds)) {
                let result = MonthlyPricing.update({ _id: { $in: selectedIds } }, { $push: { classTypeId } }, { multi: true })

            }
            return true;
        }
        catch (error) {
        }
    }
});