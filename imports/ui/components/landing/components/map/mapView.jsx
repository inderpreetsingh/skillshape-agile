import React from "react";
import { createContainer } from 'meteor/react-meteor-data';
import styled from 'styled-components';
import { initializeMap, setMarkersOnMap, reCenterMap } from '/imports/util';
import Events from '/imports/util/events';
import config from '/imports/config';
import isMatch from 'lodash/isMatch';

import * as helpers from "../jss/helpers.js";

import ClassType from "/imports/api/classType/fields";
import SLocation from "/imports/api/sLocation/fields";

// fixed height causing slight issues in rendering
const MapContainer = styled.div`
    height: 100%;

    @media screen and (max-width: ${helpers.tablet + 100}px) {
      margin-left: 0;
    }
`;

class MapView extends React.Component {

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

	async componentDidMount() {
      /***
        Need to handle three cases:
         - if there is an address in the profile then it should show data according to profile address.
         - if there is no address in their profile then map view should open location according to IP.
         - if neither is available then it should go to Amsterdam (default location)
      */
      this.map = initializeMap(this.props.filters || config.defaultLocation);

      let currentUser = this.props.currentUser;
      let profileCoords;
      if(currentUser) {
      	profileCoords = currentUser.profile && currentUser.profile.coords;
      }
      let positionCoords;
      if(!profileCoords) {
      	// Geolocate
      	positionCoords = await this.getMyCurrentLocation();
      	reCenterMap(this.map,positionCoords);
      }
    }

	componentWillReceiveProps(nextProps) {
		let locationDiff = isMatch(this.props.filters.coords, nextProps.filters.coords);
		if(nextProps.filters.coords && !locationDiff) {
			this.map = reCenterMap(this.map, nextProps.filters.coords)
		}
		setMarkersOnMap(this.map, nextProps.sLocationData, nextProps.filters);
	}

	getMyCurrentLocation = (args) => {
        return new Promise((resolve, reject) => {
	        let positionCoords = [];
	        if (navigator) {
	            navigator.geolocation.getCurrentPosition((position) => {
	              let geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	              let latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	              let geocoder = new google.maps.Geocoder();
	              positionCoords.push(position.coords.latitude || config.defaultLocation[0]);
	              positionCoords.push(position.coords.longitude || config.defaultLocation[1]);
		          resolve(positionCoords);
	            }, (err) => {
	              const geolocationError = this._handleGeoLocationError(err);
	              toastr.error(geolocationError,'Error');
	          });
	        } else {
	        	reject();
	        }
        });
    }

	getSeletedSchoolData = ({school = {}}) => {
		this.props.setSchoolIdFilter({schoolId: school._id})
	}

	render(){
		return <MapContainer id="google-map" />
	}
}

export default MapView;
