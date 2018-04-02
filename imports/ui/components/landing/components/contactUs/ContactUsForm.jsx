import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {withStyles} from 'material-ui/styles';

import PrimaryButton from '../buttons/PrimaryButton.jsx';
import IconInput from '../form/IconInput.jsx';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';

import * as helpers from '../jss/helpers.js';

const styles = {
  formGroupWrapper: {
    width: '100%',
    margin: `${helpers.rhythmDiv * 2}px 0`,
    marginTop: helpers.rhythmDiv * 4,
    paddingLeft: helpers.rhythmDiv,
    [`@media screen and (max-width: ${helpers.mobile + 100}px)`] : {
      width: 'auto'
    }
  },
  radioLabelRoot: {
    marginRight: helpers.rhythmDiv * 3
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

const SubmitButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: ${helpers.rhythmDiv * 4}px 0;
`;

const ButtonWidthWrapper = styled.div`
  width: 200px;
`;

const InputWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;

class ContactUsForm extends Component {
  state = {
    name: '',
    email: '',
    message: '',
    radioButtonGroupValue: 'feature',
    inputsName: ['email','name','message'],
    readyToSumit: false,
  }

  componentDidUpdate = () => {
    const readyToSumit = this._validateAllInputs(this.state,this.state.inputsName);
    if(this.state.readyToSumit !== readyToSumit) {
      this.setState({ readyToSumit : readyToSumit});
    }
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

  _validateAllInputs = (data, inputNames) => {

    for(let i = 0; i < inputNames.length; ++i) {
      if(data[inputNames[i]] == '') {
        return false;
      }
    }

    return true;
  }

  render() {
    return (
        <FormWrapper>
          <Form>
            <InputWrapper>
              <IconInput inputId="name" labelText="Your name" value={this.state.name} onChange={this.handleInputFieldChange('name')}/>
            </InputWrapper>

            <InputWrapper>
              <IconInput inputId="email" type="email" labelText="Enter your email address" value={this.state.email} onChange={this.handleInputFieldChange('email')} />
            </InputWrapper>

            <FormControl component="fieldset" required classes={{root: this.props.classes.formGroupWrapper}}>
                <RadioGroup
                    aria-label="contactRequest"
                    name="contactRequest"
                    value={this.state.radioButtonGroupValue}
                    className={this.props.classes.radioButtonGroup}
                    onChange={this.handleRadioChange}
                  >
                    <FormControlLabel classes={{root: this.props.classes.radioLabelRoot +' '+ this.props.classes.radioLabelMarginBottom, label: this.props.classes.radioLabel}} value="feature" control={<Radio classes={{root : this.props.classes.radioButton}}/>} label="Feature request" />
                    <FormControlLabel classes={{root: this.props.classes.radioLabelRoot +' '+ this.props.classes.radioLabelMarginBottom, label: this.props.classes.radioLabel}} value="somethingBroken" control={<Radio classes={{root : this.props.classes.radioButton}}/>} label="Something broken" />
                    <FormControlLabel classes={{root: this.props.classes.radioLabelRootZeroMargin +' '+ this.props.classes.radioLabelMarginBottom, label: this.props.classes.radioLabel}} value="other" control={<Radio classes={{root : this.props.classes.radioButton}}/>} label="I love it!" />
                </RadioGroup>
            </FormControl>

            <InputWrapper>
              <IconInput inputId="message" labelText="Your message goes here" multiline={true} value={this.state.message} onChange={this.handleInputFieldChange('message')} />
            </InputWrapper>

            <SubmitButtonWrapper>
              <ButtonWidthWrapper>
                {this.state.readyToSumit ?
                <PrimaryButton fullWidth type="submit" noMarginBottom label="Send Message" />
                :
                <button className="cancel-button full-width increase-height" disabled >Send Message</button>}
              </ButtonWidthWrapper>
            </SubmitButtonWrapper>
          </Form>
      </FormWrapper>)
  }
}

ContactUsForm.propTypes = {
  onInputValueChange: PropTypes.func,
  onRadioButtonChange: PropTypes.func
}

export default withStyles(styles)(ContactUsForm);
