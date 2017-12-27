import EnrollmentFees from "./fields";

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
    }
});