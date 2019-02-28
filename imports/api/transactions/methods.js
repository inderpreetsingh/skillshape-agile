import Transactions from './fields';
import {get,isEmpty,uniq,includes,flatten,compact} from 'lodash';
import { check } from 'meteor/check';
import Purchases from '/imports/api/purchases/fields.js';
import { isArray } from 'util';
import SchoolMemberDetails from "/imports/api/schoolMemberDetails/fields.js";
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
            let count, transactionData,graphData;
            let { schoolId } = filter;
            delete filter.schoolId;
            if(schoolId && isArray(schoolId) && !isEmpty(schoolId)){
                count = Transactions.find({ schoolId: { $in: schoolId }, ...filter }).count();
                transactionData = Transactions.find({ schoolId: { $in: schoolId }, ...filter }, limitAndSkip).fetch();
                graphData = Meteor.call("transactions.getDataForGraph",{schoolId})
            }
            else
            {
                count = Transactions.find(filter ).count();
                transactionData = Transactions.find(filter , limitAndSkip).fetch();
            }
            let packageType, covers = [], methodName, newPurchaseData = [], data, finalData = [];
            if (!isEmpty(transactionData)) {
                transactionData = compact(transactionData);
                transactionData.map((obj, index) => {
                    let wholePurchaseData = Purchases.findOne({ _id: obj.purchaseId });
                    let { packageId } = wholePurchaseData;
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
          return {count,records:finalData,graphData}
        }catch(error){
                console.log("​ error in transactions.getFilteredPurchases", error)
          
        }
       
      },
      "transactions.getDataForGraph":function(filter){
          try{
           let {schoolId} = filter;
           let Purchases = Transactions.aggregate(
                [ { $match : { schoolId :{$in: schoolId}} },
                    { $match : { transactionType:'purchase' }},
                    {
                        $group : {
                           _id : { month: { $month: "$transactionDate" },year: { $year: "$transactionDate" } },
                           count: { $sum: 1 }
                        }
                      }
                 ]
                 , {cursor:{}}
            );
           let Attendance = Transactions.aggregate(
            [ { $match : { schoolId :{$in: schoolId}} },
                { $match : { transactionType:'attendance' }},
                {
                    $group : {
                       _id : { month: { $month: "$transactionDate" },year: { $year: "$transactionDate" } },
                       count: { $sum: 1 }
                    }
                  }
             ]
             , {cursor:{}}
        );
        let Expired = Transactions.aggregate(
            [ { $match : { schoolId :{$in: schoolId}} },
                { $match : { transactionType:'expired' }},
                {
                    $group : {
                       _id : { month: { $month: "$transactionDate" },year: { $year: "$transactionDate" } },
                       count: { $sum: 1 }
                    }
                  }
             ]
             , {cursor:{}}
        );
        let Cancelled = Transactions.aggregate(
            [ { $match : { schoolId :{$in: schoolId}} },
                { $match : { transactionType:'contractCancelled' }},
                {
                    $group : {
                       _id : { month: { $month: "$transactionDate" },year: { $year: "$transactionDate" } },
                       count: { $sum: 1 }
                    }
                  }
             ]
             , {cursor:{}}
        );
        let Members = SchoolMemberDetails.aggregate(
            [ { $match : { schoolId :{$in: schoolId}} },
                {
                    $group : {
                       _id : { month: { $month: "$addedOn" },year: { $year: "$addedOn" } },
                       count: { $sum: 1 }
                    }
                  }
             ]
             , {cursor:{}}
        )
        return {Purchases,Attendance,Expired,Cancelled,Members}
          }catch(error){
              console.log('error in transactions.getDataForGraph', error)
              throw new Meteor.Error(error)
          }
      }
})