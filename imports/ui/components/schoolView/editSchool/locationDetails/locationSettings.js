import React from "react";

export default locationSettings = {
  mainPanelHeader : {
  	leftIcon: "assignment",
  	title: "Locations",
  	rightButtonTitle: "ADD LOCATION",
  },
  mainTable: {
   title: "Location", 
   tableFields: [
 		{ key: "title", label: "Location Name", type: "text", required: true},
 		{ key: "address", label: "Street Address", type: "text", required: true},
 		{ key: "city", label: "City", type: "text", required: true},
 		{ key: "neighbourhood", label: "Neighborhood", type: "text", required: true},
 		{ key: "state", label: "State", type: "text", required: false},
 		{ key: "zip", label: "Zip Code", type: "text", required: true}
  ],
   actions: {
    label: "Actions",
    toggleChildTable : true,
    edit: true,
    delete: true,
   },
   submit: {
      add: "addLocation",
      edit: "editLocation",
   }
  },
  childPanelHeader : {
  	title: "",
  },
  childTable : {
    title: "Room",
    tableFields: [
      {key: "name", label: "Name"},
      {key: "capicity", label: "Capacity"},
    ],
    actions: {
      label: "Actions",
      toggleChildTable : false,
      edit: true,
      delete: true,
    },
    submit: {
      add: "addRoom",
      edit: "addRoom",
   }
  }
 }