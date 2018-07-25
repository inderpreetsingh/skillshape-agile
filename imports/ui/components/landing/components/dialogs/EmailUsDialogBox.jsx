import React, { Component } from "react";
import PropTypes from "prop-types";

import PrimaryButton from "../buttons/PrimaryButton";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import ClearIcon from "material-ui-icons/Clear";
import TextField from "material-ui/TextField";
import styled from "styled-components";
import Typography from "material-ui/Typography";

import IconInput from "../form/IconInput.jsx";

import { MuiThemeProvider } from "material-ui/styles";
import { withStyles } from "material-ui/styles";

import * as helpers from "../jss/helpers.js";
import muiTheme from "../jss/muitheme.jsx";
import { withPopUp } from "/imports/util";

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog
} from "material-ui/Dialog";

import { ContainerLoader } from "/imports/ui/loading/container";

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
      width: "100%"
    },
    iconButton: {
      height: "auto",
      width: "auto"
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

const DialogActionText = styled.p`
  margin: 0;
  margin-right: ${helpers.rhythmDiv}px;
  flex-shrink: 0;
`;

const ActionWrapper = styled.div`
  width: 100%;
  ${helpers.flexCenter} justify-content: flex-end;
`;

const InputWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const Title = styled.span`
  display: inline-block;
  width: 100%;
  text-align: center;
`;

const Text = styled.p`
  width: 100%;
  text-align: center;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
`;

const FocusedText = styled.span`
  font-weight: 300;
  font-style: italic;
`;

class EmailUsDialogBox extends Component {
  state = {
    subject: "",
    message: "",
    yourEmail: "",
    yourName: "",
    readyToSumit: false,
    inputsName: ["subject", "message", "yourEmail", "yourName"]
  };
  componentDidUpdate = () => {
    const readyToSumit = this._validateAllInputs(
      this.state,
      this.state.inputsName
    );
    if (this.state.readyToSumit !== readyToSumit) {
      this.setState({ readyToSumit: readyToSumit });
    }
  };

  handleInputFieldChange = fieldName => e => {
    this.setState({
      [fieldName]: e.target.value
    });
  };

  _validateAllInputs = (data, inputNames) => {
    // User is login then no need of their email and name in email us dialog box.
    if (Meteor.user()) {
      inputNames = _.without(inputNames, "yourName", "yourEmail");
    }
    for (let i = 0; i < inputNames.length; ++i) {
      if (data[inputNames[i]] == "") {
        return false;
      }
    }

    return true;
  };

  renderForNotLoginUser = () => {
    return (
      <div>
        <InputWrapper>
          <IconInput
            value={this.state.yourEmail}
            labelText="Your Email"
            onChange={this.handleInputFieldChange("yourEmail")}
            inputId="yourEmail"
            fullWidth
          />
        </InputWrapper>
        <InputWrapper>
          <IconInput
            value={this.state.yourName}
            labelText="Your Name"
            onChange={this.handleInputFieldChange("yourName")}
            inputId="yourName"
            fullWidth
          />
        </InputWrapper>
      </div>
    );
  };
  // Handle Email Us functionality from class type page.
  handleFormSubmit = e => {
    e.preventDefault();

    const { subject, message } = this.state;
    const name = this.state.name;
    const { popUp, schoolData } = this.props;

    let yourEmail = "";
    let yourName = "";
    if (!Meteor.user()) {
      yourEmail = this.state.yourEmail;
      yourName = this.state.yourName;
    }
    // const message = this.state.message;
    // const selectedOption = this.state.radioButtonGroupValue;
    const emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (this.state.readyToSumit) {
      if (!emailReg.test(yourEmail) && !Meteor.user()) {
        toastr.appear("alert",{content: "Please enter valid email address"});
        return false;
      } else {
        // Start loading
        this.setState({ isLoading: true });
        Meteor.call(
          "classType.handleEmailUsForSchool",
          subject,
          message,
          schoolData,
          yourEmail,
          yourName,
          (err, res) => {
            let stateObj = {};
            let errorMessage;
            let resultMessage;
            if (err) {
              errorMessage = err.reason || err.message;
              stateObj.error = errorMessage;
              // toastr.error(errorMessage, "Success");
            }
            if (res) {
              resultMessage = res.message;
              // toastr.success(res.message, "Success");
            }
            stateObj.isLoading = false;
            this.setState(stateObj);
            this.props.onModalClose(errorMessage, resultMessage);
          }
        );
      }
    }
    // const mailTo = `mailto:${this.props.ourEmail}?subject=${subject}&body=${message}`;
    // const mailToNormalized = encodeURI(mailTo);

    // if(this.props.onFormSubmit) {
    //   this.props.onFormSubmit();
    // }

    // window.location.href = mailToNormalized;
  };

  render() {
    const { props } = this;
    return (
      <Dialog
        fullScreen={props.fullScreen}
        open={props.open}
        onClose={props.onModalClose}
        onRequestClose={props.onModalClose}
        aria-labelledby="email us"
        classes={{ paper: props.classes.dialogRoot }}
      >
        <MuiThemeProvider theme={muiTheme}>
          <DialogTitle classes={{ root: props.classes.dialogTitleRoot }}>
            <DialogTitleWrapper>
              <Title>Email Us</Title>
              <IconButton
                color="primary"
                onClick={props.onModalClose}
                classes={{ root: props.classes.iconButton }}
              >
                <ClearIcon />
              </IconButton>
            </DialogTitleWrapper>
          </DialogTitle>
          {this.state.isLoading && <ContainerLoader />}
          <DialogContent classes={{ root: props.classes.dialogContent }}>
            <InputWrapper>
              <Text>
                You are emailing{" "}
                <FocusedText>{props.schoolData.website}</FocusedText> at{" "}
                <FocusedText>{props.schoolData.name}</FocusedText>
              </Text>
            </InputWrapper>
            <form onSubmit={this.handleFormSubmit} id="sendMessage">
              {!this.props.currentUser && this.renderForNotLoginUser()}
              <InputWrapper>
                <IconInput
                  inputId="to"
                  labelText="To"
                  value={this.props.ourEmail}
                  disabled
                />
              </InputWrapper>

              <InputWrapper>
                <IconInput
                  inputId="subject"
                  labelText="Subject"
                  value={this.state.subject}
                  onChange={this.handleInputFieldChange("subject")}
                />
              </InputWrapper>

              <InputWrapper>
                <IconInput
                  inputId="message"
                  labelText="Your message goes here"
                  multiline={true}
                  value={this.state.message}
                  onChange={this.handleInputFieldChange("message")}
                />
              </InputWrapper>

              <ButtonWrapper>
                {/*<PrimaryButton
                      type="submit"
                      label="Send Message"
                      noMarginBottom
                      formId="sendMessage"
                      onClick={this.handleFormSubmit}
                  />*/}
                {this.state.readyToSumit ? (
                  <PrimaryButton
                    fullWidth
                    type="submit"
                    noMarginBottom
                    label="Send Message"
                    onClick={this.handleFormSubmit}
                  />
                ) : (
                  <button
                    className="cancel-button full-width increase-height"
                    disabled
                  >
                    Send Message
                  </button>
                )}
              </ButtonWrapper>
            </form>
          </DialogContent>
        </MuiThemeProvider>
      </Dialog>
    );
  }
}

EmailUsDialogBox.propTypes = {
  onFormSubmit: PropTypes.func,
  onHandleInputChange: PropTypes.func,
  onModalClose: PropTypes.func,
  loading: PropTypes.bool
};

export default withMobileDialog()(
  withPopUp(withStyles(styles)(EmailUsDialogBox))
);
