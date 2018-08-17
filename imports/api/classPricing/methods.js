import isEmpty from "lodash/isEmpty";

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
        console.log('classTypeId, selectedIds, diselectedIds',classTypeId, selectedIds, diselectedIds)
        console.log("step 1");
        ClassPricing.update({classTypeId:null},{$set:{classTypeId:[]}}) 
        console.log("step 2");       
    try {
        console.log("step 3");
        if (!isEmpty(diselectedIds)) {
            console.log("step 4");
            let result = ClassPricing.update({ _id: { $in: diselectedIds } }, { $pop: { classTypeId } }, { multi: true })
            console.log("step 5");
        }
        if (!isEmpty(selectedIds)) {
            console.log("step 6");
            let result = ClassPricing.update({ _id: { $in: selectedIds } }, { $push: { classTypeId } }, { multi: true })
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