import { get, isEmpty, uniq } from 'lodash';
import { check } from 'meteor/check';
import School from '../school/fields';
import Classes from './fields';
import ClassType from '/imports/api/classType/fields';

Meteor.methods({
  'classes.handleInstructors': (doc) => {
    check(doc, Object);
    const payLoad = Object.assign(doc);
    if (payLoad.students && !isEmpty(payLoad.students)) {
      payLoad.students.forEach((obj) => {
        const memberData = {
          activeUserId: obj.userId,
          schoolId: payLoad.schoolId,
          classTypeId: payLoad.classTypeId,
          from: 'classes',
        };
        Meteor.call('schoolMemberDetails.addNewMember', memberData);
      });
    }
    if (payLoad.action === 'add') {
      if (payLoad.classTimeForm) {
        return 'record._id;';
      }

      payLoad.instructors = uniq(payLoad.instructors);
      Classes.update({ _id: payLoad._id }, { $set: payLoad });
      return 'added';
    }
    if (payLoad.action === 'remove') {
      if (payLoad.instructorIds) {
        Classes.update({ _id: payLoad._id }, { $set: { instructors: payLoad.instructorIds } });
      }
      Classes.update({ _id: payLoad._id }, { $pull: { instructors: payLoad.instructorId } });
      return true;
    }
    return null;
  },
  'classes.getClassData': (doc) => {
    check(doc, Object);
    const filter = Object.assign(doc);
    filter.scheduled_date = new Date(filter.scheduled_date);
    filter.eventData.startTime = new Date(filter.eventData.startTime);
    let record = Classes.findOne(filter);
    if (!isEmpty(record)) {
      return record;
    }

    record = Classes.insert(filter);
    filter._id = record;
    return filter;
  },
  'classes.updateClassData': (doc, status1, purId, packageType, from) => {
    check(doc, Object);
    check(status1, String);
    check(purId, String);
    check(packageType, String);
    check(from, String);
    const filter = Object.assign(doc);
    let purchaseId = purId;
    let status = status1;
    try {
      if (from === 'purchasePackage') {
        filter.students = get(Classes.findOne({ _id: filter._id }), 'students', []);
      }
      // if (filter == null) { filter = {}; }
      const obj = {
        userId: filter.userId ? filter.userId : this.userId, status, purchaseId, packageType,
      };
      if (status === 'checkIn' || status === 'checkOut') {
        // Entry in the transaction page.
        const {
          userId, schoolId, classId, classTypeId,
        } = filter;
        if (!purchaseId) {
          filter.students.forEach((obj1) => {
            if (obj1.userId === filter.userId) {
              const { purchaseId: pid } = obj1;
              purchaseId = pid;
            }
          });
        }
        if (purchaseId) {
          const data = {
            userId, schoolId, classId, purchaseId, classTypeId,
          };
          const { profile } = Meteor.users.findOne({ _id: userId }, { fields: { profile: 1 } });
          data.userName = get(profile, 'name', get(profile, 'firstName', get(profile, 'lastName', 'Old Data')));
          const purchaseData = Meteor.call('purchases.getDataForTransactionEntry', purchaseId);
          delete purchaseData._id;
          const schoolData = School.findOne({ _id: schoolId }, { fields: { name: 1, slug: 1 } });
          data.schoolName = schoolData.name;
          data.schoolSlug = schoolData.slug;
          data.transactionType = 'attendance';
          data.transactionDate = new Date();
          data.purchaseId = purchaseId;
          data.classTypeName = ClassType
            .findOne({ _id: classTypeId }, { fields: { name: 1 } }).name;
          data.action = 'add';
          const payLoad = { ...data, ...purchaseData };
          Meteor.call('transactions.handleEntry', payLoad);
        }
        status = status === 'checkOut' ? 'signIn' : status;
      }

      // Add or remove record in the add to calendar collection.
      const addToCalendarCondition = 'classTimeId' in filter && 'classTypeId' in filter && 'schoolId' in filter;
      if ((addToCalendarCondition && status === 'signIn') || status === 'signOut') {
        const { classTypeId, classTimeId, schoolId } = filter;
        const data = { classTypeId, classTimeId, schoolId };
        data.userId = filter.userId ? filter.userId : this.userId;
        data.from = 'signHandler';
        let methodName = '';
        if (status === 'signIn') { methodName = 'classInterest.addClassInterest'; } else if (status === 'signOut') { methodName = 'classInterest.removeClassInterest'; }
        delete data._id;
        if (methodName) {
          Meteor.call(methodName, { doc: data });
        }
      }
      if (filter.students && !isEmpty(filter.students)) {
        filter.students.forEach((obj1) => {
          const memberData = {
            activeUserId: obj1.userId,
            schoolId: filter.schoolId,
            classTypeId: filter.classTypeId,
            from: 'classes',
          };
          Meteor.call('schoolMemberDetails.addNewMember', memberData);
        });
      }
      if (!filter._id) {
        filter.students = [obj];
        filter.scheduled_date = new Date(filter.scheduled_date);
        return Classes.insert(filter);
      }

      if (filter.students) {
        let index = -1;
        const userId = filter.userId ? filter.userId : Meteor.userId();
        filter.students.forEach((obj1, i) => {
          if (obj1.userId === userId) {
            index = i;
          }
        });
        if (index > -1) {
          filter.students.splice(index, 1);
        }
        if (status !== 'signOut') { filter.students.push(obj); }
        filter.students = uniq(filter.students);
        return Classes.update({ _id: filter._id }, { $set: filter });
      }

      filter.students = [obj];
      filter.students = uniq(filter.students);
      return Classes.update({ _id: filter._id }, { $set: filter });
    } catch (error) {
      console.log('classes.updateClassData in error', error);
    }
    return null;
  },
});
