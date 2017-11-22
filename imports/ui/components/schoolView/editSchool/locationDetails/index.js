import React from 'react';
import LocationDetailsRender from './locationDetailsRender';

export default class LocationDetails extends React.Component {

	constructor(props) {
    super(props);
    
  }

  onSubmit = (payload, callApi) => {
    console.log("<<<< onFormBuilderModalSubmit >>>>>",payload, callApi)
    if(!callApi && !payload && !Meteor.userId()) {
    	toastr.error("Something went wrong.","Error");
    	return
    }

    switch(callApi) {
    	case("addLocation") : 
    	 this.addLocation(payload)
    	 return

    	case("editLocation") : 
    	 this.editLocation(payload)
    	 return

    	case("addRoom") : 
    	  this.addRoom(payload)
    	 return
    }
  }

  addLocation = (payload) => {
    const { schoolId } = this.props;
    console.log("addLocation payload -->>>",payload)
    console.log("addLocation payload schoolId-->>>",schoolId)
    
    let locationObj = {};
    locationObj.createdBy = Meteor.userId();
    locationObj.schoolId = schoolId;
    locationObj.title = payload.title;
    locationObj.address = payload.address;
    locationObj.city = payload.city;
    locationObj.neighbourhood = payload.neighbourhood;
    locationObj.state = payload.state;
    locationObj.zip = payload.zip;
    locationObj.country = payload.country;
    
  	console.log("final locationObj -->>",locationObj)
  }

  editLocation = () => {
  	alert("Implementation pending !!!")
  }

  addRoom = () => {
  	alert("Implementation pending !!!")
  }

  render() {
    return LocationDetailsRender.call(this, this.props, this.state)
  }
}  