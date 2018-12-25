import Attendance from './fields';
import {get,isEmpty,uniq,includes,flatten} from 'lodash';

Meteor.methods({
    "attendance.updateData":function(filter,status){
        filter.attendedTime = new Date();
        filter.classId = filter._id;
        delete filter._id;
        Attendance.insert(filter);
        return true;
    }
})