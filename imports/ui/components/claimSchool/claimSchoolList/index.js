import React from "react";
import {createContainer} from 'meteor/react-meteor-data';
import ClaimSchoolListRender from "./claimSchoolListRender";

class ClaimSchoolList extends React.Component {
  render() {
    return ClaimSchoolListRender.call(this, this.props, this.state)
  }
}

export default createContainer(props => {
  Meteor.subscribe("School");
  let dataForSchoolList = School.find().fetch();
  console.log("dataForSchoolList isssssss = ", props);
  applyFilter = (filter) => {
    dataForSchools = School.find(filter).fetch();
  };
  return {...props, dataForSchoolList, applyFilter};
}, ClaimSchoolList );
