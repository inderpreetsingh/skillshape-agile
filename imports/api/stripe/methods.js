import UserStripeData from "./fields";
Meteor.methods({
  chargeCard: function(stripeToken) {
    var stripe = require("stripe")(Meteor.settings.stripe.PRIVATE_KEY);
    const token = stripeToken;

    stripe.charges
      .create({
        amount: 999,
        currency: "usd",
        description: "Example charge",
        source: token,
        destination: {
          account: "acct_1CezDcCfNNL9TPqv"
        }
      })

      .then(function(charge) {
        // asynchronously called
        console.log("charge------------>", charge);
      });
  },
  getStripeToken: function(code) {
    Meteor.http.call(
      "POST",
      `https://connect.stripe.com/oauth/token?client_secret=${
        Meteor.settings.stripe.PRIVATE_KEY
      }&code=${code}&grant_type=authorization_code`,
      (error, result) => {
        console.log("result--------->", result, this.userId);
        console.log("error--->", error);
        if (result && result.statusCode == 400) {
          // if (result && result.data.error) {
          //   throw new Meteor.Error(result.data.error_description);
          // }
        } else if (
          !error &&
          result &&
          result.data &&
          result.data.stripe_user_id
        ) {
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
        }
      }
    );
  },
  addStripeJsonForUser: function(data) {
    let customer_id = UserStripeData.insert(data);
  }
});
