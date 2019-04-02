import ClassSubscription from "../classSubscription/fields";
import Purchases from '/imports/api/purchases/fields';
import { getExpiryDateForPackages } from "/imports/util/expiraryDateCalculate";
import School from '/imports/api/school/fields';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import {sendPackagePurchasedEmailToStudent,sendPackagePurchasedEmailToSchool} from '/imports/api/email/index';
import  bodyParser from "body-parser";
  Picker.middleware(bodyParser.json());
  Picker.middleware(bodyParser.urlencoded({ extended: false }));
  let dataFile = function (params, request, response, next) {
    let type = request.body.type;
    let endDate,userId,userName, userEmail,userData, packageName,schoolId,schoolData,schoolName, schoolEmail,startDate;
    try{
      console.log("WebHook type received:---->",type);
      switch (type) {
        case "invoice.payment_succeeded":
        // updating classSubscription collection
          let subscriptionId = request.body.data.object.subscription;
          let subscriptionResponse = request.body;
          let classSubscriptionData= ClassSubscription.findOne({subscriptionId});
          let payload = {
                        subscriptionResponse,
                        status: "successful"
                       };
          ClassSubscription.update({ subscriptionId }, { $set: payload });
         
  
          // updating purchases collections
          /* if subscription already in collection then update it by one month or else add new entry in purchase collection*/
         let result= Purchases.findOne({subscriptionId});
         if(!isEmpty(result)){
          endDate=getExpiryDateForPackages(result.endDate, "Months", 1);
          payload={ 
                  endDate: endDate,
                  packageStatus: 'active'
          }
          packageName = result.packageName;
          userId = result.userId;
          schoolId = result.schoolId;
          Purchases.update({_id:result._id},{$set:payload})
          
        }
        else{
          if(!isEmpty(classSubscriptionData)){
            startDate = get(classSubscriptionData,'startDate',new Date())
            endDate=getExpiryDateForPackages(startDate, "Months", 1);
            payload={ 
              userId: classSubscriptionData.userId,
              packageId: classSubscriptionData.packageId,
              subscriptionId: subscriptionId,
              packageName: classSubscriptionData.packageName,
              schoolId: classSubscriptionData.schoolId,
              startDate,
              endDate: endDate,
              planId: classSubscriptionData.subscriptionRequest.items[0].plan,
              packageStatus: 'active',
              emailId:classSubscriptionData.emailId,
              packageType:'MP',
              autoWithdraw:true,
              fee:classSubscriptionData.fee,
              currency:classSubscriptionData.currency,
              contractLength:classSubscriptionData.contractLength,
              monthlyAttendance:classSubscriptionData.monthlyAttendance,
              paymentMethod:'stripe',
              amount:classSubscriptionData.amount,
              userName:classSubscriptionData.userName
            }
           packageName = payload.packageName;
           userId = payload.userId;
           schoolId = payload.schoolId;
            Purchases.insert(payload);
            
          }
        }
        userData = Meteor.users.findOne({_id:userId})
        schoolData = School.findOne({_id:schoolId});
        if(!isEmpty(userData) && !isEmpty(schoolData)){
          schoolEmail = schoolData.email;
          schoolName = schoolData.name;
          userName = userData.profile.name;
          userEmail = userData.emails[0].address;
          sendPackagePurchasedEmailToStudent(userName, userEmail, packageName);
          sendPackagePurchasedEmailToSchool(schoolName, schoolEmail, userName, userEmail, packageName);
        }
        response.end("Ok Done");
        break;
      }
      response.end("Case not used");
    }
    catch(error){
      console.log("error in webHook work",error)
      response.end("Not Ok ");
      throw new Meteor.Error(error);
    }
  };
  Picker.route("/stripe-webhooks", dataFile);


































 













