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
        console.log('classTypeId, selectedIds, diselectedIds',classTypeId, selectedIds, diselectedIds)
        console.log("step 1");
        EnrollmentFees.update({classTypeId:null},{$set:{classTypeId:[]}})        
        console.log("step 2");       
        try {
            console.log("step 3");
            if (!isEmpty(diselectedIds)) {
                console.log("step 4");
                let result = EnrollmentFees.update({ _id: { $in: diselectedIds } }, { $pop: { classTypeId } }, { multi: true })
                console.log("step 5");
            }
            if (!isEmpty(selectedIds)) {
                console.log("step 6");
                let result = EnrollmentFees.update({ _id: { $in: selectedIds } }, { $push: { classTypeId } }, { multi: true })
                 console.log("step 7");

            }
            console.log("step 8");
            return true;
             console.log("step 9");

        }
        catch (error) {
            console.log("step 10");
            throw new Meteor.Error(error);
             console.log("step 11");
        }
    }
});