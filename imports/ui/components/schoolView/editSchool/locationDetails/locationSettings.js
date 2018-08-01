import React from "react";
import LocationForm from "./locationForm";
import RoomForm from "./roomForm";

export default (locationSettings = {
  mainPanelHeader: {
    leftIcon: "location_on",
    title: "Locations",
    titleKey: ["address", "city", "country"],
    notes: "",
    showImageUpload: false,
    showAddressOnMap: true,
    actions: {
      component: LocationForm,
      buttonTitle: "ADD LOCATION",
      onSubmit: "addLocation",
      title: "Location",
      formFields: [
        { key: "title", label: "Location Name", type: "text", required: false },
        {
          key: "address",
          label: "Street Address",
          type: "text",
          required: true
        },
        { key: "city", label: "City", type: "text", required: true },
        { key: "state", label: "State", type: "text", required: false },
        { key: "zip", label: "Zip Code", type: "text", required: true },
        { key: "country", label: "Country", type: "text", required: true }
      ]
    }
  },
  mainTable: {
    title: "Location",
    tableFields: [
      { key: "title", label: "Location Name" },
      { key: "address", label: "Street Address" },
      { key: "city", label: "City" },
      { key: "state", label: "State" },
      { key: "zip", label: "Zip Code" },
      { key: "country", label: "Country" }
    ],
    actions: {
      label: "Actions",
      havingImage: false,
      toggleChildTable: true,
      edit: {
        component: LocationForm,
        title: "Edit Location",
        onSubmit: "editLocation",
        editByField: "_id",
        formFields: [
          {
            key: "title",
            label: "Location Name",
            type: "text",
            required: false
          },
          {
            key: "address",
            label: "Street Address",
            type: "text",
            required: true
          },
          { key: "city", label: "City", type: "text", required: true },
          { key: "state", label: "State", type: "text", required: false },
          { key: "zip", label: "Zip Code", type: "text", required: true },
          { key: "country", label: "Country", type: "text", required: true }
        ]
      },
      delete: "removeLocation",
      del: {
        title: "Delete Location",
        onSubmit: "location.removeLocation"
      }
    }
  },
  childPanelHeader: {
    leftIcon: "business",
    title: "Room",
    havingImage: false,
    notes: "Rooms with this location",
    actions: {
      component: RoomForm,
      parentKey: "_id",
      buttonTitle: "Add Room",
      onSubmit: "addRoom",
      title: "Room",
      formFields: [
        { key: "name", label: "Name", type: "text", required: true },
        { key: "capicity", label: "Capacity", type: "text", required: false }
      ]
    }
  },
  childTable: {
    title: "Room",
    tableFields: [
      { key: "name", label: "Name" },
      { key: "capicity", label: "Capacity" }
    ],
    actions: {
      parentKey: "_id",
      label: "Actions",
      havingImage: false,
      toggleChildTable: false,
      edit: {
        component: RoomForm,
        onSubmit: "editRoom",
        title: "Edit Room",
        editByField: "id",
        formFields: [
          { key: "name", label: "Name", type: "text", required: true },
          { key: "capicity", label: "Capacity", type: "text", required: false }
        ]
      },
      delete: "removeRoom",
      del: {
        onSubmit: "location.removeRoom",
        title: "Delete Room"
      }
    }
  }
});
