import isEmpty from 'lodash/isEmpty';

import Reviews , { ReviewsSchema } from './fields.js';

Meteor.methods({
    'reviews.addReview': function(data) {
      if(this.userId) {
        const validationContext = ReviewsSchema.newContext();
        data.reviewerId = this.userId;
        data.publishedAt = new Date();
        const isValid = validationContext.validate(data);

        if(isValid) {
          //console.log('\n.... Review being added... \n');
          const reviewExists = Reviews.find({reviewerId: this.userId , reviewForId: data.reviewForId}).fetch()[0];
          if(reviewExists) {
            return Reviews.update({_id: reviewExists._id},{$set: data});
          }
          return Reviews.insert(data);
        }else {
          const invalidData = validationContext.invalidKeys()[0];
          console.log("validation errors...",validationContext.invalidKeys());
          throw new Meteor.Error(invalidData.name +' is '+ invalidData.value);
        }
      }else {
        throw new Meteor.Error('Permission Denied !');
      }
    },
    'reviews.getMyReview' : function(reviewForId) {
      const myReview =  Reviews.find({reviewerId: this.userId , reviewForId: reviewForId}).fetch()[0];
      return {
        ratings: myReview.ratings,
        comment: myReview.comment
      }
    }
});
