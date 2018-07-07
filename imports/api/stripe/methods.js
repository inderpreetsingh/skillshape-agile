import UserStripeData from "./fields";
import School from "../school/fields";
//import MonthlyPricing
//chargeCard for  creating charge and purchasing package
//getStripeToken for getting stripe account id
var stripe = require("stripe")(Meteor.settings.stripe.PRIVATE_KEY);
Meteor.methods({
  "stripe.chargeCard": async function(
    stripeToken,
    amount,
    desc,
    packageId,
    packageType,
    schoolId
  ) {
    let recordId;
    try {
      let schoolData = School.findOne({ _id: schoolId });
      let superAdminId = schoolData.superAdmin;
      let stripeAccountId = UserStripeData.findOne({ userId: superAdminId });
      stripeAccountId = stripeAccountId.stripe_user_id;

      const token = stripeToken;
      const skillshapeAmount = Math.round(amount * (2.9 / 100) + 40);
      const destinationAmount = Math.round(amount - skillshapeAmount);
      let stripe_Request = {
        amount: amount,
        currency: "usd",
        description: desc,
        source: token,
        destination: {
          amount: destinationAmount,
          account: stripeAccountId
        }
      };
      let userId = this.userId;
      let payload = {
        userId: userId,
        stripe_Request: stripe_Request,
        createdOn: new Date(),
        packageId: packageId,
        packageType: packageType,
        schoolId: schoolId,
        status: "In_Progress",
        fee: Math.round(amount * (2.9 / 100) + 30)
      };
      recordId = Meteor.call("purchases.addPurchase", payload);
      let charge = await stripe.charges.create(stripe_Request);

      payload = {
        stripe_Response: charge,
        status: "Succeeded"
      };
      Meteor.call("purchases.updatePurchases", payload, recordId);
      stripe.balance.retrieve(function(err, balance) {
        console.log("------------balace--------------", balance);
      });
      return "Payment Successfully Done";
    } catch (error) {
      payload = {
        stripe_Response: error,
        status: "Error"
      };
      Meteor.call("purchases.updatePurchases", payload, recordId);
      throw new Meteor.Error(
        (error && error.message) || "Something went wrong!!!"
      );
    }
  },
  "stripe.getStripeToken": function(code) {
    try {
      let result = Meteor.http.call(
        "POST",
        `https://connect.stripe.com/oauth/token?client_secret=${
          Meteor.settings.stripe.PRIVATE_KEY
        }&code=${code}&grant_type=authorization_code`
      );

      let payload = {
        userId: this.userId,
        stripe_user_id: result.data.stripe_user_id,
        stripe_user_refresh_token: result.data.refresh_token
      };

      let userData = UserStripeData.findOne({
        userId: this.userId
      });
      if (!userData) {
        Meteor.call("stripe.addStripeJsonForUser", payload);
        return "Successfully Connected";
      } else {
        return "Your acoount is already connected!!";
      }
    } catch (error) {
      throw new Meteor.Error(
        error.response.statusCode,
        error.response &&
          error.response.data &&
          error.response.data.error_description
      );
    }
  },
  "stripe.addStripeJsonForUser": function(data) {
    let customer_id = UserStripeData.insert(data);
    Meteor.users.update(
      { _id: this.userId },
      { $set: { "profile.stripeStatus": true } }
    );
  },
  "stripe.disconnectStripeUser": function() {
    Meteor.users.update(
      { _id: this.userId },
      { $set: { "profile.stripeStatus": false } }
    );
    UserStripeData.remove({ userId: this.userId });
    return "Successfully Disconnected";
  },
  "stripe.findAdminStripeAccount": function(superAdminId) {
    let result = UserStripeData.findOne({ userId: superAdminId });
    if (result) {
      return true;
    } else {
      return false;
    }
  },
  //creating plan for on monthly package creation
  "stripe.createStripePlan": async function(currencyCode, interval, amount) {
    console.log("amount is", amount);
    let productId = Meteor.settings.productId;
    try {
      const plan = await stripe.plans.create({
        product: productId,
        currency: currencyCode, // currency code should be in lower case
        interval: interval,
        amount: amount
      });
      return plan.id;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },
  "stripe.createStripeProduct": function(productId) {
    let existingProduct = stripe.products.retrieve(productId, function(
      err,
      product
    ) {
      // asynchronously called
      if (!product && err && err.message.indexOf("No such product") != -1) {
        //Create a service product
        try {
          const product = stripe.products.create(
            {
              name: "Skillshape Monthly Package Product",
              type: "service",
              id: productId
            },
            function(err, result) {
              if (result && result.id) {
                return result.id;
              } else {
                throw new Meteor.Error(
                  (err && err.message) || "Something went wrong!!!"
                );
              }
            }
          );
        } catch (err) {}
      }
    });
  },
  "stripe.handleCustomerAndSubscribe": async function(token, planId) {
    //customer creation and subscribe if new otherwise straight to subscribe
    try {
      console.log("token,planId", token, planId);
      let userId = this.userId;
      console.log("userId", userId);
      let currentUserProfile = Meteor.users.findOne({
        _id: userId,
        stripeCusId: { $exists: true }
      });
      let stripeCusId;
      console.log("currentUserProfile", currentUserProfile);
      if (currentUserProfile) {
        stripeCusId = currentUserProfile.stripeCusId;
      } else {
        let stripeCustomer = await stripe.customers.create({
          description: Meteor.user().emails[0].address,
          source: token
        });
        stripeCusId = stripeCustomer.id;
        console.log("stripeCusId in else part", stripeCusId);
        Meteor.users.update(
          { _id: userId },
          { $set: { stripeCusId: stripeCusId } }
        );
      }
      console.log("stripeCusId", stripeCusId);
      const subscription = await stripe.subscriptions.create({
        customer: stripeCusId,
        items: [{ plan: planId }]
      });
      console.log(subscription);
      return stripeCusId;
    } catch (error) {
      console.log("error in stripe.handleCustomerAndSubscribe", error);
    }
  }
});
