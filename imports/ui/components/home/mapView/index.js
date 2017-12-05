import React from "react";
import {createContainer} from 'meteor/react-meteor-data';
import MapViewRender from './mapViewRender';
import SkillClassListBase from '../skillClassList/skillClassListBase';
import { initializeMap, setMarkersOnMap } from '/imports/util';
import ClassType from "/imports/api/classType/fields";

class MapView extends SkillClassListBase {

	componentDidMount() {
      	this.map = initializeMap()
	}

	componentWillReceiveProps(nextProps) {
		setMarkersOnMap(this.map, this.props.sLocation)
	}

	render(){
		return MapViewRender.call(this, this.props, this.state)
	}
}

export default createContainer(props => {
	console.log("MapView createContainer --->>>",props);
	const { query } = props.location;
	let subscription;
	let sLocation = [];
	let classType = [];

	if(query && query.NEPoint && query.SWPoint && parseInt(query.zoom) >= 15) {
		console.log("start search.....")
		let NEPoint = query.NEPoint.split(",").map(Number)
		let SWPoint = query.SWPoint.split(",").map(Number)
		
		subscription = Meteor.subscribe("school.getSchoolByGeoBound", {NEPoint, SWPoint});
		// console.log("sLocation count -->>",sLocation);
	}

	if(subscription && subscription.ready()) {
		// console.log("VVVVVVVVVV",SLocation.find().count())
		// console.log("school count -->>",school);
		classType = ClassType.find().fetch()
		sLocation = SLocation.find().fetch()
	}
	console.log("sLocation", sLocation);
	console.log("classType", classType);
	return { 
		...props, 
		sLocation,
		classType,
	};
}, MapView);