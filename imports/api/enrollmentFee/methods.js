import EnrollmentFees from "./fields";
import isEmpty from "lodash/isEmpty";

Meteor.methods({
    "enrollmentFee.addEnrollmentFee": function({doc}) {
        const user = Meteor.users.findOne(this.userId);
        
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "enrollmentFee_CUD" })) {
            
            return EnrollmentFees.insert(doc);
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "enrollmentFee.editEnrollmentFee": function({doc_id, doc}) {
        const user = Meteor.users.findOne(this.userId);
        
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "enrollmentFee_CUD" })) {
            
            return EnrollmentFees.update({ _id: doc_id }, { $set: doc });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "enrollmentFee.removeEnrollmentFee": function({doc}) {
        const user = Meteor.users.findOne(this.userId);
        
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "enrollmentFee_CUD" })) {
            return EnrollmentFees.remove({ _id: doc._id });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    'enrollmentFee.handleClassTypes':function({ classTypeId, selectedIds, diselectedIds }){
        EnrollmentFees.update({classTypeId:null},{$set:{classTypeId:[]}})        
        try {
            if (!isEmpty(diselectedIds)) {
                let result = EnrollmentFees.update({ _id: { $in: diselectedIds } }, { $pull: { classTypeId } }, { multi: true })
            }
            if (!isEmpty(selectedIds)) {
                let result = EnrollmentFees.update({ _id: { $in: selectedIds } }, { $push: { classTypeId } }, { multi: true })

            }
            return true;

        }
        catch (error) {
            throw new Meteor.Error(error);
        }
    }
});