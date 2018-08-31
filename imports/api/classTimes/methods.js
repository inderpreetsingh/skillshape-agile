import ClassTimes from "./fields";
import ClassType from "/imports/api/classType/fields";
import SLocation from "/imports/api/sLocation/fields";
import ClassInterest from "/imports/api/classInterest/fields";
import School from "/imports/api/school/fields";

Meteor.methods({
  "classTimes.getClassTimes": function({
    schoolId,
    classTypeId,
    classTimeId,
    locationId
  }) {
    return {
      school: School.findOne({ _id: schoolId }),
      classTimes: ClassTimes.findOne({ _id: classTimeId }),
      classType: ClassType.findOne({ _id: classTypeId }),
      location: SLocation.findOne({ _id: locationId })
    };
  },
  "classTimes.addClassTimes": function({ doc }) {
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

      let _id = ClassTimes.insert(doc);
      if( doc && doc.classTypeId  && doc.locationId){
        Meteor.call('classType.addLocationFilter',doc.classTypeId,doc.locationId,_id,"newTime")
      }
      return _id;
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  "classTimes.editClassTimes": function({ doc_id, doc }) {
    try{

      console.log("doc  ", doc );
      const user = Meteor.users.findOne(this.userId);
      if (
        checkMyAccess({
          user,
          schoolId: doc.schoolId,
          viewName: "ClassTimes_CUD"
        })
      ) {
        if(  doc && doc.classTypeId  && doc.locationId){
          Meteor.call('classType.addLocationFilter',doc.classTypeId,doc.locationId,doc_id,"editTime")
        }
        return ClassTimes.update({ _id: doc_id }, { $set: doc });
      } else {
        throw new Meteor.Error("Permission denied!!");
      }
    }catch(error){
      console.log("error in classTimes.editClassTimes", error);
    }
  },
  "classTimes.removeClassTimes": function({ doc }) {
    const user = Meteor.users.findOne(this.userId);
    if (
      checkMyAccess({
        user,
        schoolId: doc.schoolId,
        viewName: "ClassTimes_CUD"
      })
    ) {
      ClassInterest.remove({ classTimeId: doc._id });
      Meteor.call('classType.addLocationFilter',doc.classTypeId,doc.locationId,doc._id,"deleteTime")
      return ClassTimes.remove({ _id: doc._id });
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  "classTimes.permanentlyRemove": function(classTimeId, clickedDate) {
    ClassTimes.update(
      { _id: classTimeId },
      { $push: { deletedEvents: clickedDate } }
    );
  }
});
