import React, { Component, Fragment } from 'react';
import MenuIconButton from './buttons/MenuIconButton.jsx';
import SignUpDialogBox from './dialogs/SignUpDialogBox.jsx';
import SideNavItems from './SideNavItems.jsx';
import { withPopUp } from '/imports/util';
import Events from '/imports/util/events';


class SideNav extends Component {

    state = {
        open: false,
        signUpDialogBox: false,
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
        const { popUp } = this.props;
        if(message) {
            popUp.appear('success',{content:`${message}`});
        }
        this.setState({changePasswordDialogBox: state});
    }
    toggleDrawerState = () => {
        this.setState({open: !this.state.open});
    }

    handleSignUpSubmit = (payload, event) => {
        event.preventDefault();
        let obj = {};
        if(!payload.name || !payload.email) {
            obj.errorText = "* fields are mandatory";
        }
        else if(!payload.skillShapeTermsAndConditions){
            obj.errorText = 'Please agree to Terms & Conditions.'
        }
        else if(!payload.captchaValue) {
            obj.errorText = "You can't leave Captcha empty";
        }
        else {
            obj.errorText = null;
            obj.userData = {...this.state.userData, ...payload};
         }
         this.setState(obj);
         if(obj.errorText == null){
            this.setState({isBusy: true},()=>{
                const { popUp } = this.props;
            Meteor.call("user.createUser", {...obj.userData, signUpType: 'skillshape-signup'}, (err, res) => {
                // console.log("user.createUser err res -->>",err,res)
                let modalObj = {
                    open: false,
                    signUpDialogBox: false,
                    isBusy: false,
                }
                if(err) {
                    modalObj.errorText = err.reason || err.message;
                    modalObj.signUpDialogBox = true;
                    this.setState(modalObj)
                }
    
                if(res) {
                    this.setState(modalObj, ()=> {
                        popUp.appear('success',{content:"Successfully registered, Please check your email."})
                    })
                }
            })
            });
            
         }
    }
    handleLoginGoogle = () => {
        let self = this;
        Meteor.loginWithGoogle({}, function(err,result) {
            let modalObj = {
                open: false,
                signUpDialogBox: false,
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
        const {isBusy} = this.state;
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
                        isBusy = {isBusy}
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

export default withPopUp(SideNav);
