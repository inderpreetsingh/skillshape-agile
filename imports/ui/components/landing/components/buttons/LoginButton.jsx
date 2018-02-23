import React, {Component,Fragment} from 'react';
import { isEmpty, get } from 'lodash';
import PropTypes from 'prop-types';
import SecondaryButton from './SecondaryButton.jsx';
import LoginDialogBox from '../dialogs/LoginDialogBox.jsx';
import { emailRegex, toastrModal } from '/imports/util';
import { browserHistory } from 'react-router';

class LoginButton extends Component {

    constructor(props){
        super(props);
        this.state = this.initializeState();
    }

    componentWillMount() {
        Events.on("loginAsSchoolAdmin", "123456", (data) => {
            this.handleLoginModalState(true, data);
        })
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

    handleLoginModalState = (state, data) => {
        let stateObj = this.initializeState();
        stateObj.loginModal = state;
        if(data) {
            stateObj.redirectUrl = data.redirectUrl;
        }
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
        let redirectUrl;
        if (this.state.redirectUrl) {
            redirectUrl = this.state.redirectUrl;
        }
        this.setState({ loading: true })
        Meteor.loginWithPassword(this.state.email, this.state.password, (err, res) => {
            let stateObj = { ...this.state };

            stateObj.loading = false;
            if (err) {
                stateObj.error.message = err.reason || err.message
            } else {
                stateObj.error = {};
                let emailVerificationStatus = get(Meteor.user(), "emails[0].verified", false)

                if(!emailVerificationStatus) {
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
                    browserHistory.push('/');
                }
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

    reSendEmailVerificationLink = ()=> {
        Meteor.call("user.sendVerificationEmailLink", this.state.email, (err, res)=> {
            if(err) {
                let errText = err.reason || err.message;
                toastr.error(errText, "Error");
            }
            if(res) {
                this.setState({
                    loginModal: false
                }, () => {
                    toastr.success(
                        "We send a email verification link, Please check your inbox!!",
                        "success"
                    );
                })
            }
        })
    }

    render() {
        const {loginModal,error,isBusy} = this.state;
        const {icon,fullWidth,iconName,currentUser} = this.props;
        // console.log("LoginButton props -->>>",this.props);
        console.log("LoginButton state -->>>",this.state);
        return(
            <Fragment>
                <SecondaryButton
                    noMarginBottom
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
                        reSendEmailVerificationLink={this.reSendEmailVerificationLink}
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

export default toastrModal(LoginButton);
