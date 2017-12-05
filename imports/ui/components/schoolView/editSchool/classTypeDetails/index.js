import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ClassTypeDetailsRender from './classTypeDetailsRender';
import ClassType from "/imports/api/classType/fields";

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
  
  onDeleteRow = () => {
    alert('Not yet implemented!!!!')
  }

  render() {
    return ClassTypeDetailsRender.call(this, this.props, this.state)
  }
}  

export default createContainer(props => {
 	const { schoolId } = props;
 	
    Meteor.subscribe("classType.getclassType", {schoolId});

    let classTypeData = ClassType.find({ schoolId: schoolId }).fetch();

    console.log("classTypeData --->>",classTypeData)
 	return {
  		...props,
    	classTypeData,
  	}

}, ClassTypeDetails);