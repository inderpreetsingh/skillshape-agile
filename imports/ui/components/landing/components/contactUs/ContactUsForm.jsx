import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { browserHistory } from 'react-router';

import {withStyles} from 'material-ui/styles';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';

import { toastrModal } from '/imports/util';
import { ContainerLoader } from '/imports/ui/loading/container.js';

import PrimaryButton from '/imports/ui/components/landing/components/buttons/PrimaryButton.jsx';
import IconInput from '/imports/ui/components/landing/components/form/IconInput.jsx';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const styles = {
  radioGroupWrapper: {
    margin: 0,
    marginTop: helpers.rhythmDiv * 4,
    paddingLeft: helpers.rhythmDiv,
    [`@media screen and (max-width: ${helpers.mobile + 100}px)`] : {
      width: 'auto'
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
    transform: 'translateY(4px)'
  },
  radioLabelRootZeroMargin: {
    marginRight: 0
  },
  radioLabel: {
    fontSize: helpers.baseFontSize,
    [`@media screen and (max-width: ${helpers.mobile + 50}px)`] : {
      fontSize: 14
    }
  },
  radioLabelMarginBottom: {
    marginBottom: helpers.rhythmDiv * 2,
  },
  radioButton: {
    height: helpers.rhythmDiv * 3,
    width: helpers.rhythmDiv * 3,
    marginRight: helpers.rhythmDiv
  },
  radioButtonGroup: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap : 'wrap',
    justifyContent: 'space-between',
    [`@media screen and (max-width: ${helpers.mobile + 100}px)`] : {
      justifyContent: 'flex-start'
    },
    [`@media screen and (max-width: ${helpers.mobile}px)`] : {
      flexDirection: 'column'
    }
  },
}


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

  @media screen and (max-width : ${helpers.mobile + 100}px) {
    width: 100%;
  }
`;

const FormGroup = styled.div`
  display: flex;
  align-items: center;
  transform: translateY(-${helpers.rhythmDiv * 2}px)
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
  state = {
    isLoading: false,
    name: '',
    email: '',
    subject: '',
    message: '',
    radioButtonGroupValue: 'feature',
    inputsName: ['email','name','subject','message'],
    readyToSumit: false,
  }

  _validateAllInputs = (data, inputNames) => {

    for(let i = 0; i < inputNames.length; ++i) {
      if(data[inputNames[i]] == '') {
        return false;
      }
    }

    return true;
  }

  handleInputFieldChange = (fieldName) => (e) => {
    this.setState({
      [fieldName] : e.target.value
    });

    if(this.props.onInputValueChange) {
      this.props.onInputValueChange(fieldName,e.target.value);
    }
  }

  handleRadioChange = (e, value) => {
    this.setState({
      radioButtonGroupValue: value
    });

    if(this.props.onRadioButtonChange) {
        this.props.onRadioButtonChange(value);
    }
  }

  handleFormSubmit = (e) => {
    const {toastr} = this.props;
    e.preventDefault();

    const name = this.state.name;
    const email = this.state.email;
    const message = this.state.message;
    const subject = this.state.subject;
    const selectedOption = this.state.radioButtonGroupValue;
    const emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    // console.info(message,selectedOption,email,name);

    if(this.state.readyToSumit) {
      //..
      if (!email) {
          toastr.error('Please enter your email.', 'Error');
          return false;
      } else if (!emailReg.test(email)) {
          toastr.error("Please enter valid email address", "Error");
          return false;
      } else if (!message) {
          toastr.error("Please enter a message.", "Error");
          return false;
      }
      else {
          // Start loading
          this.setState({ isLoading: true });
          // console.log(name,email,message,subject,selectedOption<'....')
          Meteor.call('sendfeedbackToAdmin', name, email, message, selectedOption, subject, (error, result) => {
            if (error) {
                console.log("error", error);
            } else {
                toastr.success("Thanks for providing your feedback", "Success");
                if(!this.props.dialogBox) {
                  setTimeout(() => {
                    browserHistory.push(`/`);
                  }, 200);
                }
            }
            this.setState({ isLoading: false });
          });

        }
    }
  }

  componentDidUpdate = () => {
    const readyToSumit = this._validateAllInputs(this.state,this.state.inputsName);
    if(this.state.readyToSumit !== readyToSumit) {
      this.setState({ readyToSumit : readyToSumit});
    }
  }

  render() {
    const {classes} = this.props;
    return (
        <FormWrapper>
          {this.state.isLoading && <ContainerLoader />}
          <Form onSubmit={this.handleFormSubmit}>
            <InputWrapper>
              <IconInput inputId="name" labelText="Your name" value={this.state.name} onChange={this.handleInputFieldChange('name')}/>
            </InputWrapper>

            <InputWrapper>
              <IconInput inputId="email" type="email" labelText="Enter your email address" value={this.state.email} onChange={this.handleInputFieldChange('email')} />
            </InputWrapper>

            <FormControl component="fieldset" required classes={{root: this.props.classes.radioGroupWrapper}}>
              <RadioGroup
                  aria-label="contactRequest"
                  name="contactRequest"
                  value={this.state.radioButtonGroupValue}
                  className={classes.radioButtonGroup}
                  onChange={this.handleRadioChange} >

                  <FormControlLabel classes={{root: classes.radioLabelRoot +' '+ classes.radioLabelMarginBottom, label: classes.radioLabel}} value="feature" control={<Radio classes={{root : classes.radioButton}}/>} label="Feature request" />
                  <FormControlLabel classes={{root: classes.radioLabelRoot +' '+ classes.radioLabelMarginBottom, label: classes.radioLabel}} value="somethingBroken" control={<Radio classes={{root : classes.radioButton}}/>} label="Something broken" />
                  <FormControlLabel classes={{root: classes.radioLabelRootZeroMargin +' '+ classes.radioLabelMarginBottom, label: classes.radioLabel}} value="liked" control={<Radio classes={{root : classes.radioButton}}/>} label="I love it!" />
              </RadioGroup>
            </FormControl>

            <FormGroup>
              <FormControl component="fieldset" required classes={{root: classes.radioGroupWrapper + ' ' + classes.radioGroupNoMarginTop}}>
                <RadioGroup
                    aria-label="contactRequest"
                    name="contactRequestOther"
                    value={this.state.radioButtonGroupValue}
                    onChange={this.handleRadioChange} >
                    <FormControlLabel classes={{root: classes.radioLabelRoot + ' ' +classes.radioLabelOther, label: classes.radioLabel }} value="Other" control={<Radio classes={{root : this.props.classes.radioButton}}/>} label="other" />
                </RadioGroup>
              </FormControl>

              <InputWrapper>
                <IconInput inputId="subject" labelText="What's on your mind" value={this.state.subject} onChange={this.handleInputFieldChange('subject')} />
              </InputWrapper>
            </FormGroup>
            <InputWrapper>
              <IconInput inputId="message" labelText="Your message goes here" multiline={true} value={this.state.message} onChange={this.handleInputFieldChange('message')} />
            </InputWrapper>

            <SubmitButtonWrapper>
              <ButtonWrapper>
                {this.state.readyToSumit ?
                <PrimaryButton fullWidth type="submit" noMarginBottom label="Send Message" onClick={this.handleFormSubmit} />
                :
                <button className="cancel-button full-width increase-height" disabled >Send Message</button>}
              </ButtonWrapper>
            </SubmitButtonWrapper>
          </Form>
      </FormWrapper>)
  }
}

ContactUsForm.propTypes = {
  onInputValueChange: PropTypes.func,
  onRadioButtonChange: PropTypes.func
}

export default withStyles(styles)(toastrModal(ContactUsForm));
