import UserStripeData from "./fields";
import School from "../school/fields";
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
      var stripe = require("stripe")(Meteor.settings.stripe.PRIVATE_KEY);
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
  "stripe.createStripePlan": function({ currencyCode, interval, amount }) {
    let productId = Meteor.settings.productId;
    const plan = stripe.plans.create(
      {
        product: productId,
        currency: currencyCode, // currency code should be in lower case
        interval: interval,
        amount: amount
      },
      function(err, res) {
        console.log("error22222------------->", err, res);
        if (err) {
          throw new Meteor.Error(
            (err && err.message) || "Something went wrong!!!"
          );
        } else {
        }
      }
    );
  },
  "stripe.createStripeProduct": function(productId) {
    let existingProduct = stripe.products.retrieve(productId, function(
      err,
      product
    ) {
      console.log("product--------->", product);
      // asynchronously called
      if (!product && !err) {
        //Create a service product
        const product = stripe.products.create(
          {
            name: "My SaaS Platform",
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
      }
    });
  }
});
