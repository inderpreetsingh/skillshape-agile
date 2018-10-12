import { isEmpty } from "lodash";
import ClearIcon from "material-ui-icons/Clear";
import Dialog, { DialogContent, DialogTitle, withMobileDialog } from "material-ui/Dialog";
import { FormControlLabel } from "material-ui/Form";
import IconButton from "material-ui/IconButton";
import Radio, { RadioGroup } from "material-ui/Radio";
import { MuiThemeProvider, withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import React, { Component, Fragment } from "react";
import styled from "styled-components";
import PrimaryButton from "../buttons/PrimaryButton";
import IconInput from "../form/IconInput.jsx";
import * as helpers from "../jss/helpers.js";
import muiTheme from "../jss/muitheme.jsx";
import { ContainerLoader } from "/imports/ui/loading/container.js";
import { withPopUp } from "/imports/util";
import Events from "/imports/util/events";
import { getUserFullName } from "/imports/util/getUserData";
import { openMailToInNewTab } from "/imports/util/openInNewTabHelpers";







const styles = theme => {
  return {
    dialogTitleRoot: {
      padding: `${helpers.rhythmDiv * 3}px ${helpers.rhythmDiv *
        3}px 0 ${helpers.rhythmDiv * 3}px`,
      marginBottom: `${helpers.rhythmDiv * 2}px`,
      "@media screen and (max-width : 500px)": {
        padding: `0 ${helpers.rhythmDiv * 3}px`
      }
    },
    dialogContent: {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
      flexShrink: 0,
      "@media screen and (max-width : 500px)": {
        minHeight: "150px"
      }
    },
    dialogActionsRoot: {
      padding: "0 8px",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      justifyContent: "flex-start"
    },
    dialogActions: {
      width: "100%",
      paddingLeft: `${helpers.rhythmDiv * 2}px`
    },
    dialogRoot: {
      maxWidth: "500px",
      overflow: "hidden",
      width: "100%"
    },
    iconButton: {
      height: "auto",
      width: "auto"
    },
    labelText: {
      display: "flex",
      alignItems: "flex-end",
      marginLeft: -14,
      marginRight: helpers.rhythmDiv * 2
    }
  };
};

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  font-family: ${helpers.specialFont};
  width: 100%;
`;

const ButtonWrapper = styled.div`
  ${helpers.flexCenter}
  margin: ${helpers.rhythmDiv * 4}px 0;
`;

const InputWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.span`
  display: inline-block;
  width: 100%;
  text-align: center;
`;

class ManageRequestsDialogBox extends Component {
  state = {
    isBusy: false,
    userExists: false,
    name: "",
    email: "",
    subscriptionRequest: "save",
    readyToSubmit: false,
    inputsName: ["name", "email"]
  };

  _getCollectionName = () => {
    const { requestFor } = this.props;

    if (requestFor == "price") {
      return "pricingRequest";
    } else if (requestFor == "location") {
      return "classTypeLocationRequest";
    } else {
      return "classTimesRequest";
    }
  };

  _getCompleteMethodName = methodName => {
    const collectionName = this._getCollectionName();
    return collectionName + "." + methodName;
  };

  handleChange = name => e => {
    this.setState({
      [name]: e.target.value
    });
  };

  handleRequest = text => {
    const { schoolData } = this.props;
    const userName = Meteor.userId
      ? getUserFullName(Meteor.user())
      : this.state.name;
    if (!isEmpty(schoolData)) {
      const ourEmail = schoolData.email;
      let emailBody = "";
      let subject = "",
        message = "";
      let url = `${Meteor.absoluteUrl()}schools/${schoolData.slug}`;
      let currentUserName = userName;
      // emailBody = `Hi, %0D%0A%0D%0A I saw your listing on SkillShape.com ${url} and would like to attend. Can you update your ${text ? text : pricing}%3F %0D%0A%0D%0A Thanks`
      emailBody = `Hi %0D%0A%0D%0A I saw your listing on SkillShape.com ${url} and would like to attend. Can you update your ${
        text ? text : pricing
      } %0D%0A%0D%0A Thanks`;
      const mailTo = `mailto:${ourEmail}?subject=${subject}&body=${emailBody}`;


      openMailToInNewTab(mailTo);
    }
  };

  handleFormSubmit = e => {
    e.preventDefault();
    const emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    const { popUp, requestFor, schoolData, classTypeId } = this.props;
    const subscriptionRequest = this.state.subscriptionRequest;
    const data = {
      name: this.state.name,
      email: this.state.email,
      schoolId: schoolData._id
    };

    if (classTypeId) {
      data.classTypeId = classTypeId;
    }

    const methodNameToCall = this._getCompleteMethodName("addRequest");
    const text = requestFor;

    if (this.state.readyToSubmit) {
      if (!data.email) {
        popUp.appear("alert",{title: 'No Email', content: "Please enter your email."},false);
        return false;
      } else if (!emailReg.test(data.email)) {
        popUp.appear("alert",{title: 'Invalid Email', content: "Please enter valid email address"},false);
        return false;
      } else if (!data.name) {
        popUp.appear("alert",{title: "Error" , content: "Please enter a name"}, false);
        return false;
      } else {
        const userExistsError = "user exists";
        this.setState({ isBusy: true });
        Meteor.call(methodNameToCall, data, subscriptionRequest, (err, res) => {
          this.setState({ isBusy: false }, () => {
            if (err && err.error === userExistsError) {
              Events.trigger("loginAsUser", {
                email: data.email,
                loginModalTitle: `We have ${
                  data.email
                } as registered user. kindly log in your account.`
              });
            } else if (err) {
              popUp.appear("alert",{title: "Error", content: err.reason || err.message}, false);
            } else if (res) {
              if (subscriptionRequest === "sign-up") {
                // User wants to join the skillshape now..
                Events.trigger("registerAsSchool", {
                  userType: "Student",
                  userEmail: this.state.email,
                  userName: this.state.name
                });
                this.handleRequest(text);
                this.props.onModalClose();
              } else {
                popUp.appear("success",{content: "Your request has been processed"});
                this.handleRequest(text);
              }
            }

            if (this.props.onFormSubmit) {
              this.props.onFormSubmit();
            }
          });
        });
      }
    } else if (this.state.readyToSubmit) {
      this.handleRequest(text);
    }
  };

  _validateAllInputs = (data, inputNames) => {
    for (let i = 0; i < inputNames.length; ++i) {
      if (data[inputNames[i]] == "") {
        return false;
      }
    }

    return true;
  };

  componentDidUpdate = () => {
    const readyToSubmit = this._validateAllInputs(
      this.state,
      this.state.inputsName
    );
    if (this.state.readyToSubmit !== readyToSubmit) {
      this.setState({ readyToSubmit: readyToSubmit });
    }
  };

  componentDidMount = () => {
    if (Meteor.userId()) {
      if (!this.state.userExists) this.setState({ userExists: true });
    }
    setTimeout(() => {
      let divElement = $("#manageDialog").offset();
      let offset = divElement.top;
      // send offset of modal to iframe script
      function sendTopOfPopup(e) {
        parent.postMessage(JSON.stringify({ popUpOpened: true, offset }), "*");
      }
      // Call sendTopOfPopup()
      sendTopOfPopup();
    }, 0);
  };

  render() {
    const { props } = this;
    return (
      <Fragment>
        {this.state.isBusy && <ContainerLoader />}
        <Dialog
          fullScreen={false}
          open={props.open}
          onClose={props.onModalClose}
          onRequestClose={props.onModalClose}
          aria-labelledby="manage requests"
          classes={{ paper: props.classes.dialogRoot }}
        >
          <MuiThemeProvider theme={muiTheme}>
            <div id="manageDialog">
              <DialogTitle classes={{ root: props.classes.dialogTitleRoot }}>
                <DialogTitleWrapper>
                  <Title>Request {props.title}</Title>
                  <IconButton
                    color="primary"
                    onClick={props.onModalClose}
                    classes={{ root: props.classes.iconButton }}
                  >
                    <ClearIcon />
                  </IconButton>
                </DialogTitleWrapper>
              </DialogTitle>

              <DialogContent classes={{ root: props.classes.dialogContent }}>
                <form onSubmit={this.handleFormSubmit}>
                  <InputWrapper stars>
                    <IconInput
                      inputId="name"
                      labelText="Your name"
                      value={this.state.name}
                      onChange={this.handleChange("name")}
                    />
                  </InputWrapper>

                  <InputWrapper>
                    <IconInput
                      inputId="message"
                      type="email"
                      labelText="Your email address"
                      value={this.state.email}
                      onChange={this.handleChange("email")}
                    />
                  </InputWrapper>

                  {!this.state.userExists && (
                    <InputWrapper>
                      <RadioGroup
                        aria-label="manage-request"
                        name="manage-request"
                        className={props.classes.subscriptionRequest}
                        value={this.state.subscriptionRequest}
                        onChange={this.handleChange("subscriptionRequest")}
                      >
                        <FormControlLabel
                          value="no-save"
                          control={<Radio />}
                          label="This is correspondence between you and school directly. We wont save your data"
                        />
                        <FormControlLabel
                          value="save"
                          control={<Radio />}
                          label="Stay updated on the classes you are interested. This will require we save your email address."
                        />
                        <FormControlLabel
                          value="sign-up"
                          control={<Radio />}
                          label="Join Skillshape to register for classes, manage your media, and connect with other members. (FREE Memebership!)"
                        />
                      </RadioGroup>
                    </InputWrapper>
                  )}

                  <ButtonWrapper>
                    {this.state.readyToSubmit ? (
                      <PrimaryButton
                        type="submit"
                        label={props.submitBtnLabel}
                        noMarginBottom
                        onClick={this.handleFormSubmit}
                      />
                    ) : (
                      <button
                        className="cancel-button increase-height"
                        disabled
                      >
                        {props.submitBtnLabel}
                      </button>
                    )}
                  </ButtonWrapper>
                </form>
              </DialogContent>
            </div>
          </MuiThemeProvider>
        </Dialog>
      </Fragment>
    );
  }
}

ManageRequestsDialogBox.propTypes = {
  onFormSubmit: PropTypes.func,
  requestFor: PropTypes.string,
  title: PropTypes.string,
  schoolData: PropTypes.object,
  classTypeName: PropTypes.string,
  submitBtnLabel: PropTypes.string
};

ManageRequestsDialogBox.defaultProps = {
  title: "Pricing",
  requestFor: "price",
  submitBtnLabel: "Request pricing"
};

export default withPopUp(
  withMobileDialog()(withStyles(styles)(ManageRequestsDialogBox))
);
