import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SocialIcon } from 'react-social-icons';

import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui-icons/Clear';
import Typography from 'material-ui/Typography';
import Checkbox from 'material-ui/Checkbox';
import {withStyles} from 'material-ui/styles';
import { MuiThemeProvider} from 'material-ui/styles';

import PrimaryButton from '../buttons/PrimaryButton.jsx';
import GoogleIconButton from '../buttons/GoogleIconButton.jsx';
import FacebookIconButton from '../buttons/FacebookIconButton.jsx';

import IconInput from '../form/IconInput.jsx';
import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';
import { emailRegex } from '/imports/util';

import Dialog , {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';

import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText,
} from 'material-ui/Form';

const styles = {
  dialogPaper: {
    padding: `${helpers.rhythmDiv * 2}px`
  },
  dialogContent :  {
    '@media screen and (max-width : 500px)': {
      minHeight: '150px',
    }
  },
  dialogAction: {
    width: '100%'
  }
}

const DialogBoxHeaderText = styled.p`
  font-family: ${helpers.commonFont};
  color: ${helpers.textColor};
`;

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  width: 100%;
`;

const DialogActionWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  width: 100%;

  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
  }
`;


const ButtonWrapper = styled.div`
  width: calc(50% - ${helpers.rhythmDiv * 2}px);
  padding: ${helpers.rhythmDiv};
  text-align: center;

  @media screen and (max-width: ${helpers.mobile}px) {
    width: 100%;
  }
`;

const InputWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

class SignUpDialogBox extends Component {
  state = {
    name: "",
    email: "",
    emailOption: false,
    robotOption: false,
    errorEmail: false,
  }
  handleTextChange = (inputName, e) => {
    if(inputName === "email") {
        let errorEmail = false;
        if(!emailRegex.email.test(e.target.value)) {
            errorEmail = true;
        }
        this.setState({[inputName]: e.target.value, errorEmail })
    } else {
        this.setState({[inputName]: e.target.value })
    }
  }
  handleCheckBoxChange = (checkBoxName) => (e) => {
    const currentValue = e.target.checked;
    this.setState((state) => (
    {
      ...state,
      [checkBoxName]: currentValue
    }
  ));
  }
  render() {

    const {
      classes, open, fullScreen, onModalClose, onLoginButtonClick, onSignUpButtonClick, onSignUpWithGoogleButtonClick,
      onSignUpWithFacebookButtonClick
    } = this.props;

    const { emailOption,robotOption,name,email,errorEmail } = this.state;
    console.log('SignUpDialogBox state -->>',this.state);
    return(
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={onModalClose}
          onRequestClose={onModalClose}
          aria-labelledby="sign-up"
          classes={{paper: classes.dialogPaper}}
        >
            <MuiThemeProvider theme={muiTheme}>
                <form onSubmit={this.props.onSubmit.bind(this, {name, email})}>
                    <DialogTitle>
                        <DialogTitleWrapper>
                            Sign Up
                            <IconButton color="primary" onClick={onModalClose}>
                                <ClearIcon/>
                            </IconButton >
                        </DialogTitleWrapper>
                    </DialogTitle>
                    <DialogActions classes={{root : classes.dialogAction, action: classes.dialogAction}}>
                        <DialogActionWrapper>
                            <ButtonWrapper>
                              <GoogleIconButton onClick={onSignUpWithGoogleButtonClick}/>
                            </ButtonWrapper>
                            <ButtonWrapper>
                              <FacebookIconButton onClick={onSignUpWithFacebookButtonClick}/>
                            </ButtonWrapper>
                        </DialogActionWrapper>
                    </DialogActions>

                    <DialogContent className={classes.dialogContent}>

                        <InputWrapper>
                            <IconInput
                                labelText="Name"
                                iconName="person"
                                value={name}
                                onChange={this.handleTextChange.bind(this, "name")}
                            />
                            <IconInput
                                type="email"
                                labelText="Email Address"
                                value={email}
                                iconName="email"
                                onChange={this.handleTextChange.bind(this, "email")}
                                error={errorEmail}
                                errorText={errorEmail && "Invalid Email Address"}
                            />
                        </InputWrapper>

                        <PrimaryButton type="submit" fullWidth label="Sign Up" onClick={onSignUpButtonClick}></PrimaryButton>

                        <FormControl component="fieldset">
                            <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={emailOption}
                                      value="emailOption"
                                    />

                                  }
                                  onChange={this.handleCheckBoxChange('emailOption')}
                                  label="I would like to recieve new, surveys, and updates via email about SkillShape and it's participating schools"
                                />
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={robotOption}
                                      onChange={this.handleCheckBoxChange('robotOption')}
                                      value="notARobot"
                                    />
                                  }
                                  label="I am not a robot"
                                  onChange={this.handleCheckBoxChange('robotOption')}
                                />
                            </FormGroup>
                        </FormControl>

                    </DialogContent>

                    <DialogActions classes={{root : classes.dialogAction, action: classes.dialogAction}}>
                        <DialogActionWrapper>
                            <Typography> Already a Skill Shape Member ?</Typography>
                            <Button color="primary">Log In</Button>
                        </DialogActionWrapper>
                    </DialogActions>
                </form>
            </MuiThemeProvider>
        </Dialog>
    )
  }
}

SignUpDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  onLoginButtonClick: PropTypes.func,
  onSignUpButtonClick: PropTypes.func,
  onSignUpWithGoogleButtonClick: PropTypes.func,
  onSignUpWithFacebookButtonClick: PropTypes.func,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
}

export default withMobileDialog()(withStyles(styles)(SignUpDialogBox));
