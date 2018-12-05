import config from "/imports/config";
const ClassSubscription = new Mongo.Collection(
  config.collections.classSubscription
);

export const ClassSubscriptionSchema = new SimpleSchema({
  userId: {
    type: String,
    optional: true
  },
  subscriptionId: {
    type: String,
    optional: true
  },
  contractLength: {
    type: Number,
    optional: true
  },
  subscriptionRequest: {
    type: Object,
    optional: true,
    blackbox: true
  },
  subscriptionResponse: {
    type: Object,
    optional: true,
    blackbox: true
  },
  currency: {
    type: String,
    optional: true
  },
  fee: {
    type: Number,
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
  packageId: {
    type: String,
    optional: true
  },
  packageName: {
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
  emailId: {
    type: String,
    optional: true
  },
  monthCounter:{
    type: Number,
    optional: true
  },
  subscriptionCancelResponse:{
    type: Object,
    optional: true,
    blackbox: true
  },
  planId:{
    type: String,
    optional: true
  }
});

ClassSubscription.attachSchema(ClassSubscriptionSchema);
export default ClassSubscription;
