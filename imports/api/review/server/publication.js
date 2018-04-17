import Reviews from '../fields.js';

Meteor.publish('review.getReviews',function({reviewForId}) {
  console.log(reviewForId,"reviewForId");

  let cursor = Reviews.find({reviewForId});
  console.info('review .find',Reviews.find().fetch(),cursor.fetch());
  return Reviews.publishJoinedCursors(cursor,{reactive: true},this);
});

// @param {array[string]} reviewForIds --> This will grab only those reviews for respective classes and schools
Meteor.publish('review.getReviewsWithReviewForIds',function(reviewsForIds) {
  console.log('---------------, reviews publication..');
  if(!reviewsForIds) {
    this.ready();
    return;
  }
  return Reviews.find({reviewForId: {$in : reviewsForIds}});
});
