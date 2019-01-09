import Attendance from './fields';
import ClassType from '/imports/api/classType/fields.js';
import {get,isEmpty,uniq,includes,flatten} from 'lodash';

Meteor.methods({
    "attendance.updateData":function(filter,status){
        filter.attendedTime = new Date();
        filter.classId = filter._id;
        delete filter._id;
        Attendance.insert(filter);
        return true;
    },
    "attendance.findById":function(filter){
        let attendanceData = Attendance.find(filter).fetch();
        !isEmpty(attendanceData) && attendanceData.map((obj,index)=>{
            obj.classTypeName = ClassType.findOne({_id:obj.classTypeId},{fields:{name:1}}).name;
        })
        return attendanceData;
    }
})