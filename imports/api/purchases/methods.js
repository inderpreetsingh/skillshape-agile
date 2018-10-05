import Purchases from "./fields";
import School from "../school/fields";
import isEmpty from "lodash/isEmpty";
import { check } from 'meteor/check';

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
          packageStatus = "inactive";
        }
    } 
    return packageStatus;
  },
  "purchases.isAlreadyPurchased": function({userId, planId,packageId,packageType,pymtType}) {
    check(userId,String);
    if(packageType == 'MP' && pymtType.autoWithDraw ){
      return Purchases.findOne({userId,planId,packageStatus:'active'});
    }
    else{
      return Purchases.findOne({userId,packageId,packageStatus:'active'});
    }
  }
});
