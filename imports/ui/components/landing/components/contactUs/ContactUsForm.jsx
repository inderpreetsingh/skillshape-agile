import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { browserHistory } from "react-router";

import { withStyles } from "material-ui/styles";
import Radio, { RadioGroup } from "material-ui/Radio";
import { FormLabel, FormControl, FormControlLabel } from "material-ui/Form";

import { withPopUp ,confirmationDialog} from "/imports/util";
import { ContainerLoader } from "/imports/ui/loading/container.js";

import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import IconInput from "/imports/ui/components/landing/components/form/IconInput.jsx";

import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const styles = {
  radioGroupWrapper: {
    margin: 0,
    marginTop: helpers.rhythmDiv * 3,
    paddingLeft: helpers.rhythmDiv,
    [`@media screen and (max-width: ${helpers.mobile + 100}px)`]: {
      width: "auto"
    }
  },
  radioGroupNoMarginTop: {
    marginTop: 0
  },
  radioLabelRoot: {
    marginRight: helpers.rhythmDiv * 3
  },
  radioLabelOther: {
    marginBottom: 0,
    transform: "translateY(4px)"
  },
  radioLabelRootZeroMargin: {
    marginRight: 0
  },
  radioLabel: {
    fontSize: helpers.baseFontSize,
    [`@media screen and (max-width: ${helpers.mobile + 50}px)`]: {
      fontSize: 14
    }
  },
  radioLabelMarginBottom: {
    marginBottom: helpers.rhythmDiv * 2
  },
  radioButton: {
    height: helpers.rhythmDiv * 3,
    width: helpers.rhythmDiv * 3,
    marginRight: helpers.rhythmDiv
  },
  radioButtonGroup: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    [`@media screen and (max-width: ${helpers.mobile + 100}px)`]: {
      justifyContent: "flex-start"
    },
    [`@media screen and (max-width: ${helpers.mobile}px)`]: {
      flexDirection: "column"
    }
  },
  formLabel: {
    fontWeight: 400,
    color: `rgba(0,0,0,0.87)`,
    cursor: "pointer"
  },
  radioButtonOther: {
    width: 36,
    transform: "translateY(4px)"
  }
};

const FormElementWrapper = styled.div`
  width: 100%;
  display: ${props => (props.show ? "block" : "none")};
`;

/*
const LabelOrInput = props => (
  <Fragment>
    <FormElementWrapper show={!props.label}>
      <FormLabel
        for="other"
        onClick={props.onLabelClick}
        className={props.classes.formLabel}
      >
        {props.inputValue || "Something else"}
      </FormLabel>
    </FormElementWrapper>
    <FormElementWrapper show={props.label}>
      <IconInput
        autoFocus={true}
        onRef={props.onRef}
        inputId="subject"
        labelText=""
        value={props.inputValue}
        onChange={props.onChange}
      />
    </FormElementWrapper>
  </Fragment>
);
*/
const FormWrapper = styled.div`
  padding: ${helpers.rhythmDiv * 2}px;
  padding-bottom: 0;
  max-width: 600px;
  min-width: 540px;
  width: 100%;
  display: flex;
  justify-content: center;
  border: 2px solid #ccc;

  @media screen and (max-width: ${helpers.tablet + 50}px) {
    margin-bottom: ${helpers.rhythmDiv * 4}px;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    margin-bottom: ${helpers.rhythmDiv * 2}px;
  }

  @media screen and (max-width: ${helpers.mobile + 50}px) {
    min-width: 0;
  }
`;

const Form = styled.form`
  width: 86%;
  margin: 0 auto;

  @media screen and (max-width: ${helpers.mobile + 100}px) {
    width: 100%;
  }
`;

const FormGroup = styled.div`
  display: flex;
  align-items: baseline;
  width: calc(100% + 12px);
  transform: translateX(-12px);
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const SubmitButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: ${helpers.rhythmDiv * 4}px 0;
`;

const ButtonWrapper = styled.div`
  width: 200px;
`;

const InputWrapper = styled.div`
  width: 100%;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

class ContactUsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      name: "",
      email: "",
      subject: "Something Else",
      message: "",
      radioButtonGroupValue: "feature",
      inputsName: ["email", "name", "message"],
      readyToSumit: false
    };
  }

  _validateAllInputs = (data, inputNames) => {
    for (let i = 0; i < inputNames.length; ++i) {
      if (data[inputNames[i]] == "") {
        return false;
      }
    }

    return true;
  };

  setInputRef = el => {
    this.otherMessageInput = el;
  };

  handleLabelClick = () => {
    this.otherMessageInput.focus();
    this.setState({
      radioButtonGroupValue: "other"
    });
  };

  handleInputFieldChange = fieldName => e => {
    this.setState({
      [fieldName]: e.target.value
    });

    if (this.props.onInputValueChange) {
      this.props.onInputValueChange(fieldName, e.target.value);
    }
  };

  handleRadioChange = (e, value) => {
    // debugger;
    this.setState({
      radioButtonGroupValue: e.target.value
    });

    if (this.props.onRadioButtonChange) {
      this.props.onRadioButtonChange(value);
    }
  };

  handleFormSubmit = e => {
    const { popUp } = this.props;
    e.preventDefault();

    let subject = this.state.subject;
    const name = this.state.name;
    const email = this.state.email;
    const message = this.state.message;
    const selectedOption = this.state.radioButtonGroupValue;
    const emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    // console.info(message,selectedOption,email,name);
    if (selectedOption !== "other") {
      subject = "";
    }
    if (this.state.readyToSumit) {
      //..
      if (!email) {
        popUp.appear("alert", { content: "Please enter your email." });
        return false;
      } else if (!emailReg.test(email)) {
        popUp.appear("alert", { content: "Please enter valid email address" });
        return false;
      } else if (!message) {
        popUp.appear("alert", { content: "Please enter a message." });
        return false;
      } else {
        // Start loading
        this.setState({ isLoading: true });

        Meteor.call(
          "sendfeedbackToAdmin",
          name,
          email,
          message,
          selectedOption,
          subject,
          (error, result) => {
            if (error) {
            } else {
              let data = {};
              data = {
                popUp,
                title: 'Success',
                type: 'success',
                content:"Thanks for providing your feedback" ,
                buttons: [{ label: 'Ok', onClick: () => {this.props.onModalClose() }, greyColor: true }]
              }
              confirmationDialog(data);
            }
            this.setState({ isLoading: false });
          }
        );
      }
    }
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

  render() {
    const { classes } = this.props;
    const { radioButtonGroupValue } = this.state;
    return (
      <FormWrapper>
        {this.state.isLoading && <ContainerLoader />}
        <Form onSubmit={this.handleFormSubmit}>
          <InputWrapper>
            <IconInput
              inputId="name"
              labelText="Your name"
              value={this.state.name}
              onChange={this.handleInputFieldChange("name")}
            />
          </InputWrapper>

          <InputWrapper>
            <IconInput
              inputId="email"
              type="email"
              labelText="Enter your email address"
              value={this.state.email}
              onChange={this.handleInputFieldChange("email")}
            />
          </InputWrapper>


          <FormControl
            component="fieldset"
            required
            classes={{ root: this.props.classes.radioGroupWrapper }}
          >
            <RadioGroup
              aria-label="contactRequest"
              name="contactRequest"
              value={radioButtonGroupValue}
              className={classes.radioButtonGroup}
              onChange={this.handleRadioChange}
            >
              <FormControlLabel
                classes={{
                  root:
                    classes.radioLabelRoot +
                    " " +
                    classes.radioLabelMarginBottom,
                  label: classes.radioLabel
                }}
                value="feature"
                control={<Radio classes={{ root: classes.radioButton }} />}
                label="Feature request"
              />
              <FormControlLabel
                classes={{
                  root:
                    classes.radioLabelRoot +
                    " " +
                    classes.radioLabelMarginBottom,
                  label: classes.radioLabel
                }}
                value="somethingBroken"
                control={<Radio classes={{ root: classes.radioButton }} />}
                label="Something broken"
              />
              <FormControlLabel
                classes={{
                  root:
                    classes.radioLabelRoot +
                    " " +
                    classes.radioLabelMarginBottom,
                  label: classes.radioLabel
                }}
                value="liked"
                control={<Radio classes={{ root: classes.radioButton }} />}
                label="I love it!"
              />
              <FormControlLabel
                classes={{
                  root:
                    classes.radioLabelRoot +
                    " " +
                    classes.radioLabelMarginBottom,
                  label: classes.radioLabel
                }}
                value="question"
                control={<Radio classes={{ root: classes.radioButton }} />}
                label="Question"
              />
              <FormControlLabel
                classes={{
                  root:
                    classes.radioLabelRootZeroMargin +
                    " " +
                    classes.radioLabelMarginBottom,
                  label: classes.radioLabel
                }}
                value="SomethingElse"
                control={<Radio classes={{ root: classes.radioButton }} />}
                label="Something Else"
              />
            </RadioGroup>
          </FormControl>

          {/* <FormGroup>
            <Radio
              checked={radioButtonGroupValue === "other"}
              onChange={this.handleRadioChange}
              value="other"
              name="other"
              className={classes.radioButtonOther}
            />
            <LabelOrInput
              onRef={this.setInputRef}
              classes={classes}
              inputValue={this.state.subject}
              label={radioButtonGroupValue === "other"}
              onLabelClick={this.handleLabelClick}
              onChange={this.handleInputFieldChange("subject")}
            />
          </FormGroup> */}

          <InputWrapper>
            <IconInput
              inputId="message"
              labelText="Your message goes here"
              multiline={true}
              value={this.state.message}
              onChange={this.handleInputFieldChange("message")}
            />
          </InputWrapper>

          <SubmitButtonWrapper>
            <ButtonWrapper>
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
          </SubmitButtonWrapper>
        </Form>
      </FormWrapper>
    );
  }
}

ContactUsForm.propTypes = {
  onInputValueChange: PropTypes.func,
  onRadioButtonChange: PropTypes.func
};

export default withStyles(styles)(withPopUp(ContactUsForm));
