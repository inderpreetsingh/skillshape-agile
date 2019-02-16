import React, { Component ,lazy, Suspense,} from "react";
import { get, isEmpty, includes, remove,isEqual } from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';
const   ClassDetails  = lazy(()=>import("/imports/ui/components/landing/components/classDetails/index.jsx"))
import Preloader from "/imports/ui/components/landing/components/Preloader.jsx";
import { classModulesData, classTimeData } from "/imports/ui/components/landing/constants/classDetails/";
import { withPopUp } from '/imports/util';
import Classes from "/imports/api/classes/fields";
import ClassTime from '/imports/api/classTimes/fields.js';
import ClassType from '/imports/api/classType/fields';
import { coverSrc, classTypeImgSrc } from "/imports/ui/components/landing/site-settings.js";
import { ContainerLoader } from "/imports/ui/loading/container";

class ClassDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.state={}
  }
  // componentWillMount(){
  //   window.scroll({ top: 0, left: 0, behavior: 'auto' })
  // }
  getBgImage() {
    const { state: { school, classType } } = this.props.location.state;
    return get(classType, 'classTypeImg', get(classType, 'medium', get(school, 'mainImage', get(school, 'mainImageMedium', classTypeImgSrc))));
  }

  getLogoImage() {
    const { state: { school } } = this.props.location.state;
    return get(school, 'logoImg', get(school, "logoImgMedium", ""));
  }
  render() {
    const { currentUser, isUserSubsReady, classData, instructorsData, popUp, instructorsIds ,currentClassTypeData,isBusy} = this.props;
    // console.count('class Details Container 2')
    if(isBusy){
      return <ContainerLoader/>
    }
    return (
      <Suspense fallback={<ContainerLoader/>}>
      <ClassDetails
      currentClassTypeData = {currentClassTypeData}
        topSearchBarProps={{
          currentUser,
          isUserSubsReady
        }}
        headerProps={{
          bgImg: this.getBgImage(),
          logoImg: this.getLogoImage()
        }}
        timeLineProps={{
          startTime: classTimeData.startTime,
          totalEventTime: classTimeData.totalEventTime,
          classModulesData: classModulesData
        }}
        classTimeInformationProps={{ ...classTimeData }}
        classData={classData}
        instructorsData={instructorsData}
        popUp={popUp}
        instructorsIds={instructorsIds}
      />
      </Suspense>
    );
  }
}

export default createContainer((props) => {
  const { state } = props.location.state;
  const dataProps = props.location.state.props;
  let schoolId, classTypeId, classTimeId, scheduled_date, classesSubscription, classData, instructorsIds,
    instructorsData = [], userSubscription, classTimeSubscription, ClassTimeData;
  schoolId = state.school._id;
  classTimeId = state.eventData.classTimeId;
  classTypeId = state.eventData.classTypeId;
  filter = { _id: state.classDetails._id };
  let currentClassTypeData = {},classTypeSub;
  let isBusy = true;
  classesSubscription = Meteor.subscribe('classes.getClassesData', filter);
  if(classTypeId){
    classTypeSub = Meteor.subscribe("classType.getClassTypeWithIds",{classTypeIds:[classTypeId]});
  }
  if (classesSubscription && classesSubscription.ready() && classTypeSub && classTypeSub.ready()) {
   currentClassTypeData = ClassType.findOne({});
   classData = Classes.find().fetch();
    instructorsIds = get(classData[0], 'instructors', []);
    if (isEmpty(instructorsIds)) {
      classTimeSubscription = Meteor.subscribe('classTimes.getclassTimes', { schoolId, classTypeId });
      if (classTimeSubscription && classTimeSubscription.ready()) {
        ClassTimeData = ClassTime.find().fetch();
        instructorsIds = get(ClassTimeData[0], 'instructors', []);
        if(!isEmpty(instructorsIds)){
          userSubscription = Meteor.subscribe('user.getUsersFromIds', instructorsIds);
          if (userSubscription && userSubscription.ready()) {
            isBusy = false;
            instructorsData = Meteor.users.find({_id:{$in:instructorsIds}}).fetch();
           
          }
        }
        else{
          isBusy = false;
        }
      }

    }
    else if (!isEmpty(instructorsIds)) {
      userSubscription = Meteor.subscribe('user.getUsersFromIds', instructorsIds);
      if (userSubscription && userSubscription.ready()) {
        isBusy = false;
        instructorsData = Meteor.users.find({_id:{$in:instructorsIds}}).fetch();
      }
    }
    else{
      isBusy = false;
    }

  }
  return {
    isBusy,
    classData,
    instructorsData,
    instructorsIds,
    currentClassTypeData,
    ...props
  };
}, withPopUp(ClassDetailsContainer));

