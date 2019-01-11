import Purchases from "./fields";
import School from "../school/fields";
import Classes from "/imports/api/classes/fields.js"
import isEmpty from "lodash/isEmpty";
import { check } from 'meteor/check';
import {get,compact,uniq,concat,flatten} from 'lodash';
import { getExpiryDateForPackages } from "/imports/util/expiraryDateCalculate";
Meteor.methods({
  "purchases.addPurchase": function (payload) {
    try{
      check(payload, Object);
      let data = {...payload};
      let purchaseId = Purchases.insert(data);
      Meteor.call('purchases.addTransactionEntry',purchaseId,'purchase')
      return purchaseId;
    }catch(error){
			console.log("​purchases.addPurchase error", error)
      
    }
   
  },
  "purchases.getAllPurchaseData": function (slug, filters) {
    check(slug, String);
    check(filters, Object);

    let schoolId = School.findOne({ slug: slug });
    let AllPurchaseData = Purchases.find(
      { schoolId: schoolId._id },
      { limit: filters.limit, skip: filters.skip }
    ).fetch();
    return AllPurchaseData;
  },
  "purchases.checkPurchasedPackagesWithClassId": function ({ classTypeId }) {
    check(classTypeId, String);
    if (!this.userId) {
      throw new Meteor.Error("Access Denied");
    } else {
      return Purchases.find({ classId: classTypeId, userId: this.userId }).fetch();
    }
  },
  "purchases.updatePurchases": function ({ payload, recordId }) {
    check(recordId, String);
    check(payload, Object);

    Purchases.update(
      { _id: recordId },
      {
        $set: payload
      }
    );
  },
  "purchases.purchasePageCount": function () {
    return Purchases.find().count();
  },
  "purchases.checkExisitingPackagePurchases": function (userId, packageId) {
    check(userId, String);
    check(packageId, String);

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
  "purchases.isAlreadyPurchased": function ({ userId, planId, packageId, packageType, pymtType }) {
    try {
      check(userId, String);
      let activePurchase, inActivePurchases, noClasses = 0;
      if (packageType == 'MP' && get(pymtType, "autoWithDraw", false)) {
        return Purchases.findOne({ userId, planId, packageStatus: 'active' });
      }
      else {
        activePurchase = Purchases.findOne({ userId, packageId, packageStatus: 'active' });
        inActivePurchases = Purchases.find({ userId, packageId, packageStatus: 'inActive' }).count();
        if (!isEmpty(activePurchase)) {
          if (packageType == 'CP') {
            noClasses = get(Purchases.findOne({ userId, packageId, packageStatus: 'inActive' }), 'noClasses', 0) * inActivePurchases;
            activePurchase.noClasses = get(activePurchase, "noClasses", 0) + noClasses;
          } else if (inActivePurchases) {
            activePurchase.inActivePurchases = inActivePurchases;
          }
        }
        return activePurchase;
      }
    } catch (error) {
      console.log('Error in purchases.isAlreadyPurchased', error);
    }
  },
  "purchases.getPackagesFromIds": function (packageIds, userId,schoolId) {
    if(!isEmpty(packageIds))
    return Purchases.find({ packageId: { $in: packageIds }, packageStatus: 'active', packageType: { $ne: 'EP' }, userId: userId ? userId : this.userId },{$sort:{endDate:-1}}).fetch();
    if(schoolId)
    return Purchases.find({ schoolId, packageStatus: 'active', packageType: { $ne: 'EP' }, userId: userId ? userId : this.userId },{$sort:{endDate:-1}}).fetch();

  },
  "purchase.manageAttendance": function (_id, packageType, inc) {
    try {
      if (_id) {
        let record, monthlyAttendance, startDate;
        if (packageType == 'CP') {
          record = Purchases.findOne({_id});
          let {packageId,userId} = record;
          if(record.noClasses>0){
            Purchases.update({ _id }, { $inc: { noClasses: inc } });
            return record.noClasses;
          }else{
            Purchases.update({_id},{$set:{packageStatus:'expired'}});
            Meteor.call("purchases.addTransactionEntry",_id,'expired');
            record = Purchases.findOne({packageId,userId,packageStatus:'inActive'});
            if(record){
               let days = (record.startDate-record.endDate)/(1000 * 60 * 60 * 24);
               startDate = new Date();
               let endDate = new Date(new Date().getTime()+(days*24*60*60*1000));
            Purchases.update({ _id:record._id }, { $inc: { noClasses: inc },$set:{packageStatus:'active',startDate,endDate} });
            return record.noClasses;
          }
          return 0;
          }
        }
        else if (packageType == 'MP') {
          record = Purchases.findOne({ _id });
          if (!isEmpty(record)) {
            monthlyAttendance = get(record, 'monthlyAttendance', {});
            if(monthlyAttendance.max == null){
              return 1;
            }
            if (monthlyAttendance.noClasses > 0) {
              monthlyAttendance.noClasses = monthlyAttendance.noClasses + inc;
            } else {
              startDate = monthlyAttendance.startDate;
              startDate = getExpiryDateForPackages(startDate, monthlyAttendance.duPeriod, monthlyAttendance.max);
              if (startDate < record.endDate) {
                monthlyAttendance.noClasses = monthlyAttendance.max + inc;
              }
            }
            Purchases.update({ _id }, { $set: { monthlyAttendance } });
            return monthlyAttendance.noClasses;
          }
        }
      }
    } catch (error) {
      console.log("​error in purchase.manageAttendance", error)

    }

  },
  "purchases.getPackagesFromPurchaseIds": function (purchaseIds) {
    return Purchases.find({ _id: { $in: purchaseIds }, packageStatus: 'active', packageType: { $ne: 'EP' } }).fetch();
  },
  "purchases.getPurchasedFromPackageIds": function (packageIds, userId) {
    return Purchases.find({ packageId: { $in: packageIds }, packageStatus: 'active', userId }).fetch();
  },
  "purchases.getFilteredPurchases":function (filter,limitAndSkip){
    try{
      let count = Purchases.find(filter,limitAndSkip).count();
      let purchaseData = Purchases.find(filter,limitAndSkip).fetch();
      let packageType,packageId,covers=[],methodName,newPurchaseData=[];
      
      //Get Attendance Data too
      let attendanceData = Meteor.call('attendance.findById',{userId:filter.userId}) 
      if(!isEmpty(attendanceData)){
      attendanceData.map((obj,index)=>{
        let {students} =  Classes.findOne({_id:obj.classId}) || {};
        if(!isEmpty(students)){
          students.map((student)=>{
            if(student.userId == filter.userId){
              if(student.purchaseId){
                newPurchaseData.push({...obj,...Purchases.findOne({_id:student.purchaseId})})
              }
            }
          })
        }
      })
      
      purchaseData = flatten(concat(purchaseData,newPurchaseData));
      }
      if(!isEmpty(purchaseData)){
        purchaseData = compact(purchaseData);
          purchaseData.map((obj,index)=>{
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
            obj.schoolName = School.findOne({_id:obj.schoolId},{fields:{'name':1}});
            res =  Meteor.call(methodName,packageId)
                  if(res){
                      res.map((obj1,index1)=>{
                          covers.push(obj1.name);
                      })
                      obj.covers = uniq(covers);
                  }
          })
      }
      return {count,records:purchaseData}
    }catch(error){
			console.log("​ error in purchases.getFilteredPurchases", error)
      
    }
   
  },
  "purchases.getDataForTransactionEntry":function(_id){
    let record = Purchases.findOne({_id});
    return {packageType,packageName,amount,currency,packageStatus,paymentMethod} = record;
  },
  "purchases.addTransactionEntry":function(_id,transactionType){
    let data = Purchases.findOne({_id});   
    let payload = {...data};
    payload.action = 'add';
    payload.transactionDate = new Date();
    payload.schoolName = School.findOne({_id:payload.schoolId},{fields:{'name':1}}).name;
    payload.transactionType = transactionType;
    payload.purchaseId = _id;
    delete payload._id;
    Meteor.call('transactions.handleEntry',payload);
  }
});
/* 
1. Find the no of classes in monthly package.
2. If not zero then update.
3. If zero then check start date+duperiord == date  is less then end right.
3.1 if less then set start date == startDate+duPeriord and set noClasses = max+inc;.
3.2 If greater then do nothing.
*/
