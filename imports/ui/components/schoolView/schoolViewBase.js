import React from 'react';
import { checkSuperAdmin, initializeMap } from '/imports/util';
import Events from '/imports/util/events';
import { browserHistory, Link } from 'react-router';

// import collection definition over here
import ClassType from "/imports/api/classType/fields";
import ClassPricing from "/imports/api/classPricing/fields";
import SLocation from "/imports/api/sLocation/fields";

export default class SchoolViewBase extends React.Component {

  constructor(props){
    super(props);
    this.state = {}
  }

  componentDidUpdate() {
    // initializeMap()
  }

  validateString = (value) => {
  	if (value)
    	return value;
    return "";
  }

  // checkUserAccess = (currentUser,schoolId) => {
  //   return checkMyAccess({user: currentUser,schoolId});
  // }

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
              this.setState({claimRequestModal: true})
            	// show modal over here
              return
            } else {
              this.setState({claimSchoolModal: true,})
              return
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

  getClassName = (classTypeId) => {
    console.log("getClassName classTypeId-->>",classTypeId)
    if(!_.isEmpty(classTypeId)) {
      let str_name = []
      // let classTypeIds = classTypeId.split(",")
      let classTypeList = ClassType.find({_id:{$in:classTypeId}}).fetch();
      classTypeList.map((a) => { str_name.push(a.name)})
      return str_name.join(",")
    } else {
      return ""
    }
  }

  getImageMediaList = (mediaList, type) => {
    if(!mediaList) {
      return []
    } else {
      let size = 1;
      let imageList = []
      let return_list = []
      
      if(type == "Image") {
        mediaList.map((a) => { 
          if(a && a.mediaType) {

            if(a.mediaType.toLowerCase() == "Image".toLowerCase()) {
              imageList.push(a)
            }
          }
        })
      } else {
        mediaList.map((a) => { 
          if(a && a.mediaType) {

            if(a.mediaType.toLowerCase() != "Image".toLowerCase()) {
              imageList.push(a)
            }
          }
        })
      }

      for (var i=0; i< imageList.length; i+=size) {
        var smallarray = imageList.slice(i,i+size);
        return_list.push({"item":smallarray})
      }
      return return_list;
    }
  }

  checkClaim = (currentUser, schoolId) => {
    if(currentUser && currentUser.profile && currentUser.profile.schoolId === schoolId)
      return false;
    return true;
  }

  getPublishStatus = (isPublish) => {
    if(isPublish && isPublish === "Y")
      return true;
    return false;
  }

  handlePublishStatus = (schoolId, event) => {

    let publish_state = event.target.checked ? "Y" : "N"
    if(schoolId) {
      Meteor.call("school.publishSchool",schoolId,publish_state,(error, result) => {
        if(error){
          console.error("Error ->>", error);
        }
        if(result){
          console.log("Successfully updation")
        }
      });
    }
  }

  getClaimSchoolModalTitle = () => {
    const { claimSchoolModal, claimRequestModal, successModal } = this.state;
    if(claimSchoolModal) {
      return 'Are you sure You Claim this school?';
    } else if(claimRequestModal) {
      return 'This school is already claimed. Do you want to continue?';
    } else if(successModal) {
      return "Claim Status";
    }
  }

  modalClose = () => {
    this.setState({
      claimRequestModal: false, 
      claimSchoolModal: false,
      successModal: false
    })
  }

  modalSubmit = () => {
    const { claimSchoolModal,claimRequestModal, successModal } = this.state;
    const { currentUser, schoolId, schoolData } = this.props;
    
    if(claimSchoolModal && currentUser && currentUser._id && schoolId) {
      
      Meteor.call("school.claimSchool", currentUser._id, schoolId, (error, result) => {
        if(error) {
          console.error("error", error);
        }
        if(result) {
          // console.log("result", result);
          this.setState({successModal: true, claimSchoolModal: false})
        }
      })
    } else if(claimRequestModal && currentUser && currentUser._id && schoolId && schoolData) {
      
      const payload = {
        userId: currentUser._id,
        schoolId: schoolId,
        currentUserId: schoolData.userId,
        schoolName: schoolData.name,
        Status:"new"
      }
      
      Meteor.call("addClaimRequest", payload, (error, result) => {
       console.log(e);
        if(error) {
          console.error("error", error);
        }
        if(result) {
          console.log("result", result);
          toastr.success("You have requested to manage a school that has already been claimed. We will investigate this double claim and inform you as soon as a decision has been made. If you are found to be the rightful manager of the listing, you will be able to edit the school listing.","Success");
        }
      });
    } else if(successModal && schoolId) {
      this.setState({successModal: false})
      browserHistory.push(`/schoolAdmin/${schoolId}/edit`)
    }
  }

  checkOwnerAccess = (currentUser, userId) => {
    if(currentUser)
      return currentUser._id == userId
    return false;
  }

  checkForJoin = (currentUser, classId) => {
    if(currentUser && currentUser.profile && currentUser.profile.classIds)
      return currentUser.profile.classIds.includes(classId)
    return false;
  }
}