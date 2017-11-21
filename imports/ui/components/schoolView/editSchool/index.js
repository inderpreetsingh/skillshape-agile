import React from "react";
import { createContainer } from 'meteor/react-meteor-data';
import SchoolEditRender from "./schoolEditRender";
import { browserHistory} from 'react-router';

class SchoolEditView extends React.Component {

	constructor(props) {
    super(props);
    this.state = {
    	selecetdView : "school_details",
    };
  }

  checkSchoolAccess = (currentUser, schoolId) => {
    if(!currentUser || !schoolId) 
      browserHistory.push("/")
    else if(checkMyAccess({user: currentUser,schoolId})) 
      return
    else if(currentUser.profile && currentUser.profile.schoolId && (currentUser.profile.schoolId != schoolId) || !currentUser.profile || !currentUser.profile.schoolId) 
      browserHistory.push("/")
  }

  moveTab = (tabId) => this.refs[tabId].click();

  showFormBuilderModal = (type, formFields, formFieldsValues, headerTitle, callApi) => {
    console.log("<<<< showEditModal >>>>>",formFields, formFieldsValues, headerTitle)
    this.setState({ 
      formBuilderModal: {
        formFields: formFields,
        formFieldsValues: formFieldsValues,
        modalType: type,
        headerTitle: headerTitle,
        callApi: callApi
      }
    })
  }
  
  render() {
    return SchoolEditRender.call(this, this.props, this.state)
  }
  
}

export default createContainer(props => {
 	const { schoolId } = props.params;

 	Meteor.subscribe("UserSchool", schoolId);
 	Meteor.subscribe("salocation");
  Meteor.subscribe("classtype");
  Meteor.subscribe("SkillType");
  Meteor.subscribe("SkillClassbySchool", schoolId);
  Meteor.subscribe("MonthlyPricing", schoolId);
  Meteor.subscribe("ClassPricing", schoolId);

  let schoolData = School.findOne({_id: schoolId})
  let locationData = SLocation.find({ schoolId: schoolId })

  return {
  	...props,
    schoolId,
  	schoolData,
    locationData, 
  };

}, SchoolEditView);