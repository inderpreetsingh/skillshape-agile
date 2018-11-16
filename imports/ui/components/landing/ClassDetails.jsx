import React, { Component } from "react";
import ClassDetails from "/imports/ui/components/landing/components/classDetails/index.jsx";
import { classModulesData, classTimeData } from "/imports/ui/components/landing/constants/classDetails/";
import { createContainer } from 'meteor/react-meteor-data';
import { withPopUp } from '/imports/util';
import Classes from "/imports/api/classes/fields";
import {get,isEmpty} from 'lodash';
class ClassDetailsContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { currentUser, isUserSubsReady,classData,instructorsData ,popUp} = this.props;
    return (
      <ClassDetails
        topSearchBarProps={{
          currentUser,
          isUserSubsReady
        }}
        headerProps={{
          classTypeCoverSrc: "",
          schoolCoverSrc: ""
        }}
        timeLineProps={{
          startTime: classTimeData.startTime,
          totalEventTime: classTimeData.totalEventTime,
          classModulesData: classModulesData
        }}
        classTimeInformationProps={{ ...classTimeData }}
        classData = {classData}
        instructorsData = {instructorsData}
        popUp = {popUp}
      />
    );
  }
}

export default createContainer((props) => {
  const {state} = props.location.state;
  const dataProps =  props.location.state.props;
  let schoolId,classTypeId,classTimeId,scheduled_date,classesSubscription,classData,instructorsIds,
  instructorsData = [],userSubscription;
  schoolId = state.school._id;
  classTimeId = dataProps.eventData.classTimeId;
  classTypeId = dataProps.eventData.classTypeId;
  scheduled_date = new Date(state.classTimes.startDate);
  filter = {schoolId,classTypeId,classTimeId,scheduled_date};
  classesSubscription = Meteor.subscribe('classes.getClassesData',filter);
  if( classesSubscription &&  classesSubscription.ready()){
   classData = Classes.find().fetch();
   instructorsIds = get(classData[0],'instructors',[])
   if(!isEmpty(instructorsIds)){
    userSubscription = Meteor.subscribe('user.getUsersFromIds',instructorsIds);
    if(userSubscription && userSubscription.ready()){
      instructorsData = Meteor.users.find().fetch();
    }
  }
  }
	return {
  classData,
  instructorsData
	};
}, withPopUp(ClassDetailsContainer));

