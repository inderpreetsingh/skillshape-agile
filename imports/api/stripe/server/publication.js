import UserStripeData from "../fields.js";

Meteor.publish("stripExistingAccount", function() {
  const result = UserStripeData.findOne({ userId: this.userId });
  console.log("result in publication of stripe", result);
});
