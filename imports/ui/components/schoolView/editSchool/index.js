import React from "react";
import { createContainer } from 'meteor/react-meteor-data';
import SchoolEditRender from "./schoolEditRender";
import { browserHistory} from 'react-router';

// import collection definition over here
import Modules from "/imports/api/modules/fields";
import Skills from "/imports/api/skill/fields";
import SLocation from "/imports/api/sLocation/fields";

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

  showFormBuilderModal = ({type, tableData, formFieldsValues, parentData}) => {
    console.log("<<<< showEditModal >>>>>",parentData)
    this.setState({
      formBuilderModal: {
        modalType: type,
        tableData: tableData,
        formFieldsValues: formFieldsValues,
        parentData: parentData,
      }
    }, ()=>{
      console.log("this.formBuilderModal show -->>",this.formBuilderModal);
      this.formBuilderModal.show();
    })
  }

  render() {
    return SchoolEditRender.call(this, this.props, this.state)
  }

}

export default createContainer(props => {
 	const { schoolId } = props.params;

  if(props.isUserSubsReady) {
   	Meteor.subscribe("UserSchool", schoolId);
   	Meteor.subscribe("salocation");
    Meteor.subscribe("classtype");
    Meteor.subscribe("SkillType");
    Meteor.subscribe("SkillClassbySchool", schoolId);
    Meteor.subscribe("modules.getModules", {schoolId});
  }


  let schoolData = School.findOne({_id: schoolId});
  let locationData = SLocation.find({ schoolId: schoolId }).fetch();
  let moduleData = Modules.find({ schoolId: schoolId }).fetch();

  /*Find skills to make this container reactive on skill
  other wise skills are joined with collections using package
  perak:joins */
  Skills.find().fetch()
  /*****************************************************/

  return {
  	...props,
    schoolId,
  	schoolData,
    locationData,
    moduleData,
  };

}, SchoolEditView);