import { check } from 'meteor/check';
import {get,isEmpty} from "lodash";
import ClassPricing from "./fields";
import ClassType from "/imports/api/classType/fields";
import PriceInfoRequest from "/imports/api/priceInfoRequest/fields";
import PricingRequest from "/imports/api/pricingRequest/fields"
import School from "/imports/api/school/fields";
import { sendEmailToStudentForPriceInfoUpdate } from "/imports/api/email";



Meteor.methods({
    "classPricing.addClassPricing": function({doc}) {
        const user = Meteor.users.findOne(this.userId);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "classPricing_CUD" })) {

            if(doc.classTypeId && _.isArray(doc.classTypeId)) {

                ClassType.update({ _id: { $in: doc.classTypeId } }, { $set: {"filters.classPriceCost": doc.cost} }, {multi: true});
            }

            return ClassPricing.insert(doc);

        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "classPricing.editclassPricing": function({doc_id, doc}) {
        
        const user = Meteor.users.findOne(this.userId);

        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "classPricing_CUD" })) {

            let classPriceData = ClassPricing.findOne({_id:doc_id});
            let diff = _.difference(classPriceData.classTypeId, doc.classTypeId);

            if((classPriceData.cost !== doc.cost) || (diff && diff.length > 0)) {

                if(diff && diff.length > 0) {
                    ClassType.update({ _id: { $in: diff } }, { $set: {"filters.classPriceCost": null} }, {multi: true});
                }

                if(doc.classTypeId && _.isArray(doc.classTypeId) && doc.classTypeId.length > 0) {
                    ClassType.update({ _id: { $in: doc.classTypeId } }, { $set: {"filters.classPriceCost": doc.cost} }, {multi: true});
                }

            }

            return ClassPricing.update({ _id: doc_id }, { $set: doc });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "classPricing.removeClassPricing": function({doc}) {
    check(doc,Object);

        const user = Meteor.users.findOne(this.userId);

        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "classPricing_CUD" })) {

            if(doc.classTypeId && _.isArray(doc.classTypeId)) {
                ClassType.update({ _id: { $in: doc.classTypeId } }, { $set: {"filters.classPriceCost": null} }, {multi: true});
            }

            return ClassPricing.remove({ _id: doc._id });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "classPricing.notifyStudentForPricingUpdate": function({schoolId}) {
    check(schoolId,String);

            if(this.userId) {
                const PricingRequestData = PricingRequest.find({schoolId,notification: true}).fetch();
                if(!isEmpty(PricingRequestData)) {

                    for(let obj of PricingRequestData) {
                        const userData = Meteor.users.findOne({_id: obj.userId});
                        const schoolData = School.findOne({_id: obj.schoolId})
                        if(userData && schoolData) {
                            PricingRequest.update({ _id: obj._id }, { $set: {notification: false} })
                            sendEmailToStudentForPriceInfoUpdate(userData, schoolData)
                        }
                    }

                    return {emailSent:true};
                }
                return {emailSent:false};
            } else {
                throw new Meteor.Error("Permission denied!!");
            }
        
    },
    'classPricing.handleClassTypes':function({ classTypeId, selectedIds, diselectedIds }){
    check(classTypeId,String);
    check(selectedIds,[String]);
    check(diselectedIds,[String]);
        ClassPricing.update({classTypeId:null},{$set:{classTypeId:[]}}) 
    try {
        if (!isEmpty(diselectedIds)) {
            let result = ClassPricing.update({ _id: { $in: diselectedIds } }, { $pull: { classTypeId } }, { multi: true })
        }
        if (!isEmpty(selectedIds)) {
            let result = ClassPricing.update({ _id: { $in: selectedIds } }, { $push: { classTypeId } }, { multi: true })
        }
        return true;
    }
    catch (error) {
        throw new Meteor.Error(error);
    }
},
  "classPricing.getCover": function(_id){
    let record = ClassPricing.findOne({_id});
    return get(record,'selectedClassType',[]);   
  }
});