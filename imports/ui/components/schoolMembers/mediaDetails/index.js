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

export default createContainer(props => {
  console.log("container props===>",props);
    let { schoolId} = props.schoolData && props.schoolData._id;
    let collectionData = [];
    let mediaSubscription;
    if (schoolId) {
        mediaSubscription = Meteor.subscribe("media.getMedia", {schoolId, limit:limit});
        collectionData = Media.find({schoolId}).fetch();
    }
  console.log("mediaSubscription===>",mediaSubscription);
  console.log("collectionData===>",collectionData);
    return { ...props,
        collectionData,
        mediaSubscriptionReady: mediaSubscription && mediaSubscription.ready()
    };
}, SchoolMemberMedia);
// export default SchoolMemberMedia;