import config from "/imports/config";
const Purchases = new Mongo.Collection(config.collections.purchases);

export const PurchasesSchema = new SimpleSchema({
  userId: {
    type: String,
    optional: true
  },
  currency: {
    type: String,
    optional: true
  },
  emailId: {
    type: String,
    optional: true
  },
  userName: {
    type: String,
    optional: true
  },
  packageName: {
    type: String,
    optional: true
  },
  planId: {
    type: String,
    optional: true
  },
  stripeRequest: {
    type: Object,
    optional: true,
    blackbox: true
  },
  stripeResponse: {
    type: Object,
    optional: true,
    blackbox: true
  },
  createdOn: {
    type: Date,
    optional: true
  },
  packageId: {
    type: String,
    optional: true
  },
  packageType: {
    type: String,
    optional: true
  },
  schoolId: {
    type: String,
    optional: true
  },
  status: {
    type: String,
    optional: true
  },
  fee: {
    type: Number,
    optional: true
  },
  packageStatus: {
    type: String,
    optional: true
  },
  noClasses: {
    type: Number,
    optional: true
  },
  contractLength: {
    type: Number,
    optional: true
  },
  amount: {
    type: Number,
    optional: true,
    decimal: true
  },
  payUpFront: {
    type: Boolean,
    optional: true
  },
  payAsYouGo: {
    type: Boolean,
    optional: true
  },
  startDate: {
    type: Date,
    optional: true
  },
  endDate: {
    type: Date,
    optional: true
  },
  memberId: {
    type: String,
    optional: true
  },
  classId: {
    type: String,
    optional: true
  },
  subscriptionId: {
    type: String,
    optional: true
  }
});

Purchases.attachSchema(PurchasesSchema);
Purchases.join(Meteor.users, "userId", "profile", [
  "profile.name",
  "emails.address"
]);
export default Purchases;
