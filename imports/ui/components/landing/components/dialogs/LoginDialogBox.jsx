import ClearIcon from 'material-ui-icons/Clear';
import Dialog, { DialogActions, DialogContent, DialogTitle, withMobileDialog } from 'material-ui/Dialog';
import { FormControl, FormHelperText } from 'material-ui/Form';
import IconButton from 'material-ui/IconButton';
import Input, { InputLabel } from 'material-ui/Input';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import FacebookIconButton from '../buttons/FacebookIconButton.jsx';
import GoogleIconButton from '../buttons/GoogleIconButton.jsx';
import JoinButton from '../buttons/JoinButton.jsx';
import PrimaryButton from '../buttons/PrimaryButton';
import ResetPasswordButton from '../buttons/ResetPasswordButton.jsx';
import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';
import { ContainerLoader } from '/imports/ui/loading/container';







const styles = theme => {
  return {
    dialogTop:{
      height:'auto',
    },
    dialogTitleRoot: {
      padding: `${helpers.rhythmDiv * 3}px ${helpers.rhythmDiv * 3}px 0 ${helpers.rhythmDiv * 3}px`,
      marginBottom: `${helpers.rhythmDiv * 2}px`,
      '@media screen and (max-width : 500px)': {
        padding: `0 ${helpers.rhythmDiv * 3}px`
      }
    },
    dialogContent: {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
      flexShrink: 0,
      '@media screen and (max-width : 500px)': {
        minHeight: '150px'
      }
    },
    dialogActionsRoot: {
      padding: '0 8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'flex-start'
    },
    dialogActions: {
      width: '100%',
      paddingLeft: `${helpers.rhythmDiv * 2}px`
    },
    googleButton: {
      width: "100%",
      marginBottom: theme.spacing.unit,
    },
    facebookButton: {
      width: "100%",
    },
    iconButton: {
      height: 'auto',
      width: 'auto'
    }
  }
}

const Link = styled.a`
  color:${helpers.textColor};
  &:hover {
    color:${helpers.focalColor};
  }
`;

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  font-family: ${helpers.specialFont};
  width: 100%;
`;

const ErrorWrapper = styled.span`
 color: red;
 float: right;
`;

const DialogActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 ${helpers.rhythmDiv * 3}px;
  margin: 0;
  margin-top: ${helpers.rhythmDiv}px;
  width: 100%;
  flex-shrink: 0;

  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
    min-height: 100px
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: ${props => props.facebook ? '0' : helpers.rhythmDiv+'px'};
`;

const LoginButtonWrapper = styled.div`
  margin: ${helpers.rhythmDiv}px 0;
`;

const DialogActionText = styled.p`
  margin: 0;
  margin-right: ${helpers.rhythmDiv}px;
  flex-shrink: 0;
`;

const ActionWrapper = styled.div`
  width: 100%;
  ${helpers.flexCenter}
  justify-content: flex-end;
`;

const LoginDialog = (props) => (
  <Dialog
    fullScreen={props.fullScreen}
    open={props.open}
    onClose={props.onModalClose}
    onRequestClose={props.onModalClose}
    aria-labelledby="login"
    itemScope
    itemType="http://schema.org/CheckInAction"
    classes={{root: props.classes.dialogTop}}>
  { props.loading && <ContainerLoader/>}
  <MuiThemeProvider theme={muiTheme}>
    <DialogTitle classes={{root: props.classes.dialogTitleRoot}}>
      <DialogTitleWrapper>
          <span itemProp="name">{props.title || 'Log In to SkillShape'}</span>

          <IconButton color="primary" onClick={props.onModalClose} classes={{root: props.classes.iconButton}}>
            <ClearIcon/>
          </IconButton>
        </DialogTitleWrapper>
    </DialogTitle>

    <DialogActionWrapper>
      <ButtonWrapper>
        <GoogleIconButton onClick={props.onSignUpWithGoogleButtonClick} label="Login With Google" classes={props.classes.googleButton} textCenter/>
      </ButtonWrapper>
      <ButtonWrapper facebook>
        <FacebookIconButton onClick={props.onSignUpWithFacebookButtonClick} label="Login With Facebook" classes={props.classes.facebookButton} textCenter/>
      </ButtonWrapper>

    </DialogActionWrapper>

    <DialogContent classes={{root : props.classes.dialogContent}}>
        <form onSubmit={props.onSignInButtonClick}>
            <FormControl error={props && props.error && props.error.email} margin="dense" fullWidth aria-describedby="email-error-text">
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input
                autoFocus
                id="email"
                type="email"
                value={props.email}
                onChange={props.handleInputChange && props.handleInputChange.bind(this, "email")}
                fullWidth
               />
               {
                    props && props.error && props.error.email && <FormHelperText id="email-error-text">Invalid email address</FormHelperText>
               }
            </FormControl>
            <TextField
              margin="dense"
              id="password"
              label="Password"
              type="password"
              value={props && props.password}
              onChange={props.handleInputChange && props.handleInputChange.bind(this, "password")}
              fullWidth
            />
            {
              props.error && props.error.message && <ErrorWrapper>
                { props.error.message }
                { props.showVerficationLink && <a onClick={props.reSendEmailVerificationLink} style={{color: 'blue', cursor: 'pointer'}}> resend e-mail verifcation link </a>}
                </ErrorWrapper>
            }
            <LoginButtonWrapper>
                <PrimaryButton
                    type="submit"
                    disabled={props.error && props.error.email}
                    label="Login"
                    noMarginBottom
                />
            </LoginButtonWrapper>
        </form>
    </DialogContent>

    <DialogActions classes={{root: props.classes.dialogActionsRoot, action: props.classes.dialogActions}}>
        <ActionWrapper>
          <DialogActionText>
            Lost your password?
          </DialogActionText>
          <ResetPasswordButton/>
        </ActionWrapper>
        <ActionWrapper>
          <DialogActionText>
            Not A member yet?
          </DialogActionText>
          <JoinButton label="Join Now!"/>
        </ActionWrapper>
    </DialogActions>
    </MuiThemeProvider>
  </Dialog>
);

LoginDialog.propTypes = {
  onRecoverPasswordButtonClick: PropTypes.func,
  onSignUpButtonClick: PropTypes.func,
  onSignInButtonClick: PropTypes.func,
  onModalClose: PropTypes.func,
  loading: PropTypes.bool,
  title: PropTypes.string
}

export default withMobileDialog()(withStyles(styles)(LoginDialog));
