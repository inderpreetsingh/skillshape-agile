import React from 'react';
import LocationDetailsRender from './locationDetailsRender';

export default class LocationDetails extends React.Component {

	constructor(props) {
    super(props);
    
  }

  onSubmit = (payload, callApi) => {
    console.log("<<<< onFormBuilderModalSubmit >>>>>",payload, callApi)
    if(!callApi && !payload) {
    	toastr.error("Something went wrong.","Error");
    	return
    }

    switch(callApi) {
    	case("addLocation") : 
    	 this.addLocation(callApi)
    	 break

    	case("editLocation") : 
    	 this.editLocation(callApi)
    	 break

    	case("addRoom") : 
    	  this.addRoom(callApi)
    	 break
    }
  }

  addLocation = () => {
  	alert("Implementation pending !!!")
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