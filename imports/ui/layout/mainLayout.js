import { get, isEmpty } from "lodash";
import { Meteor } from "meteor/meteor";
import { createContainer } from "meteor/react-meteor-data";
import React from "react";
import ContactUsFloatingButton from "/imports/ui/components/landing/components/buttons/ContactUsFloatingButton.jsx";
import TermsOfServiceDialogBox from "/imports/ui/components/landing/components/dialogs/TermsOfServiceDialogBox.jsx";
import { withPopUp } from "/imports/util";

class MainLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showBrandBarLogo: false,
      memberInvitation: true,
      previousLocationPathName: this.props.location.pathname,
      currentLocationPathName: this.props.location.pathname
    };
  }

  componentWillReceiveProps(nextProps) {
    // console.log("MainLayout componentWillReceiveProps",nextProps)
    let invite = get(nextProps, "location.query.acceptInvite");
    let inviteRejected = get(nextProps, "location.query.rejectInvite");
    // Handle Accept member invitation.
    if (
      nextProps.currentUser &&
      nextProps.isUserSubsReady &&
      invite === "true" &&
      this.state.memberInvitation
    ) {
      this.acceptMemberInvitation(nextProps.location.query);
    }
    // Handle Reject member invitation.
    if (
      nextProps.currentUser &&
      nextProps.isUserSubsReady &&
      inviteRejected === "true" &&
      this.state.memberInvitation
    ) {
      this.rejectMemberInvitation(nextProps.location.query);
    }

    /// NEED TO ACCESS PREVIOUS LOCATION ON LANDING PAGE
    this.setState(state => {
      return {
        ...state,
        previousLocationPathName: this.props.location.pathname,
        currentLocationPathName: nextProps.location.pathname
      };
    });
  }

  componentDidUpdate() {
    const { currentUser, isUserSubsReady } = this.props;

    let invite = get(this.props, "location.query.acceptInvite");
    // console.log("MainLayout componentDidUpdate -->>",this.props)
    if (invite && !currentUser && isUserSubsReady) {
      Events.trigger("loginAsSchoolAdmin", {
        redirectUrl: this.props.location.search
      });
    }
  }


  acceptMemberInvitation = invitationObj => {
    const { popUp } = this.props;
    // console.log("Landing acceptMemberInvitation")
    Meteor.call(
      "schoolMemberDetails.acceptInvitation",
      invitationObj,
      (err, res) => {
        // console.log("acceptMemberInvitation res",res,err)
        if (err) {
          let errorText = err.error || err.reason || err.message;
          this.setState({ memberInvitation: false }, () => {
            popUp.appear("alert", {
              title: "Member Invititation Failed!",
              content: errorText
            });
          });
        }

        if (res) {
          this.setState({ memberInvitation: false }, () => {
            popUp.appear("success", {
              content: "You successfully accepted the invitation."
            });
          });
        }
      }
    );
  };

  rejectMemberInvitation = invitationObj => {
    // console.log("Reject invitation");
    const { popUp } = this.props;
    Meteor.call(
      "schoolMemberDetails.rejectInvitation",
      invitationObj,
      (err, res) => {
        // console.log("acceptMemberInvitation res", res, err)
        if (err) {
          let errorText = err.error || err.reason || err.message;
          this.setState({ memberInvitation: false }, () => {
            popUp.appear("error", {
              title: "Invitation Rejection Failed!",
              content: errorText
            });
          });
        }

        if (res) {
          this.setState({ memberInvitation: false }, () => {
            popUp.appear("success", {
              content: "You have successfully rejected school invite."
            });
          });
        }
      }
    );
  };

  handleServiceAgreementClick = () => {
    Meteor.call("user.editUser", {
      doc: { term_cond_accepted: true },
      docId: this.props.currentUser._id
    });
  };

  render() {

    const { currentUser, isUserSubsReady, classes } = this.props;
    return (
      <div>
        {React.cloneElement(this.props.children, {
          currentUser: currentUser,
          routeDetails: this.props.location,
          previousLocationPathName: this.state.previousLocationPathName,
          currentLocationPathName: this.state.currentLocationPathName,
          isUserSubsReady: isUserSubsReady
        })}

        {isUserSubsReady &&
          currentUser &&
          !currentUser.term_cond_accepted && (
            <TermsOfServiceDialogBox
              open={!currentUser.term_cond_accepted}
              onModalClose={() =>
                alert("You can not cancel this service and agreement")
              }
              onAgreeButtonClick={this.handleServiceAgreementClick}
            />
          )}
        {!isEmpty(currentUser) &&
          (this.props.location.pathname.indexOf("embed") == -1 &&
            this.props.location.pathname !== "/contact-us") && (
            <ContactUsFloatingButton />
          )}
      </div>
    );
  }
}

export default createContainer(props => {
  const currentUser = Meteor.user();
  let userSubs = Meteor.subscribe("myInfo");
  let isUserSubsReady = userSubs.ready();
  return { ...props, currentUser, isUserSubsReady };
}, withPopUp(MainLayout));
