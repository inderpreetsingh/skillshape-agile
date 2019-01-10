import Transactions from './fields';
import {get,isEmpty,uniq,includes,flatten,compact} from 'lodash';
import { check } from 'meteor/check';

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
          let packageType,packageId,covers=[],methodName,newPurchaseData=[];
          if(!isEmpty(transactionData)){
            transactionData = compact(transactionData);
              transactionData.map((obj,index)=>{
                  packageType = get(obj,'packageType','MP');
                  packageId = get(obj,'packageId','');
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
              })
          }
          return {count,records:transactionData}
        }catch(error){
                console.log("​ error in transactions.getFilteredPurchases", error)
          
        }
       
      }
})