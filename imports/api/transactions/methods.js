import Transactions from './fields';
import {get,isEmpty,uniq,includes,flatten,compact} from 'lodash';
import { check } from 'meteor/check';
import Purchases from '/imports/api/purchases/fields.js';
Meteor.methods({
    'transactions.handleEntry':function(data){
        check(data,Object);
        if(data.action == 'add'){
            Transactions.insert(data);
        }
        else{
            Transactions.remove({_id:data._id});
        }
    },
    "transactions.getFilteredPurchases":function (filter,limitAndSkip){
        try{
          let count = Transactions.find(filter,limitAndSkip).count();
          let transactionData = Transactions.find(filter,limitAndSkip).fetch();
          let packageType,covers=[],methodName,newPurchaseData=[],data,finalData=[];
          if(!isEmpty(transactionData)){
            transactionData = compact(transactionData);
              transactionData.map((obj,index)=>{
                  let wholePurchaseData = Purchases.findOne({_id:obj.purchaseId});
                  let {packageId} = wholePurchaseData;
                  packageType = get(obj,'packageType','MP');
                  if(packageType == "MP"){
                      methodName = 'monthlyPricing.getCover';
                            }
                  else if(packageType == "CP"){
                      methodName = 'classPricing.getCover';
                  }else{
                      methodName = "enrollmentFee.getCover";
                  }
                res =  Meteor.call(methodName,packageId)
                      if(res){
                          res.map((obj1,index1)=>{
                              covers.push(obj1.name);
                          })
                          obj.covers = uniq(covers);
                      }
                data = {...obj,...wholePurchaseData};
                finalData.push(data);
              })
          }
          return {count,records:finalData}
        }catch(error){
                console.log("​ error in transactions.getFilteredPurchases", error)
          
        }
       
      }
})