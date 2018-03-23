import React from "react";
import {createContainer} from 'meteor/react-meteor-data';
import MapViewRender from './mapViewRender';
import SkillClassListBase from '../skillClassList/skillClassListBase';
import { initializeMap, setMarkersOnMap, reCenterMap } from '/imports/util';
import Events from '/imports/util/events';
import ClassType from "/imports/api/classType/fields";
import SLocation from "/imports/api/sLocation/fields";

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
      	this.map = initializeMap(this.props.filters.coords)
	}

	componentWillReceiveProps(nextProps) {
		let locationDiff = _.difference(this.props.filters.coords, nextProps.filters.coords);
		if(locationDiff && locationDiff.length > 0) {
			this.map = reCenterMap(this.map, nextProps.filters.coords)
		}
		setMarkersOnMap(this.map, this.props.sLocation, nextProps.filters);
	}

	getSeletedSchoolData = ({school = {}}) => {
		console.log("getSeletedSchoolData fn called-->>",school);
		this.props.setSchoolIdFilter({schoolId: school._id})
	}

	render(){
		return MapViewRender.call(this, this.props, this.state)
	}
}

export default createContainer(props => {
	console.log("MapView createContainer --->>>",props);
	const { query } = props.location;
	let subscription;
	let sLocation = SLocation.find().fetch()
	return { 
		...props, 
		sLocation,
	};
}, MapView);