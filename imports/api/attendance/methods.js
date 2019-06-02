import { isEmpty } from 'lodash';
import { check } from 'meteor/check';
import Attendance from './fields';
import ClassType from '/imports/api/classType/fields';

Meteor.methods({
  'attendance.updateData': (filter = {}) => {
    check(filter, Object);
    const newFilter = Object.assign(filter);
    newFilter.attendedTime = new Date();
    newFilter.classId = newFilter._id;
    delete newFilter._id;
    Attendance.insert(newFilter);
    return true;
  },
  'attendance.findById': (filter = {}) => {
    check(filter, Object);
    const attendanceData = Attendance.find(filter).fetch();
    let response = [];
    if (!isEmpty(attendanceData)) {
      response = attendanceData.map((obj) => {
        const newObj = Object.assign(obj);
        newObj.classTypeName = ClassType.findOne(
          { _id: newObj.classTypeId }, { fields: { name: 1 } },
        ).name;
        return newObj;
      });
    }
    return response;
  },
  'attendance.removeData': (filter) => {
    check(filter, Object);
    const { _id: classId, userId } = filter;
    Attendance.remove({ userId, classId });
  },
});
