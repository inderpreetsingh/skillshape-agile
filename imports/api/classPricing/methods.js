import ClassPricing from "./fields";
import ClassType from "/imports/api/classType/fields";

Meteor.methods({
    "classPricing.addClassPricing": function({doc}) {
        const user = Meteor.users.findOne(this.userId);
        
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "classPricing_CUD" })) {
           
            console.log("addClassPricing doc-->>",doc);
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
            
            // console.log("editclassPricing doc-->>",doc);
            let classPriceData = ClassPricing.findOne({_id:doc_id});
            let diff = _.difference(classPriceData.classTypeId, doc.classTypeId);
            
            // console.log("diff-->>",diff);
            if((classPriceData.cost !== doc.cost) || (diff && diff.length > 0)) {

                // console.log("doc.classTypeId-->>",doc.classTypeId);
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
    }
});