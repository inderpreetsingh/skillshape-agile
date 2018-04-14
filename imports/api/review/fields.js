import config from '/imports/config';

const Reviews = new Mongo.Collection(config.collections.reviews);

export const ReviewsSchema = new SimpleSchema({
    reviewForId: {
      type: String
    },
    reviewFor: {
      type: String, // can be school, class
      allowedValues: ['school','class']
    },
    reviewerId: {
      type: String
    },
    publishedAt: {
      type: Date
    },
    comment: {
      type: String,
      optional: true // some user might give only ratings
    },
    ratings: {
      type: SimpleSchema.Integer // same as number but with decimals/floats
    }
});

Reviews.attachSchema(ReviewsSchema);

Reviews.join(Meteor.users,'reviewerId','userProfile',['profile']);

export default Reviews;
