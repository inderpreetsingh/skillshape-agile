import UserStripeData from "./fields";
import School from "../school/fields";
Meteor.methods({
  chargeCard: async function(
    stripeToken,
    amount,
    desc,
    packageId,
    packageType,
    schoolId
  ) {
    let superAdminId = School.findOne({ _id: schoolId });
    superAdminId = superAdminId.superAdmin;
    console.log("superAdminId", superAdminId);
    // let stripeAccountId = UserStripeData.findOne({ userId: superAdminId });
    // console.log("stripeAccountId", stripeAccountId);
    // stripeAccountId = stripeAccountId.stripe_user_id;
    //console.log("stripeAccountId", stripeAccountId);
    var stripe = require("stripe")(Meteor.settings.stripe.PRIVATE_KEY);
    const token = stripeToken;
    let stripe_Request = {
      amount: amount,
      currency: "usd",
      description: desc,
      source: token,
      destination: {
        amount: 5,
        account: "acct_1CezDcCfNNL9TPqv"
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
      status: "In_Progress"
    };
    let recordId = Meteor.call("addPurchase", payload);
    console.log("recordId", recordId);
    try {
      let charge = await stripe.charges.create(stripe_Request);
      console.log("charge=====>", charge);
      payload = {
        stripe_Response: charge,
        status: "Succeeded"
      };
      console.log("=============>payload<=============", payload);
      Meteor.call("updatePurchases", payload, recordId);
      return "Payment Successfully Done";
    } catch (error) {
      console.log("error------------>", error);
      payload = {
        stripe_Response: error,
        status: "Error"
      };
      Meteor.call("updatePurchases", payload, recordId);
      return error;
    }
  },
  getStripeToken: function(code) {
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
        stripe_user_id: payload.stripe_user_id
      });
      if (!userData) {
        Meteor.call("addStripeJsonForUser", payload);
      }
    } catch (error) {
      throw new Meteor.Error(
        error.response &&
          error.response.data &&
          error.response.data.error_description,
        error.response.statusCode
      );
    }
  },
  addStripeJsonForUser: function(data) {
    let customer_id = UserStripeData.insert(data);
  }
});
