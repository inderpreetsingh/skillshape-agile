import React, { Component, Fragment } from "react";
import { isEmpty, get } from "lodash";
import PropTypes from "prop-types";
import { browserHistory } from "react-router";

import SecondaryButton from "/imports/ui/components/landing/components/buttons/SecondaryButton.jsx";
import LoginDialogBox from "/imports/ui/components/landing/components/dialogs/LoginDialogBox.jsx";
import { emailRegex } from "/imports/util";
import {withPopUp} from '/imports/util/withPopUp.js';

class LoginButton extends Component {
  constructor(props) {
    super(props);
    this.state = this.initializeState();
  }

  componentWillMount() {
    Events.on("loginAsSchoolAdmin", "123456", data => {
      this.handleLoginModalState(true, data);
    });
    Events.on("loginAsUser", "123456", data => {
      this.handleLoginModalState(true, data);
    });
  }

  initializeState = () => {
    return {
      error: {},
      loginModal: false,
      loginModalTitle: "",
      email: "",
      password: "",
      loading: false
    };
  };

  handleLoginModalState = (state, data) => {
    let stateObj = this.initializeState();
    stateObj.loginModal = state;
    if (data) {
      stateObj.loginModalTitle = data.loginModalTitle || "";
      stateObj.email = data.email || "";
      stateObj.redirectUrl = data.redirectUrl;
    }
    this.setState(stateObj);
  };

  handleInputChange = (inputName, event) => {
    if (inputName === "email") {
      const { error } = this.state;
      const email = event.target.value;
      error.email = false;
      if (!emailRegex.email.test(email)) {
        error.email = true;
      }
      this.setState({ error, email });
    } else if (inputName === "password") {
      this.setState({ password: event.target.value });
    }
  };

  onSignInButtonClick = event => {
    event.preventDefault();
    let redirectUrl;
    const { email, password } = this.state;
    let stateObj = { ...this.state };

    if (this.state.redirectUrl) {
      redirectUrl = this.state.redirectUrl;
    }

    if (email && password) {
      this.setState({ loading: true });
      Meteor.loginWithPassword(email, password, (err, res) => {
        stateObj.loading = false;
        if (err) {
          stateObj.error.message = err.reason || err.message;
        } else {
          stateObj.error = {};
          let emailVerificationStatus = get(
            Meteor.user(),
            "emails[0].verified",
            false
          );

          if (!emailVerificationStatus) {
            Meteor.logout();
            stateObj.showVerficationLink = true;
            stateObj.error.message = "Please verify email first. ";
          } else {
            stateObj.loginModal = false;
          }
          /*Admin of school was not login while clicking on `No, I will manage the school`
                    so in this case we need to redirect to school admin page that we are getting in query params*/
          if (redirectUrl) {
            browserHistory.push(redirectUrl);
          } else {
            browserHistory.push("/");
          }
        }
        this.setState(stateObj);
      });
    } else {
      stateObj.error.message = "Enter Password";
      if (!email) {
        stateObj.error.message = "Enter Email Address";
      }
      this.setState(stateObj);
    }
  };

  isLogin = () => {
    // check for user login or not
    if (isEmpty(this.props.currentUser)) {
      this.handleLoginModalState(true);
    } else {
      Meteor.logout();
      setTimeout(function() {
        browserHistory.push("/");
      }, 1000);
    }
  };

  handleLoginGoogle = () => {
    let self = this;
    this.setState({ loading: true });
    Meteor.loginWithGoogle({}, function(err, result) {
      let modalObj = {
        loginModal: false,
        loading: false,
        error: {}
      };
      if (err) {
        modalObj.error.message = err.reason || err.message;
        modalObj.loginModal = true;
      }
      self.setState(modalObj);
    });
  };

  handleLoginFacebook = () => {
    let self = this;
    this.setState({ loading: true });
    Meteor.loginWithFacebook(
      {
        requestPermissions: ["user_friends", "public_profile", "email"]
      },
      function(err, result) {
        let modalObj = {
          loginModal: false,
          loading: false,
          error: {}
        };
        if (err) {
          modalObj.error.message = err.reason || err.message;
          modalObj.loginModal = true;
        }
        self.setState(modalObj);
      }
    );
  };

  handleSignUpModal = () => {};

  reSendEmailVerificationLink = () => {
    this.setState({ loading: true });
    const {popUp} = this.props;
    Meteor.call(
      "user.sendVerificationEmailLink",
      this.state.email,
      (err, res) => {
        if (err) {
          let errText = err.reason || err.message;
          popUp.appear("error",{content: errText});
        }
        if (res) {
          this.setState(
            {
              loginModal: false,
              loading: false
            },
            () => {
              popUp.appear("success", {content: "We send a email verification link, Please check your inbox!!"});
            }
          );
        }
      }
    );
  };

  render() {
    const { loginModal, error, isBusy } = this.state;
    const { icon, fullWidth, iconName, currentUser } = this.props;
    return (
      <Fragment>
        <SecondaryButton
          noMarginBottom
          fullWidth={fullWidth}
          icon={currentUser ? false : true}
          iconName={iconName}
          onClick={this.isLogin}
          label={currentUser ? "Log Out" : "Log In"}
        />
        {loginModal &&
          !currentUser && (
            <LoginDialogBox
              {...this.state}
              open={loginModal}
              title={this.state.loginModalTitle}
              onModalClose={() => this.handleLoginModalState(false)}
              handleInputChange={this.handleInputChange}
              onSignInButtonClick={this.onSignInButtonClick}
              onSignUpButtonClick={this.handleSignUpModal}
              onSignUpWithGoogleButtonClick={this.handleLoginGoogle}
              onSignUpWithFacebookButtonClick={this.handleLoginFacebook}
              reSendEmailVerificationLink={this.reSendEmailVerificationLink}
            />
          )}
      </Fragment>
    );
  }
}

LoginButton.propTypes = {
  icon: PropTypes.bool,
  fullWidth: PropTypes.bool,
  iconName: PropTypes.string
};

LoginButton.defaultProps = {
  icon: false,
  fullWidth: false,
  iconName: "fingerprint"
};

export default withPopUp(LoginButton);
