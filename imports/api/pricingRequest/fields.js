import config from '/imports/config.js';

const PricingRequest = new Mongo.Collection(config.collections.pricingRequest);

export const PricingRequestSchema = new SimpleSchema({
  name: {
    type: String,
  },
  emailId: {
    type: String,
  },
  classTypeId: {
    type: String,
  },
  schoolId: {
    type: String,
  },
  existingUser: {
    type: String,
    optional: true
  },
  userId: {
    type: String,
    optional: true
  }
});

PricingRequest.attachSchema(PricingRequestSchema);

export default PricingRequest;
