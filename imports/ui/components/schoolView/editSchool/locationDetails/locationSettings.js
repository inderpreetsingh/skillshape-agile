import React from "react";
import ButtonView from '/imports/ui/componentHelpers/panelWithTable/modalButtonForPanel';

export default locationSettings = {
  mainPanelHeader : {
  	leftIcon: "assignment",
  	title: "Locations",
  	rightButtonTitle: "ADD LOCATION"
  	// rightContent: <ButtonView title="Add Location" openModal="ted"/>,
  },
  mainTable: {
   tableFields: [
   		{key: "title", label: "Location Name"},
   		{key: "address", label: "Street Address"},
   		{key: "city", label: "City"},
   		{key: "neighbourhood", label: "Neighborhood"},
   		{key: "state", label: "State"},
   		{key: "zip", label: "Zip Code"}
   	],
   actions: {
    label: "Actions",
    toggleChildTable : true,
    edit: true,
    delete: true,
   }
  },
  childPanelHeader : {
  	title: "",
  	//rightContent: <ButtonComponent/>,
  },
  childTable : {
  
  }
 }