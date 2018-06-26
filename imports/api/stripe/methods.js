import UserStripeData from "./fields";
import School from "../school/fields";
//chargeCard for  creating charge and purchasing package
//getStripeToken for getting stripe account id
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
    let stripeAccountId = UserStripeData.findOne({ userId: superAdminId });
    stripeAccountId = stripeAccountId.stripe_user_id;
    var stripe = require("stripe")(Meteor.settings.stripe.PRIVATE_KEY);
    const token = stripeToken;
    let stripe_Request = {
      amount: amount,
      currency: "usd",
      description: desc,
      source: token,
      destination: {
        amount: 5,
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
    // try {
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
    console.log("userData", userData);
    if (!userData) {
      Meteor.call("addStripeJsonForUser", payload);
      return "Successfully Connected";
    }
    // } catch (error) {
    //   throw new Meteor.Error(
    //     error.response &&
    //       error.response.data &&
    //       error.response.data.error_description,
    //     error.response.statusCode
    //   );
    // }
  },
  addStripeJsonForUser: function(data) {
    let customer_id = UserStripeData.insert(data);
  }
});