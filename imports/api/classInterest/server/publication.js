import ClassInterest from '../fields';

Meteor.publish('classInterest.getClassInterest', function (classTimeId, schoolId, classTypeId) {
  if (classTimeId && schoolId && classTypeId) {
    return ClassInterest.find({ classTimeId, schoolId, classTypeId });
  }
  if (this.userId) {
    	return ClassInterest.find({ userId: this.userId });
  }
  return [];
});
