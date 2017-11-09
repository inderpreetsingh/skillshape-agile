import React from 'react';
import { checkSuperAdmin } from '/imports/util';
import Events from 'react-native-simple-events';

export default class SchoolViewBase extends React.Component {

  constructor(props){
    super(props);
  }

  checkUserAccess = (currentUser,ownerUserId) => {
  	console.log("checkUserAccess -->>",currentUser,ownerUserId)
  	if(checkSuperAdmin(currentUser) || (currentUser && currentUser._id == ownerUserId))
  		return true;
  	return false;
  }

  claimASchool = (currentUser) => {
  	if(currentUser) {
  		setTimeout(function() {
        if(checkSuperAdmin(currentUser)){

        } else {
          if(currentUser.profile && currentUser.profile.schoolId && currentUser.profile.schoolId.length > 1) {
            toastr.error("You already manage a school. You cannot claim another School. Please contact admin for more details","Error");
          } else {
            
            let claimRequest = ClaimRequest.find().fetch()
            if(claimRequest && claimRequest.length> 0) {
              toastr.info("We are in the process of resolving your claim. We will contact you as soon as we reach a verdict or need more information. Thanks for your patience.","");
              return
            } 
          }
        }
      },1000);
  	} else {
      toastr.error("Please register yourself as an individual member before claiming your school","Error");
  		Meteor.setTimeout(() => {
        Events.trigger("join_school",{studentRegister: false, schoolRegister: true})
      }, 1000);
  	}
  }

  claimBtnCSS  = (currentUser, claimed) =>{
    if(currentUser && currentUser.profile && currentUser.profile.schoolId && currentUser.profile.schoolId.length > 1){
      return "btn-default"
    } else if(claimed == "Y"){
      return "btn-danger"
    } else {
      return "btn-success"
    }
  }
}