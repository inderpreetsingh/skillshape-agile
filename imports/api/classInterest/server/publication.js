import { check, Match } from 'meteor/check';
import ClassInterest from '../fields';

Meteor.publish('classInterest.getClassInterest', (classTimeId, schoolId, classTypeId) => {
  check(classTimeId, Match.Maybe(String));
  check(schoolId, Match.Maybe(String));
  check(classTypeId, Match.Maybe(String));
  if (classTimeId && schoolId && classTypeId) {
    return ClassInterest.find({ classTimeId, schoolId, classTypeId });
  }
  if (this.userId) {
    return ClassInterest.find({ userId: this.userId });
  }
  return [];
});
