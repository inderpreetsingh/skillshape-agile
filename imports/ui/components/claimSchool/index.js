import React from "react";
import { createContainer } from "meteor/react-meteor-data";
import Button from "material-ui/Button";
import { Link } from "react-router";
import Icon from "material-ui/Icon";
import { withStyles } from "material-ui/styles";
import ClaimSchoolBase from "./claimSchoolBase";
import ClaimSchoolRender from "./claimSchoolRender";
import SkillCategory from "/imports/api/skillCategory/fields";
import { withPopUp,confirmationDialog ,redirectToThisUrl,getUserFullName} from "/imports/util";
import {get} from 'lodash';
const styles = theme => ({
  sideButton: {
    fontWeight: 600,
    borderRadius: 10,
    backgroundColor: "#ca1e1e",
    color: "white",
    marginRight: 18
  },
  textStyle: {
    fontSize: 20,
    width: 700,
    marginLeft: 18
  }
});

// console.log("styles",styles);

class ClaimSchool extends ClaimSchoolBase {
  handleClaimASchool = (schoolCardData, ) => {
    const { popUp } = this.props;
    const user = Meteor.user();
    const {_id:schoolId,name:schoolName,email:schoolEmail} = schoolCardData;
    let userEmail = get(user,'emails[0].address',get(user,'user.services.google.email','No Email Found'))
    let userName = getUserFullName(user);
    const {_id:userId} = user;
    const payload = {
      schoolId,
      schoolName,
      userId,
      userEmail,
      userName,
      schoolEmail,
      
    };
    // Start loading
    this.setState({ isLoading: true });
    Meteor.call(
      "claimSchoolRequest.createClaimSchoolRequest",
      payload,
      (err, result) => {
        // Stop Loading
        this.setState({ isLoading: false });
        if (result) {
          if (result.alreadyRejected) {
            popUp.appear('alert',{content:'Your request has been rejected to manage this school by school Admin.'});

          } else if (result.pendingRequest) {
            popUp.appear('alert',{content:'We are in the process of resolving your claim. We will contact you as soon as we reach a verdict or need more information. Thanks for your patience.'});

          } else if (result.alreadyManage) {
            popUp.appear('success',{content:'You already manage a school. You cannot claim another School. Please contact admin for more details.'});

          } else if (result.onlyOneRequestAllowed) {
            popUp.appear('alert',{content:`You are not allowed to do more than one request as you have already created request for School Name:${
              result.schoolName
            }`});
          } else if (result.emailSuccess) {
            popUp.appear('success',{content:'We have sent your request to school admin. We will assist you soon :)'});
          } else if (result.claimRequestApproved) {
            let url = `/SchoolAdmin/${ schoolCardData._id }/edit`;
            let data = {
              popUp,
              title: 'Success',
              type: 'success',
              content: `You have successfully claimed this school. Please click the button to manage your school!`,
              buttons: [{ label: 'Ok', onClick: () => { }, greyColor: true },{label:'Manage School',onClick:()=>{redirectToThisUrl(url)}}]
            };
            confirmationDialog(data);
          }
        }
      }
    );
  };

  render() {
    // console.log("this.props claimSchoolRender",this)
    return ClaimSchoolRender.call(this, this.props, this.state);
  }
}

export default createContainer(props => {
  Meteor.subscribe("skillCategory.get");
  let currentUser = Meteor.user();
  let dataForSkillTypes = SkillCategory.find().fetch();
  return { ...props, dataForSkillTypes, currentUser };
}, withStyles(styles, { withTheme: true })(withPopUp(ClaimSchool)));
