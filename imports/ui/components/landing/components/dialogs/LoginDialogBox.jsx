import React from 'react';
import PropTypes from 'prop-types';

import PrimaryButton from '../buttons/PrimaryButton';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui-icons/Clear';
import TextField from 'material-ui/TextField';
import styled from 'styled-components';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

import { MuiThemeProvider} from 'material-ui/styles';
import {withStyles} from 'material-ui/styles';

import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';

import GoogleIconButton from '../buttons/GoogleIconButton.jsx';
import FacebookIconButton from '../buttons/FacebookIconButton.jsx';

import Dialog , {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';

import { ContainerLoader } from '/imports/ui/loading/container';

const styles = theme => {
  return {
    dialogTitleRoot: {
      padding: `${helpers.rhythmDiv * 3}px ${helpers.rhythmDiv * 3}px 0 ${helpers.rhythmDiv * 3}px`,
      marginBottom: `${helpers.rhythmDiv * 2}px`,
      '@media screen and (max-width : 500px)': {
        padding: `0 ${helpers.rhythmDiv * 3}px`
      }
    },
    dialogContent: {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
      '@media screen and (max-width : 500px)': {
        minHeight: '150px'
      }
    },
    dialogActions: {
      padding: '0 8px',
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

const LoginDialog = (props) => (
  <Dialog
    fullScreen={props.fullScreen}
    open={props.open}
    onClose={props.onModalClose}
    onRequestClose={props.onModalClose}
    aria-labelledby="login"
    itemScope
    itemType="http://schema.org/CheckInAction"
  >
  { props.loading && <ContainerLoader/>}
  <MuiThemeProvider theme={muiTheme}>
    <DialogTitle classes={{root: props.classes.dialogTitleRoot}}>
      <DialogTitleWrapper>
          <span itemProp="name">Log In</span>

          <IconButton color="primary" onClick={props.onModalClose} classes={{root: props.classes.iconButton}}>
            <ClearIcon/>
          </IconButton >
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
        <FormControl error={props.error.email} margin="dense" fullWidth aria-describedby="email-error-text">
          <InputLabel htmlFor="email">Email Address</InputLabel>
          <Input
            autoFocus
            id="email"
            type="email"
            value={props.email}
            onChange={props.handleInputChange.bind(this, "email")}
            fullWidth
           />
           {
                props.error.email && <FormHelperText id="email-error-text">Invalid email address</FormHelperText>
           }
        </FormControl>
        <TextField
          margin="dense"
          id="password"
          label="Password"
          type="password"
          value={props.password}
          onChange={props.handleInputChange.bind(this, "password")}
          helperText={<Link href="#" onClick={props.onForgetPasswordLinkClick}> Forgot Password? </Link>}
          fullWidth
        />
        {props.error.message && <ErrorWrapper>{props.error.message}</ErrorWrapper>}
    </DialogContent>

    <DialogActions classes={{root: props.classes.dialogActions}}>
       <Button color="primary" onClick={props.onSignUpButtonClick} itemScope itemType="http://schema.org/AgreeAction"> Sign Up</Button>
       <PrimaryButton disabled={props.error.email} label="Sign In" onClick={props.onSignInButtonClick} itemScope itemType="http://schema.org/DisagreeAction"/>
    </DialogActions>
    </MuiThemeProvider>
  </Dialog>
);

LoginDialog.propTypes = {
  onSignInButtonClick: PropTypes.func,
  onSignInButtonClick: PropTypes.func,
  onModalClose: PropTypes.func,
  loading: PropTypes.bool,
}

export default withMobileDialog()(withStyles(styles)(LoginDialog));
