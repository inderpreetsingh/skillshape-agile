import config from '/imports/config';

const Reviews = new Mongo.Collection(config.collections.reviews);

Reviews.attachSchema(new SimpleSchema({
  reviewForId: {
    type: String
  },
  reviewFor: {
    type: String // can be school, class
    allowedValues: ['school','class']
  },
  reviewerId: {
    type: String
  },
  published: {
    type: Date
  },
  comment: {
    type: String,
    optional: true // some user might give only ratings
  },
  ratings: {
    type: Number
  }
}));

Reviews.join(Meteor.users,'reviewerId','userProfile',['profile']);

export default Reviews;
