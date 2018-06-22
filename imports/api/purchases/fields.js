import config from "/imports/config";
const Purchases = new Mongo.Collection(config.collections.purchases);

export const PurchasesSchema = new SimpleSchema({
  userId: {
    type: String,
    optional: true
  },
  stripe_Request: {
    type: Object,
    optional: true,
    blackbox: true
  },
  stripe_Response: {
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
  }
});

Purchases.attachSchema(PurchasesSchema);

export default Purchases;
