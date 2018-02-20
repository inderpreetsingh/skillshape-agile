import React from "react";
import { createContainer } from 'meteor/react-meteor-data';

import SchoolMemberMediaRender from "./schoolMemberMediaRender";
import MediaDetails from "/imports/ui/components/schoolView/editSchool/mediaDetails";

class SchoolMemberMedia extends MediaDetails {

  constructor(props){
    super(props);
    this.state = {}
  }

  // closeMediaUpload = ()=>{
  //     this.setState({showCreateMediaModal: false, loading: false})
  //   }

  // handleUploadMedia = () => {
  //   console.log("handleUploadMedia");
  //   this.setState({showCreateMediaModal:true, mediaFormData: null, filterStatus: false})
  // }

  render() {
    console.log("111111111111111111111",this)
    return SchoolMemberMediaRender.call(this, this.props, this.state);
  }

}

export default SchoolMemberMedia;
// export default SchoolMemberMedia;