import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Recaptcha from 'react-recaptcha';
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
import LoginButton from '../buttons/LoginButton.jsx';
import IconInput from '../form/IconInput.jsx';

import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';
import { emailRegex } from '/imports/util';
import config from '/imports/config';
import { logoSrc } from '../../site-settings.js';

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
  dialogTitleRoot: {
    display: 'flex',
    fontFamily: `${helpers.specialFont}`
  },
  dialogContent :  {
    '@media screen and (max-width : 500px)': {
      minHeight: '150px',
    }
  },
  dialogAction: {
    width: '100%',
    margin: 0
  },
  dialogActionsRoot: {
    width: '100%',
    padding: `0 ${helpers.rhythmDiv * 3}px`,
    margin: 0,
    '@media screen and (max-width : 500px)': {
      padding: `0 ${helpers.rhythmDiv * 3}px`
    }
  },
  iconButton: {
    height: 'auto'
  },
  formControlRoot: {
    marginBottom: `${helpers.rhythmDiv * 2}px`
  }
}

const DialogBoxHeaderText = styled.p`
  font-family: ${helpers.commonFont};
  color: ${helpers.textColor};
`;

const DialogTitleContainer = styled.div`
  ${helpers.flexCenter};
  margin: 0 0 ${helpers.rhythmDiv * 2}px 0;
`;

const DialogTitleWrapper = styled.h1`
  ${helpers.flexCenter};
  font-family: ${helpers.specialFont};
  font-weight: 500;
  width: 100%;
  margin: 0;

  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: ${helpers.baseFontSize * 1.25}px;
  }
`;

const DialogActionWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;

  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
  }
`;

const DialogActionButtonsWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween};
  width: 100%;

  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
  }
`;

const LoginButtonWrapper = styled.div`
  display: inline-block;
  margin-left: ${helpers.rhythmDiv}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    width: 100%;
    margin-left: 0;
    margin-top: ${helpers.rhythmDiv}px;
    padding-right: ${helpers.rhythmDiv}px;
  }
`;

const ButtonWrapper = styled.div`
  width: calc(50% - ${helpers.rhythmDiv}px);
  padding: ${helpers.rhythmDiv};
  text-align: ${props => props.facebook ? 'right' : 'left'};

  @media screen and (max-width: ${helpers.mobile}px) {
    width: 100%;
    text-align: center;
    margin-bottom: ${props => props.facebook ? '0' : helpers.rhythmDiv}px;
  }
`;

const InputWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const ErrorWrapper = styled.span`
  color: red;
  float: right;
`;

const LogoImg = styled.img`
  width: 40px;
  height: 40px;
  margin-right: ${helpers.rhythmDiv}px;
  cursor: pointer;
  
  @media screen and (max-width: ${helpers.mobile}px) {
    width: 30px;
    height: 30px;
  }
`;

class SignUpDialogBox extends Component {

    state = {
        name: "",
        email: "",
        sendMeSkillShapeNotification: true,
        robotOption: false,
        errorEmail: false,
        captchaValue: null,
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

    recaptchaVerifyCallback = (response) => {
        this.props.unsetError();
        this.setState({ captchaValue: response})
    }

    recaptchaCallback = () => {
        console.log("Captcha Load Done!!!")
    }

    recaptchaExpiredCallback = () => {
        console.log("Captcha is Expire now!!!")
        this.setState({ captchaValue: null})
    }

    render() {

        const {
            classes,
            open,
            fullScreen,
            onModalClose,
            onLoginButtonClick,
            onSignUpButtonClick,
            onSignUpWithGoogleButtonClick,
            onSignUpWithFacebookButtonClick
        } = this.props;

        const {
            emailOption,
            robotOption,
            name,
            email,
            errorEmail,
            captchaValue,
            sendMeSkillShapeNotification
        } = this.state;

        console.log('SignUpDialogBox state -->>',this.state);
        console.log('SignUpDialogBox props -->>',this.props);
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
                    <form onSubmit={this.props.onSubmit.bind(this, {name, email, captchaValue, sendMeSkillShapeNotification})}>

                      <DialogTitleContainer>
                        <DialogTitleWrapper>
                          <LogoImg src={logoSrc}/>
                          <span>Sign Up For SkillShape</span>
                        </DialogTitleWrapper>
                        <IconButton color="primary" onClick={onModalClose} classes={{root: classes.iconButton}}>
                            <ClearIcon/>
                        </IconButton >
                      </DialogTitleContainer>

                      <DialogActions classes={{root : classes.dialogActionsRoot, action: classes.dialogAction}}>
                          <DialogActionButtonsWrapper>
                              <ButtonWrapper>
                                <GoogleIconButton onClick={onSignUpWithGoogleButtonClick}/>
                              </ButtonWrapper>
                              <ButtonWrapper facebook>
                                <FacebookIconButton onClick={onSignUpWithFacebookButtonClick}/>
                              </ButtonWrapper>
                          </DialogActionButtonsWrapper>
                      </DialogActions>

                        <DialogContent className={classes.dialogContent}>

                            <InputWrapper>
                                <IconInput
                                    labelText="Name *"
                                    iconName="person"
                                    value={name}
                                    onChange={this.handleTextChange.bind(this, "name")}
                                />
                                <IconInput
                                    type="email"
                                    labelText="Email Address *"
                                    value={email}
                                    iconName="email"
                                    onChange={this.handleTextChange.bind(this, "email")}
                                    error={errorEmail}
                                    errorText={errorEmail && "Invalid Email Address"}
                                />
                            </InputWrapper>

                            <FormControl component="fieldset" classes={{root: classes.formControlRoot}}>
                                <FormGroup>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={sendMeSkillShapeNotification}
                                          value="sendMeSkillShapeNotification"
                                        />

                                      }
                                      onChange={this.handleCheckBoxChange('sendMeSkillShapeNotification')}
                                      label="I would like to recieve new, surveys, and updates via email about SkillShape and it's participating schools"
                                    />
                                </FormGroup>
                            </FormControl>
                            <Recaptcha
                                ref={e => this.recaptchaInstance = e}
                                sitekey={config.CAPTCHA_SITE_KEY}
                                verifyCallback={this.recaptchaVerifyCallback}
                                onloadCallback={this.recaptchaCallback}
                                expiredCallback={this.recaptchaExpiredCallback}
                            />
                            {
                                this.props.errorText &&
                                <ErrorWrapper>{this.props.errorText}</ErrorWrapper>
                            }
                        </DialogContent>

                        <DialogActions classes={{root : classes.dialogActionsRoot, action: classes.dialogAction}}>
                            <DialogActionWrapper>
                                <Typography> Already a Skill Shape Member ?</Typography>
                                <LoginButtonWrapper>
                                  <LoginButton />
                                </LoginButtonWrapper>
                                <PrimaryButton type="submit" label="Sign Up" onClick={onSignUpButtonClick}></PrimaryButton>
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
  errorText: PropTypes.string,
  unsetError: PropTypes.func,
}

export default withMobileDialog()(withStyles(styles)(SignUpDialogBox));
