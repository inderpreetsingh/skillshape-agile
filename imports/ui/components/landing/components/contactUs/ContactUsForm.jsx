import React, {Component} from 'react';
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
  radioLabelMarginBottom: {
    marginBottom: helpers.rhythmDiv * 2,
    [`@media screen and (max-width: ${helpers.mobile}px)`] : {
    }
  },
  radioLabel: {
    fontSize: helpers.baseFontSize,
    [`@media screen and (max-width: ${helpers.mobile}px)`] : {
      fontSize: 14
    }
  },
  radioButton: {
    height: helpers.rhythmDiv * 3,
    width: helpers.rhythmDiv * 3,
    marginRight: helpers.rhythmDiv
  },
  radioLabelRootZeroMargin: {
    marginRight: 0
  },
  radioButtonGroup: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap : 'wrap',
    justifyContent: 'space-between',
    [`@media screen and (max-width: ${helpers.mobile + 100}px)`] : {
      justifyContent: 'flex-start'
    }
  },
}


const FormWrapper = styled.div`
  padding: ${helpers.rhythmDiv * 2}px;
  padding-bottom: 0;
  max-width: 600px;
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

  handleInputFieldChange = (fieldName) => (e) => {
    this.setState({
      [fieldName] : e.target.value
    });
  }

  componentDidUpdate = () => {
    const readyToSumit = this._checkAllInputsFilled(this.state,this.state.inputsName);
    if(this.state.readyToSumit !== readyToSumit) {
      this.setState({ readyToSumit : readyToSumit});
    }
  }
  handleChange = (e, value) => {
    this.setState({
      radioButtonGroupValue: value
    })
  }

  _checkAllInputsFilled = (data, inputNames) => {

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
              <IconInput inputId="email" type="email" labelText="Enter your email id" value={this.state.email} onChange={this.handleInputFieldChange('email')} />
            </InputWrapper>

            <FormControl component="fieldset" required classes={{root: this.props.classes.formGroupWrapper}}>
                <RadioGroup
                    aria-label="contactRequest"
                    name="contactRequest"
                    value={this.state.radioButtonGroupValue}
                    className={this.props.classes.radioButtonGroup}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel classes={{root: this.props.classes.radioLabelRoot +' '+ this.props.classes.radioLabelMarginBottom, label: this.props.classes.radioLabel}} value="feature" control={<Radio classes={{root : this.props.classes.radioButton}}/>} label="Feature request" />
                    <FormControlLabel classes={{root: this.props.classes.radioLabelRoot +' '+ this.props.classes.radioLabelMarginBottom, label: this.props.classes.radioLabel}} value="somethingBroken" control={<Radio classes={{root : this.props.classes.radioButton}}/>} label="Something broken" />
                    <FormControlLabel classes={{root: this.props.classes.radioLabelRootZeroMargin +' '+ this.props.classes.radioLabelMarginBottom, label: this.props.classes.radioLabel}} value="other" control={<Radio classes={{root : this.props.classes.radioButton}}/>} label="I love it!" />
                </RadioGroup>
            </FormControl>

            <IconInput inputId="message" labelText="Your message goes here" multiline={true} value={this.state.message} onChange={this.handleInputFieldChange('message')} />

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

export default withStyles(styles)(ContactUsForm);
