import React, { Component, Fragment } from 'react';
import MenuIconButton from './buttons/MenuIconButton.jsx';
import SignUpDialogBox from './dialogs/SignUpDialogBox.jsx';
import SideNavItems from './SideNavItems.jsx';
import { withPopUp,handleSignUpSubmit ,handleLoginFacebook,handleLoginGoogle} from '/imports/util';
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

    
   
    render() {
        const { currentUser, classes, ...otherProps } = this.props;
        const {isBusy} = this.state;
        return (
            <Fragment>
                {!currentUser && this.state.signUpDialogBox &&
                    <SignUpDialogBox
                        open={this.state.signUpDialogBox}
                        onModalClose={() => this.handleSignUpDialogBoxState(false)}
                        onSubmit={(payload,event)=>{handleSignUpSubmit.call(this,payload,event)}}
                        errorText={this.state.errorText}
                        unsetError={this.unsetError}
                        userName={this.state.userName}
                        userEmail={this.state.userEmail}
                        onSignUpWithGoogleButtonClick={()=>{handleLoginGoogle.call(this)}}
                        onSignUpWithFacebookButtonClick={()=>{handleLoginFacebook.call(this)}}
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
