import config from '/imports/config.js';

const PricingRequest = new Mongo.Collection(config.collections.pricingRequest);

export const PricingRequestSchema = new SimpleSchema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  classTypeId: {
    type: String,
    optional: true
  },
  schoolId: {
    type: String,
  },
  existingUser: {
    type: Boolean,
    optional: true
  },
  userId: {
    type: String,
    optional: true
  },
  notification: {
    type: Boolean
  },
  createdAt: {
    type: Date,
  }
});

PricingRequest.attachSchema(PricingRequestSchema);

export default PricingRequest;
