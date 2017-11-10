import React from 'react';
import { checkSuperAdmin, initializeMap } from '/imports/util';
import Events from '/imports/util/events';

export default class SchoolViewBase extends React.Component {

  constructor(props){
    super(props);
    this.state = {
    	showClaimSchoolModal: false
    }
  }

  componentDidUpdate() {
    initializeMap()
  }

  validateString = (value) => {
  	if (value)
    	return value;
    return "";
  }

  checkUserAccess = (currentUser,ownerUserId) => {
  	if(checkSuperAdmin(currentUser) || (currentUser && currentUser._id == ownerUserId))
  		return true;
  	return false;
  }

  claimASchool = (currentUser, schoolData) => {
  	if(currentUser) {
  		setTimeout(() => {
        if(checkSuperAdmin(currentUser)) {

        } else {
          if(currentUser.profile && currentUser.profile.schoolId && currentUser.profile.schoolId.length > 1) {
            toastr.error("You already manage a school. You cannot claim another School. Please contact admin for more details","Error");
          } else {
            
            let claimRequest = ClaimRequest.find().fetch()
            if(claimRequest && claimRequest.length> 0) {
              toastr.info("We are in the process of resolving your claim. We will contact you as soon as we reach a verdict or need more information. Thanks for your patience.","");
              return
            }
            if(schoolData.claimed == "Y") {
            	if(currentUser) {
            		// show modal over here
                return
              }
            } else {
            	// show modal over here
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

  getClassImageUrl = (classType, classImagePath) => {
  	let image = ClassType.findOne({_id:classType}).classTypeImg
    if(image && image.length) {
      return image
    } else if(classImagePath && classImagePath.length > 1) {
      return classImagePath;
    } else {
  		return "http://img.freepik.com/free-icon/high-school_318-137014.jpg?size=338c&ext=jpg";
    }
  }

  viewSchedule = (skillclass) => {
  	let str = "";
  	if(skillclass.isRecurring == "true" && skillclass.repeats) {
      let repeats = JSON.parse(skillclass.repeats);
      let repeat_details = repeats.repeat_details ||  [];
      str = "Start from "+repeats.start_date+"</br>"
      for (let i=0; i< repeat_details.length; i++) {
        const classLocation = SLocation.findOne({_id:repeat_details[i].location})
        str += "<b>"+repeat_details[i].day+"</b> "+repeat_details[i].start_time+" to "+repeat_details[i].end_time+" at "+this.validateString(classLocation.neighbourhood)+", "+classLocation.city +"</br>"
      }
    } else{
      const classLocation = SLocation.findOne({_id:skillclass.locationId})
      str = "Start from "+this.validateString(skillclass.plannedStart)+"  to "+this.validateString(skillclass.plannedEnd)+"</br>"+this.validateString(skillclass.planEndTime)+" to "+this.validateString(skillclass.planStartTime)+" at "+this.validateString(classLocation.neighbourhood)+", "+classLocation.city
    }
  	return str
  }

  getClassPrice = (classTypeId) => {
  	const classPrice = ClassPricing.findOne({classTypeId:{ '$regex': ''+classTypeId+'', '$options' : 'i' }})
  	if(classPrice && classPrice.cost) {
  		return `$${classPrice.cost}/Month`
  	}
  	return "";
  }
}