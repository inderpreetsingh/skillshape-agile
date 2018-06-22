import UserStripeData from "./fields";
Meteor.methods({
  chargeCard: async function(
    stripeToken,
    amount,
    desc,
    packageId,
    packageType,
    schoolId
  ) {
    console.log(
      "amount, desc",
      stripeToken,
      amount,
      desc,
      packageId,
      packageType,
      schoolId
    );
    var stripe = require("stripe")(Meteor.settings.stripe.PRIVATE_KEY);
    const token = stripeToken;
    let stripe_Request = {
      amount: amount,
      currency: "usd",
      description: desc,
      source: token,
      destination: {
        account: "acct_1CezDcCfNNL9TPqv"
      }
    };
    let userId = this.userId;
    try {
      let charge = await stripe.charges.create(stripe_Request);
      let payload = {
        userId: userId,
        stripe_Request: stripe_Request,
        stripe_Response: charge,
        createdOn: new Date(),
        packageId: packageId,
        packageType: packageType,
        schoolId: schoolId
      };
      console.log("================", payload);
      Meteor.call("addPurchase", payload);
    } catch (error) {
      console.log(error);
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
      console.log("payload------------", payload);
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
