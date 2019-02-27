import ClassInterest from "./fields";
import { sendJoinClassEmail } from "/imports/api/email";
import { getUserFullName } from "/imports/util/getUserData";
import ClassType from "/imports/api/classType/fields";
import ClassTimes from "/imports/api/classTimes/fields";
import School from "/imports/api/school/fields";
import SchoolMemberDetails from "/imports/api/schoolMemberDetails/fields";
import { check } from 'meteor/check';
import {isEmpty} from 'lodash';
import ClassTimesRequest from '/imports/api/classTimesRequest/fields.js';
import ClassTypeLocationRequest from '/imports/api/classTypeLocationRequest/fields.js';
import { dataURLToBlob } from "blob-util";
Meteor.methods({
  "classInterest.addClassInterest": function({ doc }) {
    check(doc,Object);
    let {schoolId,classTimeId,classTypeId,userId,from} = doc;
    if(!isEmpty(ClassInterest.findOne({schoolId,classTimeId,classTypeId,userId}))){
      return;
    }
    doc.createdAt = new Date();
    if (this.userId && this.userId == doc.userId || from == 'signHandler') {
      return ClassInterest.insert(doc, () => {
        Meteor.call("calendar.handleGoogleCalendar",this.userId,'insert');
        let currentUserRec = Meteor.users.findOne(this.userId);
        let {_id:userId} = currentUserRec;
        let classTypeData = ClassType.findOne(doc.classTypeId);
        let classTimes = ClassTimes.findOne(doc.classTimeId);
        let schoolData = School.findOne(classTypeData.schoolId);
        let schoolAdminRec = Meteor.users.findOne(schoolData.superAdmin);
        const currentUserName = getUserFullName(currentUserRec);
        const schoolAdminName = getUserFullName(schoolAdminRec);
        // Use `encodeURIComponent()` to encode spaces in class type name.
        let classTypeName = encodeURIComponent(
          classTypeData.name
        ) /* classTypeData.name.split(' ').join('_')*/;
        let classLink = `${Meteor.absoluteUrl()}classType/${classTypeName}/${
          classTypeData._id
        }`;
        let schoolMemberData = SchoolMemberDetails.findOne({
          activeUserId: this.userId
        });
        let memberLink;
        if (schoolMemberData) {
          memberLink = `${Meteor.absoluteUrl()}schools/${
            schoolData.slug
          }/members?userId=${userId}`;
        }
        if (from != 'signHandler'){
          sendJoinClassEmail({
            currentUserName,
            schoolAdminName,
            classTypeName: classTypeData.name,
            classTimeName: classTimes.name,
            classLink,
            memberLink
          });
        }
      });
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  "classInterest.editClassInterest": function({ doc_id, doc }) {
    check(doc,Object);
    check(doc_id,String);
    if (this.userId === doc.userId) {
      return ClassInterest.update({ _id: doc_id }, { $set: doc });
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  "classInterest.removeClassInterest": function({ doc }) {
    check(doc,Object);
    if (this.userId) {
      if(doc.from == 'signHandler'){
        let {schoolId,classTimeId,classTypeId,userId} = doc;
        let {eventId} = ClassInterest.findOne({schoolId,classTimeId,classTypeId,userId}) || {};
        eventId && Meteor.call("calendar.handleGoogleCalendar",userId,'delete',[eventId]);
        return ClassInterest.remove({schoolId,classTimeId,classTypeId,userId});
      }
      let {eventId} = ClassInterest.findOne({_id:doc._id});
      eventId && Meteor.call("calendar.handleGoogleCalendar",userId,'delete',[eventId]);
      return ClassInterest.remove({ _id: doc._id, userId: this.userId });
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  "classInterest.removeClassInterestByClassTimeId": function({ classTimeId,userId }) {
    check(classTimeId,String);
    if (userId && classTimeId) {
      return ClassInterest.remove({ userId, classTimeId });
    } else {
      throw new Meteor.Error(
        "Unable to delete due to insufficient information!!"
      );
    }
  },
  "classInterest.deleteEventFromMyCalendar": function(
    classTimeId,
    clickedDate
  ) {
    check(classTimeId,String);
    let result = ClassInterest.update(
      { classTimeId: classTimeId, userId: this.userId },
      { $push: { deletedEvents: clickedDate } }
    );
  },
  "classInterest.findClassTypes":function(schoolId,userId){
   let classData = [],current,indexLoc = -1,classTimeRecord;
   let records = ClassInterest.find({schoolId,userId}).fetch();
    if(!isEmpty(records)){
      records.map((obj,index)=>{
       classData.map((obj1,index1)=>{
         if(obj1._id == obj.classTypeId){
           indexLoc = index1
         }
       })
       if(indexLoc != -1){
        classTimeRecord = ClassTimes.findOne({_id:obj.classTimeId},{fields:{name:1}})
        if(classTimeRecord)
        classData[indexLoc].classTimes.push(classTimeRecord);
        classData[indexLoc].notification = ClassTimesRequest.findOne({classTypeId:obj.classTypeId},{fields:{notification:1,userId:1,classTypeId:1}});
       }
       else{
        current = ClassType.findOne({_id:obj.classTypeId},{fields:{name:1,classTypeImg:1,medium:1}});
        current.classTimes = [];
        classTimeRecord = ClassTimes.findOne({_id:obj.classTimeId},{fields:{name:1}})
        if(classTimeRecord)
        current.classTimes.push(classTimeRecord);
        current.notification = ClassTimesRequest.findOne({classTypeId:obj.classTypeId},{fields:{notification:1,userId:1,classTypeId:1}});
        classData.push(current);                   
      }
      })
    }
    return classData;
  },"classInterest.getClassInterest": function(filter) {
    try{
      if(!isEmpty(filter)){
        const {classTypeId} = filter;
        let classInterestData = ClassInterest.findOne(filter) || {};
        let classTimesRequest = Meteor.call("classTimesRequest.getUserRecord",classTypeId) || {}
        let classTypeLocationRequest = Meteor.call("classTypeLocationRequest.getUserRecord",classTypeId) || {}
        return {classInterestData:classInterestData,notification:{classTimesRequest,classTypeLocationRequest}}
      }
      return {};
    }catch(error){
			console.log('error in classInterest.getClassInterest', error)
      throw new Meteor.Error(error);
    }
  }
});
