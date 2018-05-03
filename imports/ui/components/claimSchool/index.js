import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import Button from 'material-ui/Button';
import { Link } from 'react-router';
import Icon from 'material-ui/Icon';
import { withStyles } from "material-ui/styles";

import ClaimSchoolBase from "./claimSchoolBase";
import ClaimSchoolRender from "./claimSchoolRender";
import SkillCategory from "/imports/api/skillCategory/fields";

import { toastrModal } from '/imports/util';

const styles = theme => ({
  sideButton: {
    fontWeight: 600,
    borderRadius: 10,
    backgroundColor: '#ca1e1e',
    color: 'white',
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

    handleClaimASchool = (schoolCardData, confirmThis) => {
        confirmThis.cancelConfirmationModal();
        const { toastr} = this.props;
        const user = Meteor.user();
        const payload = {
            schoolId: schoolCardData._id,
            schoolName: schoolCardData.name,
            userId: user._id,
            userEmail: user.emails ? user.emails[0].address : user.services.google.email,
            userName: user.profile.firstName || user.profile.name,
            schoolEmail: schoolCardData.email
        };
        // Start loading
        this.setState({ isLoading: true });
        Meteor.call("school.claimSchoolRequest", payload, (err, result) => {
            // Stop Loading
            this.setState({ isLoading: false });
            if(result) {
                if (result.alreadyRejected) {
                    toastr.error(
                        "Your request has been rejected to manage this school by school Admin",
                        "Error"
                    );
                } else if (result.pendingRequest) {
                    toastr.error(
                        "We are in the process of resolving your claim. We will contact you as soon as we reach a verdict or need more information. Thanks for your patience.",
                        "Error"
                    );
                } else if (result.alreadyManage) {
                    toastr.success(
                        "You already manage a school. You cannot claim another School. Please contact admin for more details",
                        "success"
                    );
                } else if (result.onlyOneRequestAllowed) {
                    toastr.error(
                        `You are not allowed to do more than one request as you have already created request for School Name:${result.schoolName}`,
                        "Error"
                    );
                } else if (result.emailSuccess) {
                    toastr.success(
                        "We have sent your request to school admin. We will assist you soon :)",
                        "success"
                    );
                } else if (result.claimRequestApproved) {
                    toastr.success(
                       `You have successfully claimed this school. Please click the button to manage your school!`,
                       "success",
                        {
                            element: <div>
                                <br></br>
                                <Link style={{display: 'grid'}} target="_blank"  to={`${Meteor.absoluteUrl()}SchoolAdmin/${schoolCardData._id}/edit`}>
                                    <Button raised color="accent">
                                        Manage School <Icon>tag_faces</Icon>
                                    </Button>
                                </Link>
                            </div>
                        }
                    );
                }
            }
        });
    };

    render() {
        console.log("this.props claimSchoolRender",this)
        return ClaimSchoolRender.call(this, this.props, this.state)
    }

}

export default createContainer(props => {
    Meteor.subscribe('skillCategory.get');
    let currentUser = Meteor.user();
    let dataForSkillTypes = SkillCategory.find().fetch();
    return {...props, dataForSkillTypes,currentUser};
}, withStyles(styles,{ withTheme: true })(toastrModal(ClaimSchool)));
