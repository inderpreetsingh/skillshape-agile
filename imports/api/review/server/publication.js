import Reviews from '../fields.js';

Meteor.publish('review.getReviews',function({reviewForId}) {
  console.log(reviewForId,"reviewForId");

  let cursor = Reviews.find({reviewForId});
  console.info('review .find',Reviews.find().fetch(),cursor.fetch());
  return Reviews.publishJoinedCursors(cursor,{reactive: true},this);
});
