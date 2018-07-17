import UserStripeData from "../fields.js";

Meteor.publish("stripe.stripExistingAccount", function() {
  const result = UserStripeData.findOne({ userId: this.userId });
});
