import ClassSubscription from '../fields';

Meteor.publish('classSubscription.findDataById', (filter = {}) => {
  filter.status = 'inProgress';
  return ClassSubscription.find(filter);
});
