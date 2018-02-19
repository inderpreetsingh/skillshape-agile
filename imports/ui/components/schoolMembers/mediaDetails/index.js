import React from "react";
// import { createContainer } from 'meteor/react-meteor-data';

import SchoolMemberMediaRender from "./schoolMemberMediaRender";

class SchoolMemberMedia extends React.Component {

  constructor(props){
    super(props);
    this.state = {}
  }

  render() {
    return SchoolMemberMediaRender.call();
  }

}
export default SchoolMemberMedia;