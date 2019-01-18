import Contracts from './fields';
import { check } from 'meteor/check';
import {sendContractCancelledEmail} from '/imports/api/email';
import School from "/imports/api/school/fields.js";
Meteor.methods({
    "Contracts.handleRecords":function(doc={}){
        check(doc,Object);
        let {action,_id,purchaseId,schoolId,userName,packageName} = doc;
        doc.createdAt = new Date();
        if(action == 'add'){
            let schoolData = School.findOne({_id:schoolId});
            let {name,email} = schoolData;
            sendContractCancelledEmail({ userName, packageName, to:email, schoolName:name })
            return Contracts.insert(doc);
        }else if(action == 'update'){
            if(doc.status == 'allowed'){
                Meteor.call("purchases.addTransactionEntry",purchaseId,'contractCancelled')
            }
            return Contracts.insert({_id},doc);
        }
        else if(action == 'find'){
            let {userId,purchaseId} = doc ;
            return Contracts.findOne({userId,purchaseId})
        }
    }
})