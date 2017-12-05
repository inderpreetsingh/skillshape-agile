import React from "react";
import {createContainer} from 'meteor/react-meteor-data';
import MapViewRender from './mapViewRender';
import SkillClassListBase from '../skillClassList/skillClassListBase';
import { initializeMap, setMarkersOnMap } from '/imports/util';
import Events from '/imports/util/events';
import ClassType from "/imports/api/classType/fields";

class MapView extends SkillClassListBase {

	constructor(props){
    	super(props);
    	this.state = {
    		classType: [],
    		school: {},
    		skillClass: [],
    	}
	}

	componentWillMount() {
		Events.on("getSeletedSchoolData", "43434",(data) => {
      		this.getSeletedSchoolData(data);
    	})
	}

	componentDidMount() {
      	this.map = initializeMap()
	}

	componentWillReceiveProps(nextProps) {
		setMarkersOnMap(this.map, this.props.sLocation)
	}

	getSeletedSchoolData = ({classType = [], school = {}, skillClass = []}) => {
		// console.log("getSeletedSchoolData fn called-->>",classType,school,skillClass);
		this.setState({
			school,
			classType,
			skillClass
		});
	}

	render(){
		return MapViewRender.call(this, this.props, this.state)
	}
}

export default createContainer(props => {
	// console.log("MapView createContainer --->>>",props);
	const { query } = props.location;
	let subscription;
	let sLocation = [];

	if(query && query.NEPoint && query.SWPoint) {
		// console.log("start search.....")
		let NEPoint = query.NEPoint.split(",").map(Number)
		let SWPoint = query.SWPoint.split(",").map(Number)
		
		subscription = Meteor.subscribe("school.getSchoolByGeoBound", {NEPoint, SWPoint, zoomLevel: parseInt(query.zoom)});
		// console.log("sLocation count -->>",sLocation);
	}

	if(subscription && subscription.ready()) {
		// console.log("VVVVVVVVVV",SLocation.find().count())
		// console.log("school count -->>",school);
		// classType = ClassType.find().fetch()
		sLocation = SLocation.find().fetch()
	}
	// console.log("sLocation", sLocation);
	return { 
		...props, 
		sLocation,
	};
}, MapView);