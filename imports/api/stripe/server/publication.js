import UserStripeData from '../fields';

Meteor.publish('stripe.stripExistingAccount', function () {
  UserStripeData.findOne({ userId: this.userId });
});
