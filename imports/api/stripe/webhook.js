import ClassSubscription from "../classSubscription/fields";
import Purchases from '/imports/api/purchases/fields';
import { getExpiryDateForPackages } from "/imports/util/expiraryDateCalculate";
var bodyParser = require("body-parser");
Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({ extended: false }));
var dataFile = function (params, request, response, next) {
  let type = request.body.type;
  let endDate;
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
       console.log("result",result)
       if(result){
        endDate=getExpiryDateForPackages(result.endDate, "Months", 1);
        payload={ 
                endDate: endDate,
                packageStatus: 'active'
        }
        Purchases.update({_id:result._id},{$set:payload})
      }
      else{
        if(classSubscriptionData){
          console.log("classSubscriptionData",classSubscriptionData);
          endDate=getExpiryDateForPackages(classSubscriptionData[0].startDate, "Months", 1);
          console.log('1')
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
            emailId:classSubscriptionData[0].emailId
          }
          console.log('2')
          Purchases.insert(payload)
        }
      }
      
      break;
    }
  }
  catch(error){
    console.log("error in webhook work",error)
    throw new Meteor.Error(error);
  }
};
Picker.route("/stripe-webhooks", dataFile);












/*
1.invoice.payment_succeeded
2.invoice.created
3.customer.subscription.created
4.customer.updated
5.invoice.created
6.invoice.upcoming

------------------- For invoice.payment_succeeded-------------
1.Find subscription id in the response.(Done)
2.update the classSubscription based on  subscription id.
3.Add/Update the purchases collection after getting details 
to be inserted in the purchases from class subscription collection.
4.Increment the counter if updating or set 1 if new record in purchases.
5.Add monthly starting/expiry date in purchases.
*/
