import config from "/imports/config";
const UserStripeData = new Mongo.Collection(config.collections.userStripeData);

export const UserStripeSchema = new SimpleSchema({
  userId: {
    type: String,
    optional: true
  },
  stripe_user_id: {
    type: String,
    optional: true
  },
  stripe_user_refresh_token: {
    type: String,
    optional: true
  }
});

UserStripeData.attachSchema(UserStripeSchema);

export default UserStripeData;
