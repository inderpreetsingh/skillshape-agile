import ClassSubscription from "../classSubscription/fields";
import Purchases from '/imports/api/purchases/fields';
var bodyParser = require("body-parser");
Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({ extended: false }));
var dataFile = function (params, request, response, next) {
  let type = request.body.type;
  console.log("type",type)
  try{

    switch (type) {
      case "invoice.payment_succeeded":
      // updating classSubscription collection
        console.log("in case 1")
        let subscriptionId = request.body.data.object.subscription;
        let subscriptionResponse = request.body;
        let classSubscriptionData= ClassSubscription.find({subscriptionId:subscriptionId}).fetch();
        console.log('classSubscriptionData',classSubscriptionData)
        let monthCounter= classSubscriptionData.monthCounter;
        let payload = {
                      subscriptionResponse,
                      monthCounter: monthCounter,
                      status: "successful"
                     };
        ClassSubscription.update({ subscriptionId }, { $set: payload });
        // updating purchases collections
       let result= Purchases.findOne({subscriptionId});
       console.log('result of purchases  find by sub id',result)
       if(result){
       console.log('in if ')
         
        payload={ 
                endDate: classSubscriptionData.endDate,
                packageStatus: 'active'
        }
        
      }
      else{
       console.log('in else',classSubscriptionData)
        
        payload={ 
          userId: classSubscriptionData[0].userId,
          packageId: classSubscriptionData[0].packageId,
          subscriptionId: subscriptionId,
          packageName: classSubscriptionData[0].packageName,
          schoolId: classSubscriptionData[0].schoolId,
          startDate: classSubscriptionData[0].startDate,
          endDate: classSubscriptionData[0].endDate,
          planId: classSubscriptionData[0].subscriptionRequest.items[0].plan,
          packageStatus: 'active'
        }
        Purchases.insert(payload)
      }
      
      break;
    }
  }
  catch(error){
    console.log('---error----',error)
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
