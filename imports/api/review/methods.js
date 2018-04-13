import isEmpty from 'lodash/isEmpty';

import Reviews from './fields.js';

Meteor.methods({
    'reviews.addReview': function(data) {
       const validationContext = Reviews.newContext();
       validationContext.validate(data,{
         keys: ['reviewForId', 'reviewFor','comment','ratings']
       });

       if(validationContext.isValid()) {
         
       }
    }
});
