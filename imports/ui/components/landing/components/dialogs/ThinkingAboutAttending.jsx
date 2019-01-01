import ClearIcon from 'material-ui-icons/Clear';
import Checkbox from "material-ui/Checkbox";
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import { FormControl, FormControlLabel } from "material-ui/Form";
import IconButton from 'material-ui/IconButton';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import React from 'react';
import styled from "styled-components";
import muiTheme from '../jss/muitheme.jsx';
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { mobile } from "/imports/ui/components/landing/components/jss/helpers.js";
import { ContainerLoader } from '/imports/ui/loading/container';
import ClassTypePackages from './classTypePackages.jsx';
import Button from 'material-ui/Button';
import Events from "/imports/util/events";
import SignUpDialogBox from "/imports/ui/components/landing/components/dialogs/SignUpDialogBox.jsx";
import TermsOfServiceDialogBox from "/imports/ui/components/landing/components/dialogs/TermsOfServiceDialogBox.jsx";
import EmailConfirmationDialogBox from "/imports/ui/components/landing/components/dialogs/EmailConfirmationDialogBox";
import { get, isEmpty } from "lodash";
const ButtonWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;
const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  width: 100%;
  font-size: 30px;
`;

const InputWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const styles = {
  dialogAction: {
    width: '100%'
  },
  dialogActionsRoot: {
    [`@media screen and (max-width: ${mobile}px)`]: {
      flexWrap: "wrap",
      justifyContent: "center"
    }
  }, dialogTitle: {
    borderTop: `5px solid #4caf50`
  },
  StyleForButton: {
    fontFamily: helpers.specialFont,
    fontSize: helpers.baseFontSize,
    backgroundColor: '#4caf50',
    border: '1px solid',
    borderColor: helpers.primaryColor,
    color: 'black',
    textTransform: 'none',
    fontWeight: 500,
    height: '100%',
    marginRight: helpers.rhythmDiv,
    '&:hover': {
      backgroundColor: 'white',
    }

  }
}
const TextWrapper = styled.div`
    text-align: center;
    font-size: 15px;
    font-weight: 500;
   `;
const ErrorWrapper = styled.span`
    color: red;
    float: right;
`;
const labelValue = ['Add this class to my calendar.', 'Sign me up for notification of class time or location changes.',
  'Sign me up for emails from the school about this class.']
class ThinkingAboutAttending extends React.Component {
  constructor(props) {
    super(props);
    const { addToCalendar, notification } = this.props;
    this.state = { checkBoxes: [true, true, true], classTypePackages: false, packagesRequired: 'perClassAndMonthly' }
  }
  componentWillMount() {
    Events.on("loginAsUser", "123456", data => {
      this.handleLoginModalState(true, data);
    });
    Events.on("registerAsSchool", "123#567", data => {
      let { userType, userEmail, userName } = data;
      this.handleSignUpDialogBoxState(true, userType, userEmail, userName);
    });
    this.isEnrollmentPurchase(this.props.enrollmentIds);
  }
  componentWillReceiveProps(nextProps) {
    !isEmpty(nextProps) && this.isEnrollmentPurchase(nextProps.enrollmentIds);
  }

  handleSignUpDialogBoxState = (state, userType, userEmail, userName) => {
    this.setState({
      signUpDialogBox: state,
      userData: { userType: userType },
      userEmail: userEmail,
      userName: userName,
      errorText: null
    });
  };
  handleSignUpSubmit = (payload, event) => {
    event && event.preventDefault();
    let obj = {};
    if (!payload.name || !payload.email) {
      obj.errorText = "* fields are mandatory";
    } else if (!payload.captchaValue) {
      obj.errorText = "You can't leave Captcha empty";
    } else {
      obj.errorText = null;
      obj.termsOfServiceDialogBox = true;
      obj.userData = { ...this.state.userData, ...payload };
    }
    this.setState(obj);
  };
  handleServiceAgreementSubmit = () => {
    this.setState({ emailConfirmationDialogBox: true });
  };
  isEnrollmentPurchase = (enrollmentIds) => {
    if (!isEmpty(enrollmentIds)) {
      Meteor.call("purchases.getPurchasedFromPackageIds", enrollmentIds, Meteor.userId(), (err, res) => {
        if (isEmpty(res)) {
          this.setState({ packagesRequired: 'enrollment' });
        }
        else if (!isEmpty(res)) {
          this.setState({ packagesRequired: 'perClassAndMonthly' });
        }
      })
    }
  }
  handleEmailConfirmationSubmit = () => {
    this.setState({ isBusy: true });
    const { popUp } = this.props;
    Meteor.call(
      "user.createUser",
      { ...this.state.userData, signUpType: "skillshape-signup" },
      (err, res) => {
        let modalObj = {
          open: false,
          signUpDialogBox: false,
          termsOfServiceDialogBox: false,
          emailConfirmationDialogBox: false,
          isBusy: false
        };
        if (err) {
          modalObj.errorText = err.reason || err.message;
          modalObj.signUpDialogBox = true;
          this.setState(modalObj);
        }

        if (res) {
          this.setState(modalObj, () => {
            popUp.appear("success", {
              content: "Successfully registered, Please check your email."
            });
          });
        }
      }
    );
  };

  handleTermsOfServiceDialogBoxState = state => {
    this.setState({ termsOfServiceDialogBox: state });
  };

  handleEmailConfirmationDialogBoxState = state => {
    this.setState({ emailConfirmationDialogBox: state });
  };
  unsetError = () => this.setState({ errorText: null });
  handleLoginGoogle = () => {
    let self = this;
    this.setState({ loading: true });
    Meteor.loginWithGoogle({}, function (err, result) {
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
      function (err, result) {
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
  closeClassTypePackages = () => {
    this.setState({ classTypePackages: false });
  }
  render() {
    const { checkBoxes, classTypePackages, packagesRequired } = this.state;
    const { open, onModalClose, addToCalendar,
      handleClassClosed, handleCheckBoxes, purchaseThisPackage, name, schoolId, params, classTypeId } = this.props;
    return (
      <MuiThemeProvider theme={muiTheme}>
        <Dialog
          title="Select Package"
          open={open}
          onClose={onModalClose}
          onRequestClose={onModalClose}
          aria-labelledby="Thinking About Attending"
        >
          {this.state.emailConfirmationDialogBox && (
            <EmailConfirmationDialogBox
              open={this.state.emailConfirmationDialogBox}
              schoolEmail={get(this.state, "userData.email")}
              onModalClose={() =>
                this.handleEmailConfirmationDialogBoxState(false)
              }
              onDisAgreeButtonClick={() =>
                this.handleEmailConfirmationDialogBoxState(false)
              }
              onAgreeButtonClick={this.handleEmailConfirmationSubmit}
              isLoading={this.state.isBusy}
            />
          )}

          {this.state.termsOfServiceDialogBox && (
            <TermsOfServiceDialogBox
              open={this.state.termsOfServiceDialogBox}
              onModalClose={() => this.handleTermsOfServiceDialogBoxState(false)}
              onAgreeButtonClick={this.handleServiceAgreementSubmit}
            />
          )}
          {this.state.signUpDialogBox && (
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
          )}
          {this.props.isLoading && <ContainerLoader />}
          {classTypePackages && <ClassTypePackages
            schoolId={schoolId}
            open={classTypePackages}
            onClose={() => this.setState({ classTypePackages: false })}
            params={params}
            classTypeId={classTypeId}
            packagesRequired={packagesRequired}
            closeClassTypePackages={this.closeClassTypePackages}
          />}
          <DialogTitle classes={{ root: this.props.classes.dialogTitle }}>
            <DialogTitleWrapper>
              About Attending {name && name}

              <IconButton color="primary" onClick={() => { onModalClose() }}>
                <ClearIcon />
              </IconButton >
            </DialogTitleWrapper>
          </DialogTitle>
          <DialogContent style={{ fontSize: '18px' }}>
            {checkBoxes.map((i, index) => {
              return (<FormControl fullWidth margin="dense">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkBoxes[index]}
                      onChange={(e) => {
                        let old = checkBoxes;
                        old[index] = e.target.checked;
                        this.setState({ checkBoxes: old })
                      }}
                      value={index}
                    />
                  }
                  label={labelValue[index]}
                />
              </FormControl>)
            })}
            <TextWrapper> To attend you must purchase a class package.</TextWrapper>
          </DialogContent>
          <DialogActions classes={{ root: this.props.classes.dialogActionsRoot }}>
            <ButtonWrapper>
              <FormGhostButton
                darkGreyColor
                onClick={onModalClose}
                label="Close!"
              />
            </ButtonWrapper>
            <ButtonWrapper>
              <FormGhostButton
                onClick={() => {

                  if (addToCalendar == 'closed') {
                    handleClassClosed();
                  }
                  else {
                    handleCheckBoxes(checkBoxes);
                  }
                }}
                label={"Join but Purchase Later"}
              />
            </ButtonWrapper>
            <ButtonWrapper>
              <Button
                onClick={() => { this.setState({ classTypePackages: true }) }}
                classes={{ root: this.props.classes.StyleForButton }}
              >
                Purchase Package Now
		                        </Button>
              {/* <FormGhostButton
                                onClick={purchaseThisPackage}
                                label="Purchase Package Now"
                            /> */}
            </ButtonWrapper>


          </DialogActions>

        </Dialog>
      </MuiThemeProvider>
    )
  }
}


export default withStyles(styles)(ThinkingAboutAttending);
