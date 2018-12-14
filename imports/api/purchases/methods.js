import Purchases from "./fields";
import School from "../school/fields";
import isEmpty from "lodash/isEmpty";
import { check } from 'meteor/check';
import moment from "moment";
import get from 'lodash/get';
import { getExpiryDateForPackages } from "/imports/util/expiraryDateCalculate";
Meteor.methods({
  "purchases.addPurchase": function(payload) {
    check(payload,Object);
    return Purchases.insert(payload);
  },
  "purchases.getAllPurchaseData": function(slug, filters) {
    check(slug,String);
    check(filters,Object);

    let schoolId = School.findOne({ slug: slug });
    let AllPurchaseData = Purchases.find(
      { schoolId: schoolId._id },
      { limit: filters.limit, skip: filters.skip }
    ).fetch();
    return AllPurchaseData;
  },
  "purchases.updatePurchases": function({payload, recordId}) {
    check(recordId,String);
    check(payload,Object);
    Purchases.update(
      { _id: recordId },
      {
        $set: payload
      }
    );
  },
  "purchases.purchasePageCount": function() {
    return Purchases.find().count();
  },
  "purchases.checkExisitingPackagePurchases": function(userId, packageId) {
    check(userId,String);
    check(packageId,String);

    let result = Purchases.findOne({
      userId: userId,
      packageId: packageId
    });
    let packageStatus = "active";
    if (result) {
        if (result.packageStatus == "active") {
          packageStatus = "inActive";
        }
    } 
    return packageStatus;
  },
  "purchases.isAlreadyPurchased": function({userId, planId,packageId,packageType,pymtType}) {
    try{
      check(userId,String);
      let activePurchase,inActivePurchases,noClasses=0;
      if(packageType == 'MP' && get(pymtType,"autoWithDraw",false) ){
       return Purchases.findOne({userId,planId,packageStatus:'active'});
      }
      else{
       activePurchase = Purchases.findOne({userId,packageId,packageStatus:'active'});
       inActivePurchases = Purchases.find({userId,packageId,packageStatus:'inActive'}).count();
       if(!isEmpty(activePurchase)){
         if(packageType == 'CP' ){
          noClasses = get(Purchases.findOne({userId,packageId,packageStatus:'inActive'}),'noClasses',0) * inActivePurchases;
           activePurchase.noClasses = get(activePurchase,"noClasses",0) + noClasses;
         }else if(inActivePurchases){
            activePurchase.inActivePurchases = inActivePurchases;
         }
       }
       return activePurchase;
      }
    }catch(error){
    console.log('Error in purchases.isAlreadyPurchased', error);
    }
  },
  "purchases.getPackagesFromIds":function(packageIds){
    return Purchases.find({packageId:{$in:packageIds},packageStatus:'active',packageType:{$ne:'EP'}}).fetch();
  },
  "purchase.manageAttendance":function(_id,packageType,inc){
  try{
    if(_id){
      let record,monthlyAttendance,startDate;
      if(packageType == 'CP'){
        Purchases.update({_id},{$inc:{noClasses:inc}});
      }
      else if(packageType == 'MP'){
        record = Purchases.findOne({_id});
        if(!isEmpty(record)){
          monthlyAttendance = get(record,'monthlyAttendance',{});
          if(monthlyAttendance.noClasses>0){
            monthlyAttendance.noClasses= monthlyAttendance.noClasses+inc;
           }else{
            startDate = monthlyAttendance.startDate;
            startDate = getExpiryDateForPackages(startDate, monthlyAttendance.duPeriod,monthlyAttendance.max);
            if(startDate<record.endDate){
              monthlyAttendance.noClasses= monthlyAttendance.max+inc;
            }
          }
          Purchases.update({_id},{$set:{monthlyAttendance}});
          return monthlyAttendance.noClasses;
        }
      }
    }
  }catch(error){
		console.log("​error in purchase.manageAttendance", error)
    
  }
  
  },
  "purchases.getPackagesFromPurchaseIds":function(purchaseIds){
    return Purchases.find({_id:{$in:purchaseIds},packageStatus:'active',packageType:{$ne:'EP'}}).fetch();
  },
  "purchases.getPurchasedFromPackageIds":function(packageIds,userId){
    return Purchases.find({packageId:{$in:packageIds},packageStatus:'active',userId}).fetch();
  }
});
/* 
1. Find the no of classes in monthly package.
2. If not zero then update.
3. If zero then check start date+duperiord == date  is less then end right.
3.1 if less then set start date == startDate+duPeriord and set noClasses = max+inc;.
3.2 If greater then do nothing.
*/
