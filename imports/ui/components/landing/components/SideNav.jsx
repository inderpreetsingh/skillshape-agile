import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import get from 'lodash/get';

import SignUpDialogBox from './dialogs/SignUpDialogBox.jsx';
import ChangePasswordDialogBox from './dialogs/ChangePasswordDialogBox.jsx';
import MenuIconButton from './buttons/MenuIconButton.jsx';
import SideNavItems from './SideNavItems.jsx';
import TermsOfServiceDialogBox from './dialogs/TermsOfServiceDialogBox.jsx';
import EmailConfirmationDialogBox from './dialogs/EmailConfirmationDialogBox';
import Events from '/imports/util/events';
import { toastrModal } from '/imports/util';

class SideNav extends Component {

    state = {
        open: false,
        signUpDialogBox: false,
        termsOfServiceDialogBox: false,
        emailConfirmationDialogBox: false,
        userData: {},
        userName: '',
        userEmail: '',
        isBusy:false,
        errorText: null,
        changePasswordDialogBox:false
    }

    componentWillMount() {
        Events.on("registerAsSchool", "123#567",(data) => {
          let {userType, userEmail, userName} = data;
          //debugger;
          this.handleSignUpDialogBoxState(true, userType, userEmail, userName);
        })
        // This will listen if terms and services not accepted by User.
        Events.on("acceptTermsAndServices", "123#567",(data) => {
          let {userType} = data;
          this.handleTermsOfServiceDialogBoxState(true, userType);
        })
    }

    handleDrawerState = (state) => {
        this.setState({open: state});
    }

    unsetError = () =>  this.setState({errorText: null});

    handleSignUpDialogBoxState = (state, userType, userEmail, userName) => {
        this.setState({signUpDialogBox: state, userData: { userType: userType}, userEmail: userEmail, userName: userName, errorText: null});
    }
    handleChangePasswordDialogBoxState = (state,message) => {
        const { toastr } = this.props;
        if(message) {
            toastr.success(`${message}`,"success")
        }
        this.setState({changePasswordDialogBox: state});
    }

    handleTermsOfServiceDialogBoxState = (state) => {
        this.setState({termsOfServiceDialogBox: state});
    }

    handleEmailConfirmationDialogBoxState = (state) => {
        this.setState({emailConfirmationDialogBox: state});
    }

    toggleDrawerState = () => {
        this.setState({open: !this.state.open});
    }

    handleSignUpSubmit = (payload, event) => {
        event.preventDefault();
        let obj = {};
        if(!payload.name || !payload.email) {
            obj.errorText = "* fields are mandatory";
        } else if(!payload.captchaValue) {
            obj.errorText = "You can't leave Captcha empty";
        } else {
            obj.errorText = null;
            obj.termsOfServiceDialogBox = true;
            obj.userData = {...this.state.userData, ...payload};
        }
        this.setState(obj);
    }

    handleServiceAgreementSubmit = () => {
        this.setState({emailConfirmationDialogBox: true});
    }

    handleEmailConfirmationSubmit = () => {
        this.setState({isBusy: true});
        const { toastr } = this.props;
        Meteor.call("user.createUser", {...this.state.userData, signUpType: 'skillshape-signup'}, (err, res) => {
            // console.log("user.createUser err res -->>",err,res)
            let modalObj = {
                open: false,
                signUpDialogBox: false,
                termsOfServiceDialogBox: false,
                emailConfirmationDialogBox: false,
                isBusy: false,
            }
            if(err) {
                modalObj.errorText = err.reason || err.message;
                modalObj.signUpDialogBox = true;
                this.setState(modalObj)
            }

            if(res) {
                this.setState(modalObj, ()=> {
                    toastr.success("Successfully registered, Please check your email.","success");
                })
            }
        })
    }
    handleLoginGoogle = () => {
        let self = this;
        Meteor.loginWithGoogle({}, function(err,result) {
            let modalObj = {
                open: false,
                signUpDialogBox: false,
                termsOfServiceDialogBox: false,
                emailConfirmationDialogBox: false,
                isBusy: false,
            }
            if(err) {
                modalObj.errorText = err.reason || err.message;
                modalObj.signUpDialogBox = true;
            } else {
                Meteor.call("user.onSocialSignUp", {...self.state.userData}, (err, res) => {
                    if(err) {
                        modalObj.errorText = err.reason || err.message;
                        modalObj.signUpDialogBox = true;
                    }
                })
            }
            self.setState(modalObj)
        });
    }
    handleLoginFacebook = () => {
        let self = this;
        Meteor.loginWithFacebook({
            requestPermissions: ['user_friends', 'public_profile', 'email']
        }, function(err, result) {

            let modalObj = {
                open: false,
                signUpDialogBox: false,
                termsOfServiceDialogBox: false,
                emailConfirmationDialogBox: false,
                isBusy: false,
            }
            if (err) {
                modalObj.errorText = err.reason || err.message;
                modalObj.signUpDialogBox = true;
            } else {
                Meteor.call("user.onSocialSignUp", { ...self.state.userData }, (err, res) => {
                    if (err) {
                        modalObj.errorText = err.reason || err.message;
                        modalObj.signUpDialogBox = true;
                    }
                })
            }
            self.setState(modalObj)
        });
    }
    render() {
        const { currentUser, classes, ...otherProps } = this.props;
        // console.log("SideNav state -->>>",this.state);
        return (
            <Fragment>
                {!currentUser && this.state.signUpDialogBox &&
                    <SignUpDialogBox
                        open={this.state.signUpDialogBox}
                        onModalClose={() => this.handleSignUpDialogBoxState(false)}
                        onSubmit={this.handleSignUpSubmit}
                        errorText={this.state.errorText}
                        unsetError={this.unsetError}
                        userName={this.state.userName}
                        userEmail={this.state.userEmail}
                        onSignUpWithGoogleButtonClick={this.handleLoginGoogle}
                        onSignUpWithFacebookButtonClick={this.handleLoginFacebook}

                    />
                }
                {currentUser && this.state.changePasswordDialogBox &&
                    <ChangePasswordDialogBox
                        open={this.state.changePasswordDialogBox}
                        onModalClose={() => this.handleChangePasswordDialogBoxState(false)}
                        onSubmit={this.handleChangePasswordSubmit}
                        hideChangePassword = {(message) =>{this.handleChangePasswordDialogBoxState(false,message)}}
                    />
                }
                {
                    this.state.termsOfServiceDialogBox &&
                    <TermsOfServiceDialogBox
                        open={this.state.termsOfServiceDialogBox}
                        onModalClose={() => this.handleTermsOfServiceDialogBoxState(false)}
                        onAgreeButtonClick={this.handleServiceAgreementSubmit}
                    />
                }
                {
                    this.state.emailConfirmationDialogBox &&
                    <EmailConfirmationDialogBox
                        open={this.state.emailConfirmationDialogBox}
                        schoolEmail={get(this.state, "userData.email")}
                        onModalClose={() => this.handleEmailConfirmationDialogBoxState(false)}
                        onDisAgreeButtonClick={() => this.handleEmailConfirmationDialogBoxState(false)}
                        onAgreeButtonClick={this.handleEmailConfirmationSubmit}
                        isLoading={this.state.isBusy}
                    />
                }
                <MenuIconButton handleClick={this.toggleDrawerState} smallSize={this.props.smallSize}/>
                <SideNavItems
                    open={this.state.open}
                    handleDrawer={() => this.handleDrawerState(false)}
                    handleSignUpDialogBox={this.handleSignUpDialogBoxState}
                    showChangePassword={() => this.handleChangePasswordDialogBoxState(true)}
                    currentUser={currentUser}
                    {...otherProps}
                    
                    />
            </Fragment>
        )
    }
}

export default toastrModal(SideNav);
