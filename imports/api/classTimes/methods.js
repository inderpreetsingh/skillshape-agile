import ClassTimes from "./fields";
import ClassType from "/imports/api/classType/fields";
import SLocation from "/imports/api/sLocation/fields";
import ClassInterest from "/imports/api/classInterest/fields";
import School from "/imports/api/school/fields";
import { check } from 'meteor/check';
Meteor.methods({
  "classTimes.getClassTimes": function({
    schoolId,
    classTypeId,
    classTimeId,
    locationId
  }) {
    

    // console.log("classTimes.getClassTimes -->>",schoolId, classTypeId, classTimeId)
    // console.log("SchoolSchool -->>",School.find({ _id: schoolId}))
    return {
      school: School.findOne({ _id: schoolId }),
      classTimes: ClassTimes.findOne({ _id: classTimeId }),
      classType: ClassType.findOne({ _id: classTypeId }),
      location: SLocation.findOne({ _id: locationId })
    };
  },
  "classTimes.addClassTimes": function({ doc }) {
    check(doc,Object);

    const user = Meteor.users.findOne(this.userId);
    if (
      checkMyAccess({
        user,
        schoolId: doc.schoolId,
        viewName: "ClassTimes_CUD"
      })
    ) {
      // doc.remoteIP = this.connection.clientAddress;
      doc.createdAt = new Date();

      let classTypeData = ClassType.findOne({ _id: doc.classTypeId });
      // Need to update `gender`,ageMin,experienceLevel so that they are available in `ClassTimes` in order to show in class time popup.
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
      return ClassTimes.insert(doc);
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  "classTimes.editClassTimes": function({ doc_id, doc }) {
    check(doc,Object);
    check(doc_id,String);
    const user = Meteor.users.findOne(this.userId);
    // console.log("classTimes.editClassTimes methods called!!!",doc_id, doc);
    if (
      checkMyAccess({
        user,
        schoolId: doc.schoolId,
        viewName: "ClassTimes_CUD"
      })
    ) {
      // console.log(doc);
      return ClassTimes.update({ _id: doc_id }, { $set: doc });
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  "classTimes.removeClassTimes": function({ doc }) {
    check(doc,Object);
    const user = Meteor.users.findOne(this.userId);
    // console.log("classTimes.removeClassTimes methods called!!!",doc);
    if (
      checkMyAccess({
        user,
        schoolId: doc.schoolId,
        viewName: "ClassTimes_CUD"
      })
    ) {
      ClassInterest.remove({ classTimeId: doc._id });
      return ClassTimes.remove({ _id: doc._id });
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  "classTimes.permanentlyRemove": function(classTimeId, clickedDate) {
    check(classTimeId,String);
    ClassTimes.update(
      { _id: classTimeId },
      { $push: { deletedEvents: clickedDate } }
    );
  }
});
