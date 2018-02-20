import React from "react";

import SchoolMemberMediaRender from "./schoolMemberMediaRender";
import MediaDetails from "/imports/ui/components/schoolView/editSchool/mediaDetails";

class SchoolMemberMedia extends MediaDetails {

  constructor(props){
    super(props);
    this.state = {}
  }

  render() {
    console.log("111111111111111111111",this)
    return SchoolMemberMediaRender.call(this, this.props, this.state);
  }

}

export default SchoolMemberMedia;