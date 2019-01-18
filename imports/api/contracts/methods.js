import Contracts from './fields';
import { check } from 'meteor/check';
import {sendContractCancelledEmail} from '/imports/api/email';
import School from "/imports/api/school/fields.js";
import Purchases from "/imports/api/purchases/fields.js";
let stripe = require("stripe")(Meteor.settings.stripe.PRIVATE_KEY);

Meteor.methods({
    "Contracts.handleRecords":function(doc={}){
        check(doc,Object);
        let {action,_id,purchaseId,schoolId,userName,packageName,autoWithdraw,payAsYouGo} = doc;
        doc.createdAt = new Date();
        if(action == 'add'){
            let schoolData = School.findOne({_id:schoolId});
            let {name,email} = schoolData;
            sendContractCancelledEmail({ userName, packageName, to:email, schoolName:name })
            return Contracts.insert(doc);
        }else if(action == 'update'){
            if(doc.status == 'allowed'){
              Meteor.call("purchases.addTransactionEntry",purchaseId,'contractCancelled')
              if(!payAsYouGo){
                cancelSubscription(purchaseId);
              }
            }
            return Contracts.update({_id},{$set:doc});
        }
        else if(action == 'find'){
            let {userId,purchaseId} = doc ;
            return Contracts.findOne({userId,purchaseId})
        }
    }
})
 const cancelSubscription = (_id) => {
     let {subscriptionId} = Purchases.findOne({_id});
     if(subscriptionId){
         stripe.subscriptions.del(
             subscriptionId,
             Meteor.bindEnvironment(function (err, confirmation) {
               if (confirmation) {
                 Purchases.update({ subscriptionId }, { $set: { subscriptionCancelResponse: confirmation } });
               }
             })
           );
     }
 }