import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import ClassType from "./fields";
import ClassTimes from "/imports/api/classTimes/fields";
import ClassInterest from "/imports/api/classInterest/fields";
import SLocation from "/imports/api/sLocation/fields";
import School from "/imports/api/school/fields";
import ClassTimesRequest from "/imports/api/classTimesRequest/fields";
import ClassTypeLocationRequest from "/imports/api/classTypeLocationRequest/fields";
import {
  sendEmailToStudentForClassTypeUpdation,
  sendClassTypeLocationRequestEmail
} from "/imports/api/email";
import { sendEmailToSchool } from "/imports/api/email";
import { getUserFullName } from "/imports/util/getUserData";
import { darkBaseTheme } from "material-ui/styles";

// Need to update Class Times so that we can show ageMin,gender,experienceLevel on class details modal.
function updateHookForClassTimes({ classTimesIds, classTypeData, doc }) {
  let classTimeUpdateObj = {};
  // Need to edit changes in ClassTimes like edit `gender`,`experienceLevel`,`ageMin`.
  if (classTypeData && doc.ageMin && classTypeData.ageMin !== doc.ageMin) {
    classTimeUpdateObj.ageMin = doc.ageMin;
  }
  if (
    classTypeData &&
    doc.experienceLevel &&
    classTypeData.experienceLevel !== doc.experienceLevel
  ) {
    classTimeUpdateObj.experienceLevel = doc.experienceLevel;
  }
  if (classTypeData && doc.gender && classTypeData.gender !== doc.gender) {
    classTimeUpdateObj.gender = doc.gender;
  }
  if (!isEmpty(classTimeUpdateObj) && !isEmpty(classTimesIds)) {
    ClassTimes.update(
      { _id: { $in: classTimesIds } },
      { $set: classTimeUpdateObj },
      { multi: true }
    );
  }
}

Meteor.methods({
  "classType.getClassType": function({ schoolId }) {
    return ClassType.find({ schoolId }).fetch();
  },
  "classType.getClassTypeByTextSearch": function({ schoolId, textSearch }) {
    return ClassType.find(
      { schoolId: schoolId, name: { $regex: new RegExp(textSearch, "mi") } },
      { limit: 10, fields: { name: 1 } }
    ).fetch();
  },
  "classType.addClassType": function({ doc }) {
    const user = Meteor.users.findOne(this.userId);
    if (
      checkMyAccess({ user, schoolId: doc.schoolId, viewName: "classType_CUD" })
    ) {
      const schoolData = School.findOne({ _id: doc.schoolId });
      // doc.remoteIP = this.connection.clientAddress;
      const temp = { ...doc, isPublish: true };
      temp.filters = temp.filters ? temp.filters : {};

      if (schoolData.name) {
        temp.filters["schoolName"] = schoolData.name;
      }

      // if (temp.locationId) {
      //   const location = SLocation.findOne(doc.locationId);
      //   temp.filters["location"] = location.loc;
      //   // doc.filters["state"] = location.state;
      //   temp.filters["locationTitle"] = `${location.state}, ${location.city}, ${
      //     location.country
      //   }`;
      // }

      temp.createdAt = new Date();

      return ClassType.insert(temp);
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  "classType.editClassType": function({ doc_id, doc }) {
    const user = Meteor.users.findOne(this.userId);
    if (
      checkMyAccess({ user, schoolId: doc.schoolId, viewName: "classType_CUD" })
    ) {
      let classTypeData = ClassType.findOne({ _id: doc_id });
      const temp = { ...doc, filters: classTypeData && classTypeData.filters || {} };

      // if (temp.locationId) {
      //   console.log('TCL: temp.locationId', temp.locationId);
      //   const location = SLocation.findOne(temp.locationId);
      //   // temp.filters =  temp.filters ? temp.filters : {};
      //   temp.filters["location"] = location.loc;
      //   // temp.filters["state"] = location.state;
      //   temp.filters["locationTitle"] = `${location.state}, ${location.city}, ${
      //     location.country
      //   }`;
      // }
      let classTimesIds = ClassTimes.find({ classTypeId: doc_id }).map(
        data => data._id
      );
      if (!isEmpty(classTimesIds)) {
        updateHookForClassTimes({ classTimesIds, classTypeData, doc });
      }
      return ClassType.update({ _id: doc_id }, { $set: temp });
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  "classType.removeClassType": function({ doc }) {
    const user = Meteor.users.findOne(this.userId);
    if (
      checkMyAccess({ user, schoolId: doc.schoolId, viewName: "classType_CUD" })
    ) {
      ClassTimes.remove({ classTypeId: doc._id });
      ClassInterest.remove({ classTypeId: doc._id });
      return ClassType.remove({ _id: doc._id });
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  "classType.notifyToStudentForClassTimes": function({
    schoolId,
    classTypeId,
    classTypeName
  }) {
    if (this.userId) {
      const classTimesRequestData = ClassTimesRequest.find({
        schoolId,
        classTypeId,
        notification: true
      }).fetch();
      if (!isEmpty(classTimesRequestData)) {
        for (let obj of classTimesRequestData) {
          const userData = Meteor.users.findOne({ _id: obj.userId });
          const schoolData = School.findOne({ _id: obj.schoolId });

          if (userData && schoolData) {
          //   ClassTimesRequest.update(
          //     { _id: obj._id },
          //     { $set: { notification: false } }
          //   );
            sendEmailToStudentForClassTypeUpdation(
              userData,
              schoolData,
              classTypeName,
              'Class Time Updated'
            );
          }
        }
        return { message: "We successfully notify to student" };
      } else {
        return { message: "Their is no student to notify!!!" };
      }
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  "classType.requestClassTypeLocation": function({
    schoolId,
    classTypeId,
    classTypeName
  }) {
    if (this.userId && schoolId) {
      const classTypeLocationRequest = ClassTypeLocationRequest.findOne({
        schoolId,
        classTypeId,
        userId: this.userId
      });
      // Request Pending
      if (classTypeLocationRequest) {
        throw new Meteor.Error(
          "Your Class Type request has already been created!!!"
        );
      } else {
        const requestObj = {
          schoolId,
          createdAt: new Date(),
          notification: true,
          userId: this.userId,
          classTypeId: classTypeId,
          classTypeName: classTypeName
        };
        ClassTypeLocationRequest.insert(requestObj);
      }
      let schoolData = School.findOne(schoolId);
      let ownerName;
      if (schoolData && schoolData.superAdmin) {
        // Get Admin of School As school Owner
        let adminUser = Meteor.users.findOne(schoolData.superAdmin);
        ownerName = getUserFullName(adminUser);
      }
      // Optional if Owner name not found then owner name will be `Sam`
      if (!ownerName) {
        // Owner Name will be Sam
        ownerName = "Sam";
      }
      // Send Email to Admin of School if admin available
      const toEmail = "sam@skillshape.com"; // Needs to replace by Admin of School
      const fromEmail = "Notices@SkillShape.com";
      let currentUser = Meteor.users.findOne(this.userId);
      let currentUserName = getUserFullName(currentUser);
      sendClassTypeLocationRequestEmail({
        toEmail,
        fromEmail,
        currentUserName,
        ownerName
      });
      return { emailSent: true };
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  "classType.notifyToStudentForLocation": function({
    schoolId,
    classTypeId,
    classTypeName
  }) {
    if (this.userId) {
      const classTimesRequestData = ClassTypeLocationRequest.find({
        schoolId,
        classTypeId,
        notification: true
      }).fetch();
      if (!isEmpty(classTimesRequestData)) {
        for (let obj of classTimesRequestData) {
          const userData = Meteor.users.findOne({ _id: obj.userId });
          const schoolData = School.findOne({ _id: obj.schoolId });

          if (userData && schoolData) {
            // ClassTypeLocationRequest.update(
            //   { _id: obj._id },
            //   { $set: { notification: false } }
            // );
            sendEmailToStudentForClassTypeUpdation(
              userData,
              schoolData,
              classTypeName,
              'Location Updated'
            );
          }
        }
        return { message: "We successfully notify to student" };
      } else {
        return { message: "Their is no student to notify!!!" };
      }
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  "classType.handleEmailUsForSchool": function(
    subject,
    message,
    schoolData,
    yourEmail,
    yourName
  ) {
    let contactName;
    if (Meteor.isServer) {
      let schoolAdmin = Meteor.users.findOne({
        _id: { $in: schoolData.admins }
      });
      if (schoolAdmin) {
        contactName = getUserFullName(schoolAdmin);
      } else {
        throw new Meteor.Error("No admin found for School");
      }
      let studentName;
      if (this.userId) {
        let currentUser = Meteor.users.findOne(this.userId);
        studentName = getUserFullName(currentUser);
      }
      if (!studentName) {
        studentName = "I";
      }
      sendEmailToSchool(
        message,
        studentName,
        contactName,
        schoolData,
        subject,
        yourEmail,
        yourName
      );
      return { message: "Email Sent successfully!!!" };
    }
  },
  'classType.addLocationFilter':function(_id,locationId,classTimeId,type){
    try{

    let filters ,currentLocation={};
    const location = SLocation.findOne(locationId);
    let classTypeData = ClassType.findOne(_id);
    filters = classTypeData.filters;
    // new object for the the location when new class time is added
    if(type == 'newTime'){
      currentLocation = {
        loc: {
          type: "Point",
          coordinates: location.loc,
          title: `${location.state}, ${location.city}, ${location.country}`,
          locationId: locationId || '',
          classTimeId: classTimeId || ''
        }
      }
      if(filters && filters['location']){
        filters['location'].push(currentLocation);
      }
      else if(filters){
        filters['location']=[currentLocation];
      }else{
          filters = {};
          filters['location'] = [currentLocation];
        }
    }
    else if(type =="editTime"){
      filters["location"].map((current)=>{
        if(current['loc']['classTimeId']==classTimeId){
          current['loc']['coordinates']=location.loc;
          current['loc']['locationId'] =locationId;
          current['loc']['title']=`${location.state}, ${location.city}, ${location.country}`;
        }

      })
    }
    else if(type == 'deleteTime'){
      let pos;
      filters["location"].map((current,index)=>{
        if(current['loc']['classTimeId']==classTimeId){
          pos =index;
        }
      })
      filters['location'].splice(pos,1);
    }
    ClassType.update({_id:_id},{$set:{filters:filters}});
    }catch(error){

    }
  },
  'classType.optimizationFinder':function(){
    return ClassType.find({medium:{$exists:false},low:{$exists:false},classTypeImg:{$exists:true}}).fetch();
  }
});
 