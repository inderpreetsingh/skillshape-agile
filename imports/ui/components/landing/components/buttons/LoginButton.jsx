import React, {Component,Fragment} from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import SecondaryButton from './SecondaryButton.jsx';
import LoginDialogBox from '../dialogs/LoginDialogBox.jsx';
import { emailRegex } from '/imports/util';
import { browserHistory } from 'react-router';

class LoginButton extends Component {

    constructor(props){
        super(props);
        this.state = this.initializeState();
    }

    initializeState = ()=> {
        return {
            loginModal : false,
            error: {},
            email: "",
            password: "",
            loading: false,
        }
    }

    handleLoginModalState = (state) => {
        let stateObj = this.initializeState();
        stateObj.loginModal = state;
        this.setState(stateObj)
    }

    handleInputChange = (inputName, event) => {
        if(inputName === "email") {
            const { error } = this.state;
            const email = event.target.value;
            error.email = false;
            if(!emailRegex.email.test(email)) {
                error.email = true;
            }
            this.setState({error, email})
        } else if(inputName === "password") {
            this.setState({password: event.target.value})
        }
    }

    onSignInButtonClick = () => {
        this.setState({loading: true})
        Meteor.loginWithPassword(this.state.email, this.state.password, (err, res) => {
            let stateObj = {...this.state};
            console.log("login response -->>",res);
            stateObj.loading = false;
            if(err) {
                stateObj.error.message = err.reason || err.message
            } else {
                stateObj.error = {};
                stateObj.loginModal = false;
                browserHistory.push('/');
            }
            this.setState(stateObj)
        })
    }

    isLogin = () => {
        // check for user login or not
        if(isEmpty(this.props.currentUser)) {
            this.handleLoginModalState(true)
        } else {
            Meteor.logout();
            setTimeout(function () {
              browserHistory.push('/');
            }, 1000);
        }
    }

    handleLoginGoogle = () => {
        let self = this;
        this.setState({loading: true});
        Meteor.loginWithGoogle({}, function(err,result) {

            let modalObj = {
                loginModal: false,
                loading: false,
                error: {},
            }
            if(err) {
                modalObj.error.message = err.reason || err.message;
                modalObj.loginModal = true;
            }
            self.setState(modalObj)
        });
    }

    handleLoginFacebook = () => {
        let self = this;
        this.setState({loading: true});
        Meteor.loginWithFacebook({
            requestPermissions: ['user_friends', 'public_profile', 'email']
        }, function(err, result) {

            let modalObj = {
                loginModal: false,
                loading: false,
                error: {},
            }
            if(err) {
                modalObj.error.message = err.reason || err.message;
                modalObj.loginModal = true;
            }
            self.setState(modalObj)
        });
    }

    handleSignUpModal = ()=> {
        console.log("handleSignUpModal!!!")
    }

    render() {
        const {loginModal,error,isBusy} = this.state;
        const {icon,fullWidth,iconName,currentUser} = this.props;
        // console.log("LoginButton props -->>>",this.props);
        // console.log("LoginButton state -->>>",this.state);
        return(
            <Fragment>
                <SecondaryButton
                    fullWidth={fullWidth}
                    icon={currentUser ? false : true}
                    iconName={iconName}
                    onClick={this.isLogin}
                    label={ currentUser ? "Log Out":"Log In"}
                />
                {
                    loginModal && !currentUser &&
                    <LoginDialogBox
                        {...this.state}
                        open={loginModal}
                        onModalClose={() => this.handleLoginModalState(false)}
                        handleInputChange={this.handleInputChange}
                        onSignInButtonClick={this.onSignInButtonClick}
                        onSignUpButtonClick={this.handleSignUpModal}
                        onSignUpWithGoogleButtonClick={this.handleLoginGoogle}
                        onSignUpWithFacebookButtonClick={this.handleLoginFacebook}
                    />
                }
            </Fragment>
        )
    }

}

LoginButton.propTypes = {
    icon: PropTypes.bool,
    fullWidth: PropTypes.bool,
    iconName: PropTypes.string
}

LoginButton.defaultProps = {
    icon: false,
    fullWidth: false,
    iconName: "fingerprint"
}

export default LoginButton;