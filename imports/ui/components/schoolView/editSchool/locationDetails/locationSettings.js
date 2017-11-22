import React from "react";

export default locationSettings = {
  mainPanelHeader : {
  	leftIcon: "assignment",
  	title: "Locations",
    actions : {
  	  buttonTitle: "ADD LOCATION",
      onSubmit: "addLocation",
      formFields: [
          { key: "title", label: "Location Name", type: "text", required: false},
          { key: "address", label: "Street Address", type: "text", required: true},
          { key: "city", label: "City", type: "text", required: true},
          { key: "neighbourhood", label: "Neighborhood", type: "text", required: false},
          { key: "state", label: "State", type: "text", required: false},
          { key: "zip", label: "Zip Code", type: "text", required: true}
        ] 
    }
  },
  mainTable: {
   title: "Location", 
   tableFields: [
 		{ key: "title", label: "Location Name"},
 		{ key: "address", label: "Street Address"},
 		{ key: "city", label: "City"},
 		{ key: "neighbourhood", label: "Neighborhood"},
 		{ key: "state", label: "State"},
 		{ key: "zip", label: "Zip Code"}
  ],
   actions: {
    label: "Actions",
    toggleChildTable : true,
    edit: {
      title: "Edit Location",
      onSubmit: "editLocation",
      formFields: [
        { key: "title", label: "Location Name", type: "text", required: false},
        { key: "address", label: "Street Address", type: "text", required: true},
        { key: "city", label: "City", type: "text", required: true},
        { key: "neighbourhood", label: "Neighborhood", type: "text", required: false},
        { key: "state", label: "State", type: "text", required: false},
        { key: "zip", label: "Zip Code", type: "text", required: true},
      ] 
    },
    delete: true,
   }
  },
  childPanelHeader : {
  	leftIcon: "add",
    title: "Room",
    actions : {
      buttonTitle: "Room",
      onSubmit: "addRoom",
      formFields: [
        { key: "name", label: "Name", type: "text", required: true},
        { key: "capicity", label: "Capacity", type: "text", required: true},
      ] 
    }
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
      edit: {
        onSubmit: "addRoom",
        title: "Edit Room",
        formFields: [
          { key: "name", label: "Name", type: "text", required: true},
          { key: "capicity", label: "Capacity", type: "text", required: true},
        ]
      },
      delete: true,
    }
  }
 }