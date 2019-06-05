import ClassType from '/imports/api/classType/fields';
import SLocation from '/imports/api/sLocation/fields';
import ClassInterest from '/imports/api/classInterest/fields';
import School from '/imports/api/school/fields';
import { check } from 'meteor/check';
import {
  compact, groupBy, uniq, isEmpty,
} from 'lodash';
import ClassTimes from './fields';

Meteor.methods({
  'classTimes.getClassTimes': ({
    schoolId,
    classTypeId,
    classTimeId,
    locationId,
  }) => ({
    school: School.findOne({ _id: schoolId }),
    classTimes: ClassTimes.findOne({ _id: classTimeId }),
    classType: ClassType.findOne({ _id: classTypeId }),
    location: SLocation.findOne({ _id: locationId }),
  }),
  'classTimes.addClassTimes': ({ doc: docCopy }) => {
    check(docCopy, Object);
    const doc = Object.assign(docCopy);
    const user = Meteor.users.findOne(this.userId);
    if (
      checkMyAccess({
        user,
        schoolId: doc.schoolId,
        viewName: 'ClassTimes_CUD',
      })
    ) {
      doc.createdAt = new Date();
      const classTypeData = ClassType.findOne({ _id: doc.classTypeId });
      if (classTypeData && classTypeData.gender) {
        doc.gender = classTypeData.gender;
      }
      if (classTypeData && classTypeData.ageMin) {
        doc.ageMin = classTypeData.ageMin;
        doc.ageMax = classTypeData.ageMax;
      }
      if (classTypeData && classTypeData.experienceLevel) {
        doc.experienceLevel = classTypeData.experienceLevel;
      }

      const _id = ClassTimes.insert(doc);
      if (doc.classTypeId && doc.locationId) {
        Meteor.call('classType.addLocationFilter', doc.classTypeId, doc.locationId, _id, 'newTime');
      }
      return _id;
    }
    throw new Meteor.Error('Permission denied!!');
  },
  'classTimes.editClassTimes': ({ doc_id, doc }) => {
    try {
      const user = Meteor.users.findOne(this.userId);
      if (
        checkMyAccess({
          user,
          schoolId: doc.schoolId,
          viewName: 'ClassTimes_CUD',
        })
      ) {
        if (doc.classTypeId && doc.locationId) {
          Meteor.call('classType.addLocationFilter', doc.classTypeId, doc.locationId, doc_id, 'editTime');
        }
        const classInterestData = ClassInterest.find({ classTimeId: doc_id }).fetch();
        const userIds = uniq(compact(classInterestData.map(obj => obj.userId)));
        const classInterestDataByUserId = groupBy(classInterestData, 'userId');
        ClassTimes.update({ _id: doc_id }, { $set: doc });
        userIds.forEach((userId) => {
          const currentUserClassInterestData = classInterestDataByUserId[userId];
          const eventIds = compact(currentUserClassInterestData.map(obj => obj.eventId));
          if (userId && !isEmpty(eventIds)) { Meteor.call('calendar.handleGoogleCalendar', userId, 'delete', eventIds); }
          if (userId && !isEmpty(currentUserClassInterestData)) { Meteor.call('calendar.handleGoogleCalendar', userId, 'insert', [], currentUserClassInterestData); }
        });
        return true;
      }
      throw new Meteor.Error('Permission denied!!');
    } catch (error) {
      console.log(' error in classTimes.editClassTimes', error);
    }
    return null;
  },
  'classTimes.removeClassTimes': ({ doc }) => {
    check(doc, Object);
    const user = Meteor.users.findOne(this.userId);
    if (
      checkMyAccess({
        user,
        schoolId: doc.schoolId,
        viewName: 'ClassTimes_CUD',
      })
    ) {
      ClassInterest.remove({ classTimeId: doc._id });
      Meteor.call('classType.addLocationFilter', doc.classTypeId, doc.locationId, doc._id, 'deleteTime');
      return ClassTimes.remove({ _id: doc._id });
    }
    throw new Meteor.Error('Permission denied!!');
  },
  'classTimes.permanentlyRemove': (classTimeId, clickedDate = '') => {
    check(classTimeId, String);
    ClassTimes.update(
      { _id: classTimeId },
      { $push: { deletedEvents: clickedDate } },
    );
  },
});
