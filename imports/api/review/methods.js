import isEmpty from 'lodash/isEmpty';

import Reviews , { ReviewsSchema } from './fields.js';

Meteor.methods({
    'reviews.addReview': function(data) {
      if(this.userId) {
        const validationContext = ReviewsSchema.newContext();
        // console.info('reviews calling......',validationContext);
        data.reviewerId = this.userId;
        data.publishedAt = new Date();
        const isValid = validationContext.validate(data);

        if(isValid) {
          console.log('\n.... Review being added... \n');
          return Reviews.insert(data);
        }else {
          const invalidData = validationContext.invalidKeys()[0];
          console.log("validation errors...",validationContext.invalidKeys());
          throw new Meteor.Error(invalidData.name +' is '+ invalidData.value);
        }
      }else {
        throw new Meteor.Error('Permission Denied !');
      }
    }
});
