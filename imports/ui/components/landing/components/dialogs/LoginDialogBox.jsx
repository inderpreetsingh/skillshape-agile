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
import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';

import Dialog , {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import { ContainerLoader } from '/imports/ui/loading/container';

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

const LoginDialog = (props) => (
  <Dialog
    open={props.open}
    onClose={props.onModalClose}
    onRequestClose={props.onModalClose}
    aria-labelledby="login"
    itemScope
    itemType="http://schema.org/CheckInAction"
  >
  { props.loading && <ContainerLoader/>}
  <MuiThemeProvider theme={muiTheme}>
    <DialogTitle>
      <DialogTitleWrapper>
          <span itemProp="name">Log In</span>

          <IconButton color="primary" onClick={props.onModalClose}>
            <ClearIcon/>
          </IconButton >
        </DialogTitleWrapper>
    </DialogTitle>
    <DialogContent>
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
    <DialogActions>
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
}

export default LoginDialog;
