import isEmpty from 'lodash/isEmpty';
import { check } from 'meteor/check';
import ClassSubscription from './fields';

Meteor.methods({
  'classSubscription.isAlreadyMarked': ({ userId, planId }) => {
    check(userId, String);
    check(planId, String);
    const result = ClassSubscription.find({ userId, planId, status: 'inProgress' }).fetch();
    if (!isEmpty(result)) {
      return true;
    }
    return false;
  },

});
