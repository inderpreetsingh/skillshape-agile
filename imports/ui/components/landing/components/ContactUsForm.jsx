import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {withStyles} from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';

import PrimaryButton from './buttons/PrimaryButton.jsx';
import * as helpers from './jss/helpers.js';

const styles = {
  input: {
    fontFamily: helpers.commonFont,   
  },   
  inputLabelFocused: {
    color: helpers.primaryColor,  
  },
  formControl: {
    padding: helpers.rhythmDiv,  
  },
  errorInputLabelFocused: {
    color: helpers.inputErrorColor  
  },
  radioButtonChecked: {
    color: helpers.primaryColor  
  },
  messageBox: {
    marginTop: 0  
  },
  inputInkbar: {
    '&:after': {
      backgroundColor: helpers.primaryColor,
    },
  },
  errorInputInkbar: {
      '&:after': {
        backgroundColor: helpers.inputErrorColor        
      }
    }
}

const ContactUsFormWrapper = styled.div`
    width: ${props => props.fullWidth ? '100%' : props.width};
    padding: ${helpers.rhythmDiv}px;
    margin: 0 auto;
    
    @media screen and (max-width : ${helpers.mobile}px) {
        width: 100%;
    }
`;

const FormHeaderText = styled.h1`
    text-align: center;
    font-family : ${helpers.specialFont};
    font-weight: 400;
    color: ${helpers.headingColor};
    margin: 0;    
`;

const FormText = styled.p`
    color: ${helpers.textColor};
    text-align: center;
    margin: 0;
`;

const FormHeader = styled.div`
    margin-bottom: ${helpers.rhythmDiv}px;
`;

const FormSubmitButtonWrapper =styled.div`
    margin-top: ${helpers.rhythmDiv * 2}px;
    padding-top: ${helpers.rhythmDiv * 2}px;
`;

const FormInnerWrapper = styled.div`
    overflow: hidden;
`;

class ContactUsForm extends Component {
    state = {
        fields: {
            name: '',
            email: '',
            title: '',
            message: '',
            radioButtonGroupValue: 'feature',
        },
        errorInFields: {
            name: false,
            email: false,
        },
        requiredFieldNames: ['name','email']
    }

    handleChange = (event, value) => {
        this.setState({ 
            ...this.state,
            fields: {
                ...this.state.fields,
                radioButtonGroupValue: value    
            }
        });
    };

    handleTextChange = (inputName) => (e) => {
        this.setState({
            ...this.state,
            fields: {
                ...this.state.fields,
                [inputName]: e.target.value    
            }
        });
        
        if(this.state.requiredFieldNames.includes(inputName)) {
            this.toggleErrorInField(inputName);
        }
    }
    checkErrorInField = (inputName) => {
        return this.state.errorInFields[inputName];
    }
    toggleErrorInField = (inputName) => {
        // console.log(inputName,!this.state.fields[inputName],this.state.errorInFields[inputName]);

        this.setState((state) => {
            return {
                ...state,
                errorInFields: {
                    ...state.errorInFields,
                    [inputName]: !state.fields[inputName]
                }
            }
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const fields = {
            ...this.state.fields
        }
        // console.log(this.state,fields);
        
        this.state.requiredFieldNames.forEach(fieldName => {
            this.toggleErrorInField(fieldName);
        })
        
        if(this.checkErrorInField('name') || this.checkErrorInField('email')) {
            alert('resolve all the errors first');
        }
        if(this.props.onSubmitButtonClick)
            this.props.onSubmitButtonClick(fields);
    }
    _getInkBarClassName(inputName) {
        const {classes} = this.props;
        return this.checkErrorInField(inputName) ? classes.errorInkbar : classes.inputInkbar;   
    }
    _getFocussedClassName(inputName) {
        const {classes} = this.props;
        return this.checkErrorInField(inputName) ? classes.errorInputLabelFocused : classes.inputLabelFocused;
    }
    render() {
        const {fullWidth, width, classes, headerText, onSubmitButtonClick} = this.props;
        return (
        <ContactUsFormWrapper fullWidth={fullWidth} width={width}>
            <FormHeader>
                <FormHeaderText>
                    {headerText || 'Get in touch with us'}
                </FormHeaderText>
            </FormHeader>
            
            <form autoComplete="off">
            <FormInnerWrapper>
                <Grid container>
                
                    <Grid item xs={12} sm={6}> 
                        <TextField
                            error={this.checkErrorInField('name')}
                            required
                            margin="normal"
                            id="name"
                            label="Name"
                            type="text"
                            InputProps={{
                                classes: {
                                    input: classes.input,
                                    inkbar: this._getInkBarClassName('name'),
                                },
                            }}
                            InputLabelProps = {{
                                FormControlClasses: {
                                    focused: this._getFocussedClassName('name'),
                                }
                            }}
                            value={this.state.fields.name}
                            fullWidth
                            onChange={this.handleTextChange('name')}
                        />
                        
                        <TextField
                          error={this.checkErrorInField('email')}    
                          required
                          margin="normal"
                          id="email"
                          label="Email"
                          type="email"
                          InputProps={{
                                classes: {
                                    input: classes.input,
                                    inkbar: this._getInkBarClassName('email'),
                                },
                            }}
                            InputLabelProps = {{
                                FormControlClasses: {
                                    focused: this._getFocussedClassName('email'),
                                }
                            }}
                          value={this.state.fields.email}     
                          fullWidth
                          onChange={this.handleTextChange('email')}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <FormControl component="fieldset" required className={classes.formControl}>
                            <RadioGroup
                                aria-label="contactRequest"
                                name="contactRequest"
                                value={this.state.fields.radioButtonGroupValue}
                                onChange={this.handleChange}
                              >
                                <FormControlLabel value="feature" control={<Radio classes={{checked : classes.radioButtonChecked}} />} label="Feature Request" />
                                <FormControlLabel value="somethingBroken" control={<Radio classes={{checked : classes.radioButtonChecked}} />} label="Something is broken" />
                                <FormControlLabel value="other" control={<Radio classes={{checked : classes.radioButtonChecked}} />} label="I Love this!" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <TextField
                            margin="normal"
                            id="message"
                            label="Message"
                            type="text"
                            classes={{
                                root: classes.messageBox
                            }}
                            InputProps={{
                                classes: {
                                    input: classes.input,
                                    inkbar: classes.inputInkbar,
                                },
                            }}
                            InputLabelProps = {{
                                FormControlClasses: {
                                    focused: classes.inputLabelFocused,
                                }
                            }}
                            multiline
                            rows={5}
                            fullWidth
                            value={this.state.fields.message}
                            onChange={this.handleTextChange('message')}
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <FormSubmitButtonWrapper>
                            <PrimaryButton fullWidth labelText="submit" onClick={this.handleSubmit}/>
                        </FormSubmitButtonWrapper>
                    </Grid>
                </Grid>
            </FormInnerWrapper>
            </form>
        </ContactUsFormWrapper>
        );
    }
}

ContactUsForm.propTypes = {
    fullWidth: PropTypes.bool,
    width: PropTypes.number,
    headerText: PropTypes.string,
    onSubmitButtonClick: PropTypes.func,
}

ContactUsForm.defaultProps = {
    width: 500
}

export default withStyles(styles)(ContactUsForm);