import React from "react";
import { createContainer } from 'meteor/react-meteor-data';
import ClassTimesDetailsRender from './classTimesDetailsRender';
import ClassTimes from "/imports/api/classTimes/fields";

class ClassTimeDetails extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	        showClassTimeForm: false
	    }
	}

	hideAddClassTimesForm = () => {
	    this.setState({
	        showClassTimeForm: false
	    })
	}

	render() {
    	return ClassTimesDetailsRender.call(this, this.props, this.state)
  	}
}

export default createContainer(props => {
 	const { schoolId, classTypeId } = props;
 	
 	Meteor.subscribe("classTimes.getclassTimes", {schoolId, classTypeId});
 	let classTimesData = ClassTimes.find({ schoolId, classTypeId},{sort: {_id: -1}}).fetch();
 	console.log("classTimesData --->>>",classTimesData);
 	return {
  		...props,
  		classTimesData,
  		classTypeId,
  	}

}, ClassTimeDetails);