import React from 'react';
import PropTypes from 'prop-types';

import PrimaryButton from '../buttons/PrimaryButton';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';

import ClearIcon from 'material-ui-icons/Clear';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import styled from 'styled-components';

import { MuiThemeProvider} from 'material-ui/styles';
import IconInput from '../form/IconInput.jsx';
import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';

import Dialog , {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  width: 100%;
`;


const InputWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const styles = {
    dialogAction: {
        width: '100%'
    }
}

const SetPasswordDialogBox = (props) => (
  <MuiThemeProvider theme={muiTheme}>
    <Dialog 
      title="Reset Password" 
      open={props.open}
      onClose={props.onModalClose}
      onRequestClose={props.onModalClose}
      aria-labelledby="set-password"
    >
   
   <DialogTitle>
      <DialogTitleWrapper>
          Set Password
          
        <IconButton color="primary" onClick={props.onModalClose}>
          <ClearIcon/> 
        </IconButton > 
      </DialogTitleWrapper>
    </DialogTitle>
    
    <DialogContent>
      <InputWrapper>
        <IconInput labelText="Password" type="password" iconName="lock_open"/>
        <IconInput labelText="Repeat Password" type="password" iconName="lock_open"/>
      </InputWrapper>
    </DialogContent>
    
    <DialogActions classes={{action: props.classes.dialogAction}}>
       <PrimaryButton fullWidth label="Complete" onClick={props.onCompleteButtonClick}/>
    </DialogActions>
    </Dialog>
  </MuiThemeProvider>
);

SetPasswordDialogBox.propTypes = {
  onCompleteButtonClick: PropTypes.func,
  onModalClose: PropTypes.func,
  open: PropTypes.bool
}

export default withStyles(styles)(SetPasswordDialogBox);
