import ClassSubscription from "../classSubscription/fields";
import Purchases from '/imports/api/purchases/fields';
import { getExpiryDateForPackages } from "/imports/util/expiraryDateCalculate";
import School from '/imports/api/school/fields';
import {sendPackagePurchasedEmailToStudent,sendPackagePurchasedEmailToSchool} from '/imports/api/email/index';
import  bodyParser from "body-parser";
if(Meteor.settings.platform=='local' || Meteor.settings.platform=='dev'){
  Picker.middleware(bodyParser.json());
  Picker.middleware(bodyParser.urlencoded({ extended: false }));
  let dataFile = function (params, request, response, next) {
    let type = request.body.type;
    let endDate,userId,userName, userEmail,userData, packageName,schoolId,schoolData,schoolName, schoolEmail;
    try{
      console.log("----------------type--------------",type);
      switch (type) {
        case "invoice.payment_succeeded":
        // updating classSubscription collection
          let subscriptionId = request.body.data.object.subscription;
          let subscriptionResponse = request.body;
          let classSubscriptionData= ClassSubscription.find({subscriptionId}).fetch();
          let payload = {
                        subscriptionResponse,
                        status: "successful"
                       };
          ClassSubscription.update({ subscriptionId }, { $set: payload });
         
  
          // updating purchases collections
          /* if subscription already in collection then update it by one month or else add new entry in purchase collection*/
         let result= Purchases.findOne({subscriptionId});
         if(result){
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
          if(classSubscriptionData){
            endDate=getExpiryDateForPackages(classSubscriptionData[0].startDate, "Months", 1);
            payload={ 
              userId: classSubscriptionData[0].userId,
              packageId: classSubscriptionData[0].packageId,
              subscriptionId: subscriptionId,
              packageName: classSubscriptionData[0].packageName,
              schoolId: classSubscriptionData[0].schoolId,
              startDate: classSubscriptionData[0].startDate,
              endDate: endDate,
              planId: classSubscriptionData[0].subscriptionRequest.items[0].plan,
              packageStatus: 'active',
              emailId:classSubscriptionData[0].emailId,
              packageType:'MP'
            }
           packageName = payload.packageName;
           userId = payload.userId;
           schoolId = payload.schoolId;
            Purchases.insert(payload);
            
          }
        }
        userData = Meteor.users.findOne({_id:userId})
        schoolData = School.findOne({_id:schoolId});
        schoolEmail = schoolData.email;
        schoolName = schoolData.name;
        userName = userData.profile.name;
        userEmail = userData.emails[0].address;
        sendPackagePurchasedEmailToStudent(userName, userEmail, packageName);
        sendPackagePurchasedEmailToSchool(schoolName, schoolEmail, userName, userEmail, packageName);
        break;
      }
    }
    catch(error){
      console.log("error in webhook work",error)
      throw new Meteor.Error(error);
    }
  };
  Picker.route("/stripe-webhooks", dataFile);
}













