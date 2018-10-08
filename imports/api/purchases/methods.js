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
      let activePurchase,inActivePurchases,noOfClasses=0;
      if(packageType == 'MP' && pymtType.autoWithDraw ){
       return Purchases.findOne({userId,planId,packageStatus:'active'});
      }
      else{
       activePurchase = Purchases.findOne({userId,packageId,packageStatus:'active'});
       if(packageType == 'CP'){
        inActivePurchases = Purchases.find({userId,packageId,packageStatus:'inActive'}).count();
        noOfClasses = get(Purchases.findOne({userId,packageId,packageStatus:'inActive'}),'noOfClasses',0) * inActivePurchases;
         activePurchase.noOfClasses = activePurchase.noOfClasses + noOfClasses;
       }else{
         console.log('TCL: inActivePurchases', inActivePurchases);
         console.log('TCL: activePurchase.endDate', activePurchase.endDate);
         activePurchase.endDate = moment(activePurchase.endDate).add(inActivePurchases, 'M').format("Do MMMM YYYY");;
       }
       console.log('<><><><><><><><><><><', activePurchase);
       return activePurchase;
      }
    }catch(error){
    console.log('TCL: }catch -> error', error);
    }
  }
});
