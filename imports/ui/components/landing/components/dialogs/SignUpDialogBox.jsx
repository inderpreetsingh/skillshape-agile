import ClearIcon from 'material-ui-icons/Clear';
import Checkbox from 'material-ui/Checkbox';
import Dialog, { DialogActions, DialogContent, withMobileDialog } from 'material-ui/Dialog';
import { FormControl, FormControlLabel, FormGroup } from 'material-ui/Form';
import IconButton from 'material-ui/IconButton';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Recaptcha from 'react-recaptcha';
import styled from 'styled-components';
import { logoSrc } from '../../site-settings';
import FacebookIconButton from '../buttons/FacebookIconButton';
import GoogleIconButton from '../buttons/GoogleIconButton';
import LoginButton from '../buttons/LoginButton';
import PrimaryButton from '../buttons/PrimaryButton';
import IconInput from '../form/IconInput';
import * as helpers from '../jss/helpers';
import muiTheme from '../jss/muitheme';
import config from '/imports/config';
import TermsOfServiceDialogBox from '/imports/ui/components/landing/components/dialogs/TermsOfServiceDetailDialogBox';
import { ContainerLoader } from '/imports/ui/loading/container';
import { emailRegex } from '/imports/util';

const styles = {
  dialogPaper: {
    padding: `${helpers.rhythmDiv * 2}px`,
    height: 'auto',
  },
  dialogTitleRoot: {
    display: 'flex',
    fontFamily: `${helpers.specialFont}`,
  },
  dialogContent: {
    '@media screen and (max-width : 500px)': {
      minHeight: '150px',
    },
  },
  dialogAction: {
    width: '100%',
    margin: 0,
  },
  dialogActionsRoot: {
    width: '100%',
    padding: `0 ${helpers.rhythmDiv * 3}px`,
    margin: 0,
    '@media screen and (max-width : 500px)': {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
    },
  },
  dialogActionsRootButtons: {
    width: '100%',
    padding: `0 ${helpers.rhythmDiv}px`,
    margin: 0,
    '@media screen and (max-width : 500px)': {
      padding: `0 ${helpers.rhythmDiv}px`,
    },
  },
  dialogActionsRootSubmitButton: {
    width: '100%',
    padding: `0 ${helpers.rhythmDiv * 3}px`,
    margin: 0,
    '@media screen and (max-width : 500px)': {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
    },
  },
  iconButton: {
    height: 'auto',
    width: 'auto',
  },
  formControlRoot: {
    marginBottom: `${helpers.rhythmDiv * 2}px`,
  },
};



const DialogTitleContainer = styled.div`
  ${helpers.flexCenter};
  margin: 0 0 ${helpers.rhythmDiv * 2}px 0;
  padding: 0 ${helpers.rhythmDiv * 3}px;
`;
const BlueColorText = styled.span`
  color: blue;
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
    margin-bottom: ${helpers.rhythmDiv}px;
    padding-right: ${helpers.rhythmDiv}px;
  }
`;

const ButtonWrapper = styled.div`
  width: calc(50% - ${helpers.rhythmDiv}px);
  padding: ${helpers.rhythmDiv};
  text-align: ${props => (props.facebook ? 'right' : 'left')};

  @media screen and (max-width: ${helpers.mobile}px) {
    width: 100%;
    text-align: center;
    margin-bottom: ${props => (props.facebook ? '0' : helpers.rhythmDiv)}px;
  }
`;

const InputWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const ErrorWrapper = styled.span`
  color: red;
  font-size: 17px;
  font-family: ${helpers.specialFont};
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
    name: this.props.userName,
    email: this.props.userEmail,
    sendMeSkillShapeNotification: true,
    skillShapeTermsAndConditions: true,
    robotOption: false,
    errorEmail: false,
    captchaValue: null,
  };

  handleTextChange = (inputName, e) => {
    if (inputName === 'email') {
      let errorEmail = false;
      if (!emailRegex.email.test(e.target.value)) {
        errorEmail = true;
      }
      this.setState({ [inputName]: e.target.value, errorEmail });
    } else {
      this.setState({ [inputName]: e.target.value });
    }
  };

  handleTextOnChange = inputName => (e) => {
    this.setState({
      [inputName]: e.target.value,
    });
  };

  handleCheckBoxChange = checkBoxName => (e) => {
    const currentValue = e.target.checked;
    this.setState(state => ({
      ...state,
      [checkBoxName]: currentValue,
    }));
  };

  recaptchaVerifyCallback = (response) => {
    this.props.unsetError();
    this.setState({ captchaValue: response });
  };

  recaptchaCallback = () => {};

  recaptchaExpiredCallback = () => {
    this.setState({ captchaValue: null });
  };

  render() {
    const {
      classes,
      open,
      fullScreen,
      onModalClose,
      onSignUpWithGoogleButtonClick,
      onSignUpWithFacebookButtonClick,
      onSubmit,
      isBusy,
    } = this.props;
    const {
      name,
      email,
      errorEmail,
      captchaValue,
      sendMeSkillShapeNotification,
      skillShapeTermsAndConditions,
      termsOfServiceDialogBox,
      password,
      confirmPassword,
      errorPassword,
      errorConfirmPassword,
    } = this.state;

    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onModalClose}
        onRequestClose={onModalClose}
        aria-labelledby="sign-up"
        classes={{ paper: classes.dialogPaper }}
      >
        {isBusy && <ContainerLoader />}
        {termsOfServiceDialogBox && (
          <TermsOfServiceDialogBox
            open={termsOfServiceDialogBox}
            onModalClose={() => {
              this.setState({ termsOfServiceDialogBox: false });
            }}
          />
        )}
        <MuiThemeProvider theme={muiTheme}>
          <form
            onSubmit={(e) => {
              onSubmit(
                {
                  name,
                  email,
                  captchaValue,
                  sendMeSkillShapeNotification,
                  skillShapeTermsAndConditions,
                  password,
                  confirmPassword,
                },
                e,
              );
            }}
          >
            <DialogTitleContainer>
              <DialogTitleWrapper>
                <LogoImg src={logoSrc} />
                <span>Sign Up For SkillShape</span>
              </DialogTitleWrapper>
              <IconButton
                color="primary"
                onClick={onModalClose}
                classes={{ root: classes.iconButton }}
              >
                <ClearIcon />
              </IconButton>
            </DialogTitleContainer>

            <DialogActions
              classes={{
                root: classes.dialogActionsRoot,
                action: classes.dialogAction,
              }}
            >
              <DialogActionButtonsWrapper>
                <ButtonWrapper>
                  <GoogleIconButton onClick={onSignUpWithGoogleButtonClick} />
                </ButtonWrapper>
                <ButtonWrapper facebook>
                  <FacebookIconButton onClick={onSignUpWithFacebookButtonClick} />
                </ButtonWrapper>
              </DialogActionButtonsWrapper>
            </DialogActions>

            <DialogContent className={classes.dialogContent}>
              <InputWrapper>
                <IconInput
                  labelText="Your Name *"
                  iconName="person"
                  value={name}
                  onChange={this.handleTextChange.bind(this, 'name')}
                />
                <IconInput
                  type="email"
                  labelText="Email Address *"
                  value={email}
                  iconName="email"
                  error={errorEmail}
                  onChange={this.handleTextChange.bind(this, 'email')}
                  errorText={errorEmail && 'Invalid Email Address'}
                />
                <IconInput
                  type="password"
                  labelText="Password *"
                  value={password}
                  iconName="lock_open"
                  error={errorPassword}
                  onChange={this.handleTextChange.bind(this, 'password')}
                  errorText={errorPassword && 'Invalid Email Address'}
                />
                <IconInput
                  type="password"
                  labelText="Confirm Password *"
                  value={confirmPassword}
                  iconName="lock_open"
                  error={errorConfirmPassword}
                  onChange={this.handleTextChange.bind(this, 'confirmPassword')}
                  errorText={errorConfirmPassword && 'Invalid Email Address'}
                />
                {this.props.errorText && <ErrorWrapper>{this.props.errorText}</ErrorWrapper>}
              </InputWrapper>

              <FormControl component="fieldset" classes={{ root: classes.formControlRoot }}>
                <FormGroup>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={sendMeSkillShapeNotification}
                        value="sendMeSkillShapeNotification"
                      />
)}
                    onChange={this.handleCheckBoxChange('sendMeSkillShapeNotification')}
                    label="I would like to recieve new, surveys, and updates via email about SkillShape and it's participating schools"
                  />
                </FormGroup>
              </FormControl>

              <FormControl component="fieldset" classes={{ root: classes.formControlRoot }}>
                <FormGroup>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={skillShapeTermsAndConditions}
                        value="skillShapeTermsAndConditions"
                      />
)}
                    onChange={this.handleCheckBoxChange('skillShapeTermsAndConditions')}
                    label={(
                      <div>
                        I agree to skillshape
                        {' '}
                        <BlueColorText
                          onClick={() => {
                            this.setState({ termsOfServiceDialogBox: true });
                          }}
                        >
                          Terms & Conditions
                        </BlueColorText>
                        .
                      </div>
)}
                  />
                </FormGroup>
              </FormControl>
              <Recaptcha
                ref={e => (this.recaptchaInstance = e)}
                sitekey={config.CAPTCHA_SITE_KEY}
                verifyCallback={this.recaptchaVerifyCallback}
                onloadCallback={this.recaptchaCallback}
                expiredCallback={this.recaptchaExpiredCallback}
              />
            </DialogContent>
            <DialogActions
              classes={{
                root: classes.dialogActionsRootSubmitButton,
                action: classes.dialogAction,
              }}
            >
              <PrimaryButton type="submit" label="Sign Up" noMarginBottom />
            </DialogActions>
            <DialogActions
              classes={{
                root: classes.dialogActionsRootButtons,
                action: classes.dialogAction,
              }}
            >
              <DialogActionWrapper>
                <Typography> Already a Skill Shape Member ?</Typography>
                <LoginButtonWrapper>
                  <LoginButton />
                </LoginButtonWrapper>
              </DialogActionWrapper>
            </DialogActions>
          </form>
        </MuiThemeProvider>
      </Dialog>
    );
  }
}

SignUpDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  onSignUpWithGoogleButtonClick: PropTypes.func,
  onSignUpWithFacebookButtonClick: PropTypes.func,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  errorText: PropTypes.string,
  unsetError: PropTypes.func,
};

export default withMobileDialog()(withStyles(styles)(SignUpDialogBox));
