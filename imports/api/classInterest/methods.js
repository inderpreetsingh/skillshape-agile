import { isEmpty, uniq } from 'lodash';
import { check } from 'meteor/check';
import ClassInterest from './fields';
import ClassTimes from '/imports/api/classTimes/fields';
import ClassTimesRequest from '/imports/api/classTimesRequest/fields';
import ClassType from '/imports/api/classType/fields';
import { sendJoinClassEmail } from '/imports/api/email';
import School from '/imports/api/school/fields';
import SchoolMemberDetails from '/imports/api/schoolMemberDetails/fields';
import { getUserFullName } from '/imports/util/getUserData';

Meteor.methods({
  'classInterest.addClassInterest': ({ doc }) => {
    check(doc, Object);
    const {
      schoolId, classTimeId, classTypeId, userId, from,
    } = doc;
    const docCopy = Object.assign(doc);
    if (!isEmpty(ClassInterest.findOne({
      schoolId, classTimeId, classTypeId, userId,
    }))) {
      return;
    }
    docCopy.createdAt = new Date();
    if ((this.userId && this.userId === docCopy.userId) || from === 'signHandler') {
      ClassInterest.insert(docCopy, () => {
        Meteor.call('calendar.handleGoogleCalendar', this.userId, 'insert');
        const currentUserRec = Meteor.users.findOne(this.userId);
        const classTypeData = ClassType.findOne(docCopy.classTypeId);
        const classTimes = ClassTimes.findOne(docCopy.classTimeId);
        const schoolData = School.findOne(classTypeData.schoolId);
        const schoolAdminRec = Meteor.users.findOne(schoolData.superAdmin);
        const currentUserName = getUserFullName(currentUserRec);
        const schoolAdminName = getUserFullName(schoolAdminRec);
        // Use `encodeURIComponent()` to encode spaces in class type name.
        const classTypeName = encodeURIComponent(
          classTypeData.name,
        );
        const classLink = `${Meteor.absoluteUrl()}classType/${classTypeName}/${
          classTypeData._id
        }`;
        const schoolMemberData = SchoolMemberDetails.findOne({
          activeUserId: this.userId,
        });
        let memberLink;
        if (schoolMemberData) {
          memberLink = `${Meteor.absoluteUrl()}schools/${
            schoolData.slug
          }/members?userId=${this.userId}`;
        }
        if (from !== 'signHandler') {
          sendJoinClassEmail({
            currentUserName,
            schoolAdminName,
            classTypeName: classTypeData.name,
            classTimeName: classTimes.name,
            classLink,
            memberLink,
          });
        }
      });
    }
    throw new Meteor.Error('Permission denied!!');
  },
  'classInterest.editClassInterest': ({ doc_id, doc }) => {
    check(doc, Object);
    check(doc_id, String);
    if (this.userId === doc.userId) {
      return ClassInterest.update({ _id: doc_id }, { $set: doc });
    }
    throw new Meteor.Error('Permission denied!!');
  },
  'classInterest.removeClassInterest': ({ doc }) => {
    check(doc, Object);
    if (this.userId) {
      if (doc.from === 'signHandler') {
        const {
          schoolId, classTimeId, classTypeId, userId,
        } = doc;
        const { eventId } = ClassInterest.findOne({
          schoolId, classTimeId, classTypeId, userId,
        }) || {};
        if (eventId) { Meteor.call('calendar.handleGoogleCalendar', userId, 'delete', [eventId]); }
        return ClassInterest.remove({
          schoolId, classTimeId, classTypeId, userId,
        });
      }
      const { eventId } = ClassInterest.findOne({ _id: doc._id });
      if (eventId) Meteor.call('calendar.handleGoogleCalendar', this.userId, 'delete', [eventId]);
      return ClassInterest.remove({ _id: doc._id, userId: this.userId });
    }
    throw new Meteor.Error('Permission denied!!');
  },
  'classInterest.removeClassInterestByClassTimeId': ({ classTimeId, userId }) => {
    check(classTimeId, String);
    if (userId && classTimeId) {
      return ClassInterest.remove({ userId, classTimeId });
    }
    throw new Meteor.Error(
      'Unable to delete due to insufficient information!!',
    );
  },
  'classInterest.deleteEventFromMyCalendar': (
    classTimeId,
    clickedDate,
  ) => {
    check(classTimeId, String);
    check(clickedDate, String);
    ClassInterest.update(
      { classTimeId, userId: this.userId },
      { $push: { deletedEvents: clickedDate } },
    );
  },
  'classInterest.findClassTypes': (schoolId, userId) => {
    check(schoolId, String);
    check(userId, String);
    const classData = []; let current; let indexLoc = -1; let
      classTimeRecord;
    const records = ClassInterest.find({ schoolId, userId }).fetch();
    if (!isEmpty(records)) {
      records.forEach((obj) => {
        classData.forEach((obj1, index1) => {
          if (obj1._id === obj.classTypeId) {
            indexLoc = index1;
          }
        });
        if (indexLoc !== -1 && !isEmpty(classData)) {
          classTimeRecord = ClassTimes.findOne({ _id: obj.classTimeId }, { fields: { name: 1 } });
          if (classTimeRecord) { classData[indexLoc].classTimes.push(classTimeRecord); }
          classData[indexLoc].notification = ClassTimesRequest.findOne(
            { classTypeId: obj.classTypeId },
            { fields: { notification: 1, userId: 1, classTypeId: 1 } },
          );
        } else {
          current = ClassType.findOne(
            { _id: obj.classTypeId },
            { fields: { name: 1, classTypeImg: 1, medium: 1 } },
          );
          if (!isEmpty(current)) {
            current.classTimes = [];
            classTimeRecord = ClassTimes.findOne({ _id: obj.classTimeId }, { fields: { name: 1 } });
            if (classTimeRecord) { current.classTimes.push(classTimeRecord); }
            current.notification = ClassTimesRequest.findOne(
              { classTypeId: obj.classTypeId },
              { fields: { notification: 1, userId: 1, classTypeId: 1 } },
            );
            classData.push(current);
          }
        }
      });
    }
    return classData;
  },
  'classInterest.getClassInterest': (filter = {}, schoolId) => {
    check(filter, Object);
    check(schoolId, String);

    try {
      if (!isEmpty(filter)) {
        const { classTypeId, userId } = filter;
        const classInterestData = ClassInterest.findOne(filter) || {};
        const classTimesRequest = Meteor.call('classTimesRequest.getUserRecord', classTypeId) || {};
        const classTypeLocationRequest = Meteor.call('classTypeLocationRequest.getUserRecord', classTypeId) || {};
        const schoolMemberData = Meteor.call('schoolMemberDetails.getMemberData', { activeUserId: userId, schoolId }) || {};
        let isFirstTime = ClassInterest.findOne({ schoolId, userId }) || {};
        if (!isEmpty(isFirstTime)) {
          isFirstTime = false;
        } else {
          isFirstTime = true;
        }
        return {
          classInterestData,
          notification: { classTimesRequest, classTypeLocationRequest },
          schoolMemberData,
          isFirstTime,
        };
      }
      return {};
    } catch (error) {
      console.log('error in classInterest.getClassInterest', error);
      throw new Meteor.Error(error);
    }
  },
  'classInterest.getSchoolsIAttend': (filter = {}) => {
    check(filter, Object);
    try {
      let schoolIds = [];
      const results = ClassInterest.find(filter).fetch();
      if (!isEmpty(results)) {
        schoolIds = results.map(obj => obj.schoolId);
        schoolIds = uniq(schoolIds);
        return School.find({ _id: { $in: schoolIds } }).fetch();
      }
      return [];
    } catch (error) {
      console.log('error in classInterest.getSchoolsIAttend', error);
      throw new Meteor.Error(error);
    }
  },
});
