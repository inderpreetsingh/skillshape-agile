import Purchases from "./fields";
import School from "../school/fields";
import isEmpty from "lodash/isEmpty";
import { check } from 'meteor/check';
import moment from "moment";
import get from 'lodash/get';
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
  }
});
