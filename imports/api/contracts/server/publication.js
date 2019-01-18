import isEmpty from 'lodash/isEmpty';
import { check } from 'meteor/check';
import Contracts from '../fields';
Meteor.publish("contracts.getRequests", function (filter) {
  check(filter,Object);
  return Contracts.find(filter);
});

