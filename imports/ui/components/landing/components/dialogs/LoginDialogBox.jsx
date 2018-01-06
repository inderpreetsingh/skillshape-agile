import React from 'react';
import PropTypes from 'prop-types';

import PrimaryButton from '../buttons/PrimaryButton';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui-icons/Clear';
import TextField from 'material-ui/TextField';
import styled from 'styled-components';

import { MuiThemeProvider} from 'material-ui/styles';
import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';

import Dialog , {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

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


const LoginDialog = (props) => (
  <Dialog
    open={props.open}
    onClose={props.onModalClose}
    onRequestClose={props.onModalClose}
    aria-labelledby="login"
  >
  <MuiThemeProvider theme={muiTheme}>
    <DialogTitle>
      <DialogTitleWrapper>
          Log In
          
          <IconButton color="primary" onClick={props.onModalClose}>
            <ClearIcon/> 
          </IconButton > 
        </DialogTitleWrapper> 
    </DialogTitle>
    <DialogContent>
        <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
          />
        <TextField
          margin="dense"
          id="password"
          label="Password"
          type="password"
           helperText={<Link href="#" onClick={props.onForgetPasswordLinkClick}> Forgot Password? </Link>}
          fullWidth
        />
    </DialogContent>
    <DialogActions>
       <Button color="primary" onClick={props.onSignUpButtonClick}> Sign Up</Button>
       <PrimaryButton label="Sign In" onClick={props.onSignInButtonClick}/>
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
