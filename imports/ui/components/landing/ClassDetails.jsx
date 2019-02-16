import { get, isEmpty } from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component, lazy, Suspense } from "react";
import Classes from "/imports/api/classes/fields";
import ClassTime from '/imports/api/classTimes/fields.js';
import ClassType from '/imports/api/classType/fields';
import School from "/imports/api/school/fields";
import { classTypeImgSrc } from "/imports/ui/components/landing/site-settings.js";
import { ContainerLoader } from "/imports/ui/loading/container";
import { withPopUp } from '/imports/util';
const ClassDetails = lazy(() => import("/imports/ui/components/landing/components/classDetails/index.jsx"))
import MDSpinner from "react-md-spinner";

class ClassDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  getBgImage() {
    const { school, classTypeData } = this.props;
    return get(classTypeData, 'classTypeImg', get(classTypeData, 'medium', get(school, 'mainImage', get(school, 'mainImageMedium', classTypeImgSrc))));
  }

  getLogoImage() {
    const { school } = this.props;
    return get(school, 'logoImg', get(school, "logoImgMedium", ""));
  }
  shouldComponentUpdate(nextProps){
    return !nextProps.isBusy;
  }
  render() {
    const { currentUser, classTimeData,isUserSubsReady, classData, instructorsData, popUp, instructorsIds, classTypeData, isBusy,schoolData } = this.props;
    if (isBusy || isEmpty(schoolData)) {
      return  <ContainerLoader/>
    }
    const {scheduled_date:startTime} = classData;
    let currentView ;
    let params ;
    if(!isEmpty(schoolData)){
      params = {slug:schoolData.slug};
      currentView =  checkIsAdmin({user:currentUser,schoolData}) ? "instructorsView" : "studentsView";
    }
    
    return (
      <Suspense fallback={<center><MDSpinner size={50} /></center>}>
        <ClassDetails
      classTypeData = {classTypeData}
        topSearchBarProps={{
          currentUser,
          isUserSubsReady
        }}
        headerProps={{
          bgImg: this.getBgImage(),
          logoImg: this.getLogoImage()
        }}
        classTimeInformationProps={{ ...classTimeData }}
        classData={classData}
        instructorsData={instructorsData}
        popUp={popUp}
        instructorsIds={instructorsIds}
        schoolData={schoolData}
        currentView={currentView}
        params= {params}
      />
      </Suspense>
    );
  }
}

export default createContainer((props) => {
  const { classId } = props.params || {};
  let classesSubscription, classData, classTypeSub, classTimeSubscription, classTimeData, schoolData;
  let instructorsIds = []
  let instructorsData = []
  let filter = { _id: classId };
  let classTypeData = {};
  let isBusy = true;
  classesSubscription = Meteor.subscribe('classes.getClassesData', filter);
  if (classesSubscription && classesSubscription.ready()) {
    classData = Classes.findOne();
    let { classTypeId, classTimeId, schoolId, instructors: classInstructors } = classData;
    instructorsIds = classInstructors;
    if (schoolId) {
      let schoolSub = Meteor.subscribe("UserSchool", schoolId);
      if (schoolSub && schoolSub.ready()) {
        schoolData = School.findOne();
      }
    }
    if (classTypeId) {
      classTypeSub = Meteor.subscribe("classType.getClassTypeWithIds", { classTypeIds: [classTypeId] });
      if (classTypeSub && classTypeSub.ready()) {
        classTypeData = ClassType.findOne({});
      }
    }
    if (classTimeId) {
      classTimeSubscription = Meteor.subscribe('classTime.getClassTimeById', classTimeId);
      if (classTimeSubscription && classTimeSubscription.ready()) {
        classTimeData = ClassTime.findOne();
        const { instructors: classTimeInstructors } = classTimeData
        instructorsIds = isEmpty(classInstructors) ? classTimeInstructors : classInstructors;
      }
    }
    if (!isEmpty(instructorsIds)) {
      let userSubscription = Meteor.subscribe('user.getUsersFromIds', instructorsIds);
      if (userSubscription && userSubscription.ready()) {
        isBusy = false;
        instructorsData = Meteor.users.find({ _id: { $in: instructorsIds } }).fetch();
      }
    }
    else {
      isBusy = false;
    }
  }
  return {
    isBusy,
    classData,
    instructorsData,
    instructorsIds,
    classTypeData,
    classTimeData,
    schoolData
  };
}, withPopUp(ClassDetailsContainer));

