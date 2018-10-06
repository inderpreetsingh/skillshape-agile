import isEmpty from "lodash/isEmpty";
import { check } from 'meteor/check';
import Reviews, { ReviewsSchema } from "./fields.js";

Meteor.methods({
  "reviews.addReview": function (data) {
    check(data, Object);

    if (this.userId) {
      const validationContext = ReviewsSchema.newContext();
      data.reviewerId = this.userId;
      data.publishedAt = new Date();
      const isValid = validationContext.validate(data);

      if (isValid) {
        const reviewExists = Reviews.findOne({
          reviewerId: this.userId,
          reviewForId: data.reviewForId
        });
        if (reviewExists) {
          return Reviews.update({ _id: reviewExists._id }, { $set: data });
        }
        return Reviews.insert(data);
      } else {
        const invalidData = validationContext.invalidKeys()[0];
        throw new Meteor.Error(invalidData.name + " is " + invalidData.value);
      }
    } else {
      throw new Meteor.Error("Permission Denied !");
    }
  },
  "reviews.getMyReview": function (reviewForId) {
    check(reviewForId, String);

    const myReview = Reviews.findOne({
      reviewerId: this.userId,
      reviewForId: reviewForId
    });
    if(!isEmpty(myReview)){
      return {
        ratings: myReview.ratings,
        comment: myReview.comment
      };
    }
  }
});
