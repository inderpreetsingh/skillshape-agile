import UserStripeData from "./fields";
import School from "../school/fields";
Meteor.methods({
  "stripe.chargeCard": async function(
    stripeToken,
    amount,
    desc,
    packageId,
    packageType,
    schoolId,
    expDuration,
    expPeriod,
    noClasses,
    classTypeIds
  ) {
    console.log(
      "stripe.chargecard arugments",
      stripeToken,
      amount,
      desc,
      packageId,
      packageType,
      schoolId,
      classTypeIds
    );
    let recordId;
    let userId = this.userId;
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
      let payload = {
        userId: userId,
        stripe_Request: stripe_Request,
        createdOn: new Date(),
        packageId: packageId,
        packageType: packageType,
        schoolId: schoolId,
        status: "In_Progress",
        startDate: new Date(),
        endDate: expPeriod + expDuration,
        noOfClasses: noClasses,
        classTypeIds: classTypeIds,
        fee: Math.round(amount * (2.9 / 100) + 30)
      };
      recordId = Meteor.call("purchases.addPurchase", payload);
      let charge = await stripe.charges.create(stripe_Request);

      payload = {
        stripe_Response: charge,
        status: "Succeeded"
      };
      let currentUserRec = Meteor.users.findOne(this.userId);
      Meteor.call("purchases.updatePurchases", { payload, recordId });
      let x = new Date().getTime();
      let memberData = {
        firstName:
          currentUserRec.profile.name || currentUserRec.profile.firstName,
        lastName: currentUserRec.profile.firstName || "",
        email: currentUserRec.emails[0].address,
        phone: "",
        schoolId: schoolId,
        classTypeIds: classTypeIds,
        birthYear: "",
        studentWithoutEmail: false,
        sendMeSkillShapeNotification: true,
        activeUserId: currentUserRec._id,
        createdBy: "",
        inviteAccepted: false,
        packageDetails: {
          [x]: {
            packageName: desc,
            createdOn: new Date(),
            packageType: packageType,
            packageId: packageId,
            expDuration: expDuration,
            expPeriod: expPeriod,
            noClasses: noClasses
          }
        }
      };
      Meteor.call(
        "schoolMemberDetails.addNewMember",
        memberData,
        (error, result) => {
          let memberId = result;
          Meteor.call(
            "purchases.checkExisitingPackagePurchases",
            userId,
            packageId,
            (error, result) => {
              console.log("error and result", error, result);
              status = result;
              payload = { memberId: memberId, packageStatus: status };
              Meteor.call("purchases.updatePurchases", { payload, recordId });
            }
          );
        }
      );
      stripe.balance.retrieve(function(err, balance) {
        console.log("------------balace--------------", balance);
      });
      return "Payment Successfully Done";
    } catch (error) {
      payload = {
        stripe_Response: error,
        status: "Error"
      };
      Meteor.call("purchases.updatePurchases", { payload, recordId });
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
  }
});
