import EnrollmentFees from "./fields";
import {get,isEmpty} from "lodash";
import { check } from 'meteor/check';
import MonthlyPricing from '/imports/api/monthlyPricing/fields.js';
import ClassPricing from '/imports/api/classPricing/fields.js';
Meteor.methods({
    "enrollmentFee.addEnrollmentFee": function ({ doc }) {
        check(doc, Object);

        const user = Meteor.users.findOne(this.userId);

        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "enrollmentFee_CUD" })) {

            return EnrollmentFees.insert(doc);
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "enrollmentFee.editEnrollmentFee": function ({ doc_id, doc }) {
        check(doc, Object);
        check(doc_id, String);
        const user = Meteor.users.findOne(this.userId);

        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "enrollmentFee_CUD" })) {

            return EnrollmentFees.update({ _id: doc_id }, { $set: doc });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "enrollmentFee.removeEnrollmentFee": function ({ doc }) {
        check(doc, Object);

        const user = Meteor.users.findOne(this.userId);

        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "enrollmentFee_CUD" })) {
            return EnrollmentFees.remove({ _id: doc._id });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    'enrollmentFee.handleClassTypes': function ({ classTypeId, selectedIds, diselectedIds }) {
        check(classTypeId, String);
        check(selectedIds, [String]);
        check(diselectedIds, [String]);
        EnrollmentFees.update({ classTypeId: null }, { $set: { classTypeId: [] } })
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
    },
    "enrollmentFee.getCover": function(_id){
      let record = EnrollmentFees.findOne({_id});
      return get(record,'selectedClassType',[]);   
    },
    "enrollment.checkIsEnrollmentPurchased":function(_id,userId,packageType){
      let currentPackage={},enrollmentPackage={},enrollmentIds=[];
      if(packageType=='CP'){
            currentPackage = ClassPricing.findOne({_id},{fields:{"classTypeId":1}});
      }else{
            currentPackage = MonthlyPricing.findOne({_id},{fields:{"classTypeId":1}});
      }
      if(currentPackage && !isEmpty(currentPackage.classTypeId)){
          enrollmentPackage = EnrollmentFees.find({classTypeId:{$all:currentPackage.classTypeId, $size:currentPackage.classTypeId.length }}).fetch();
        }
      if(!isEmpty(enrollmentPackage)){
        enrollmentPackage.map((obj)=>{
            enrollmentIds.push(obj._id);
        })
       let res = Meteor.call("purchases.getPurchasedFromPackageIds",enrollmentIds,userId);
       if(!isEmpty(res)){
           return {pass:true,res}
       }else {
           return {pass:false,enrollmentPackage}
       }
       
      }
        return {pass:true}
    }
});
/* 
1.Class covers in current packages.
2.Check is any enrollment package have same covers.
3.if yes check is user purchase any of them.
4.if not do nothing.

*/