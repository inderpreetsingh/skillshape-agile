import EnrollmentFees from "./fields";
import {get,isEmpty,difference,concat,flatten} from "lodash";
import { check } from 'meteor/check';
import MonthlyPricing from '/imports/api/monthlyPricing/fields.js';
import ClassPricing from '/imports/api/classPricing/fields.js';
import Purchases from '/imports/api/purchases/fields.js';

Meteor.methods({
    "enrollmentFee.addEnrollmentFee": function ({ doc }) {
        check(doc, Object);
        const user = Meteor.users.findOne(this.userId);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "enrollmentFee_CUD" })) {
            let id = EnrollmentFees.insert(doc);
            let classTypeIds = get(doc,"classTypeId",[])
            if(!isEmpty(classTypeIds)){
                Meteor.call("classType.handleEnrollmentIds",id,classTypeIds,"add");
            }
            return true;
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "enrollmentFee.editEnrollmentFee": function ({ doc_id, doc }) {
        check(doc, Object);
        check(doc_id, String);
        const user = Meteor.users.findOne(this.userId);
        let record = EnrollmentFees.findOne({_id:doc_id});
        let oldClassTypeIds = get(record,'classTypeId',[]);
        let classTypeIds = get(doc,"classTypeId",[]);
        let removeClassTypeIds = difference(oldClassTypeIds,classTypeIds);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "enrollmentFee_CUD" })) {
            if(!isEmpty(removeClassTypeIds)){
                Meteor.call("classType.handleEnrollmentIds",doc_id,removeClassTypeIds,"remove");
            }
            if(!isEmpty(classTypeIds)){
                Meteor.call("classType.handleEnrollmentIds",doc_id,classTypeIds,"add");
            }
            return EnrollmentFees.update({ _id: doc_id }, { $set: doc });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "enrollmentFee.removeEnrollmentFee": function ({ doc }) {
        check(doc, Object);
        let classTypeId = get(doc,'classTypeId',[]);
        let id = get(doc,'_id','');
        if(!isEmpty(classTypeId))
        Meteor.call("classType.handleEnrollmentIds",id,classTypeId,'remove');
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
      let currentPackage={},enrollmentPackage={},enrollmentIds=[],classTypeIds=[],classTypeData,classTypeDataWithPurchaseInfo;
      if(packageType=='CP'){
            currentPackage = ClassPricing.findOne({_id},{fields:{"classTypeId":1}});
      }else{
            currentPackage = MonthlyPricing.findOne({_id},{fields:{"classTypeId":1}});
      }
      classTypeIds = get(currentPackage,"classTypeId",[]);
      if(!isEmpty(classTypeIds)){
         classTypeData = Meteor.call("classType.getClassTypesFromIds",classTypeIds);
            if(!isEmpty(classTypeData)){
                classTypeDataWithPurchaseInfo = classTypeData.map((obj)=>{
                    let enrollmentIds = get(obj,"enrollmentIds",[]);
                    if(!isEmpty(enrollmentIds)){
                        obj.enrollmentPackages = EnrollmentFees.find({_id:{$in:enrollmentIds}}).fetch();
                        obj.purchasedEP = Meteor.call("purchases.getPurchasedFromPackageIds",enrollmentIds,userId);
                    }else{
                        obj.noEP=true;
                    }
                    return obj;    
                })
            }
        }
        return classTypeDataWithPurchaseInfo;
    },
    "enrollment.checkPackagesFromClassTypeAndSchoolId":function({classTypeId,schoolId}){
        if(classTypeId){
            let packages=[],classPackages,monthlyPackages,packageIds,purchasedPackages;
            classPackages = ClassPricing.find({classTypeId:classTypeId}).fetch();
            monthlyPackages = MonthlyPricing.find({classTypeId:classTypeId}).fetch();
            packages = flatten(concat(classPackages,monthlyPackages));
            packageIds=packages.map((obj)=>obj._id); 
            purchasedPackages = Meteor.call('purchases.getPackagesFromIds',packageIds,null,null);
			return purchasedPackages;
        }else if(schoolId){
          return purchasedPackages = Meteor.call('purchases.getPackagesFromIds',[],null,schoolId);

        }
    }
});
