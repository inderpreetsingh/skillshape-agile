import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ClassTypeDetailsRender from './classTypeDetailsRender';
import ClassType from "/imports/api/classType/fields";
import SkillSubject from "/imports/api/skillSubject/fields";
import SkillCategory from "/imports/api/skillCategory/fields";

class ClassTypeDetails extends React.Component {

	constructor(props) {
    super(props);
    this.state = {
        showClassTypeForm: false
    }
    
  }

  getChildTableData(parentData) {
  	return parentData.rooms;
  }
  
  hideAddClassTypeForm = () => {
    this.setState({
        showClassTypeForm: false
    })
  }

  onDeleteRow = () => {
    alert('Not yet implemented!!!!')
  }

  render() {
    return ClassTypeDetailsRender.call(this, this.props, this.state)
  }
}  

export default createContainer(props => {
 	const { schoolId, locationData } = props;
 	
    Meteor.subscribe("classType.getclassType", {schoolId});

    let classTypeData = ClassType.find({ schoolId: schoolId },{sort: {_id: -1}}).fetch();
    let skillSubjectData = SkillSubject.find().fetch(); 
    let skillCategoryData = SkillCategory.find().fetch(); 
    console.log("classTypeData --->>",classTypeData)
    console.log("skillSubjectData --->>",skillSubjectData)
    console.log("skillCategoryData --->>",skillCategoryData)
 	return {
  		...props,
    	classTypeData,
      locationData,
      skillCategoryData,
      skillSubjectData,
  	}

}, ClassTypeDetails);