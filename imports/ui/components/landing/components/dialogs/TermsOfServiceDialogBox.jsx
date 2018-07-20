import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import ClearIcon from 'material-ui-icons/Clear';

import {withStyles} from 'material-ui/styles';
import { MuiThemeProvider} from 'material-ui/styles';

import PrimaryButton from '../buttons/PrimaryButton';
import TermsOfServiceButton from '../buttons/TermsOfServiceButton';

import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';

import Dialog , {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

const styles = {
  dialogPaper: {
    padding: `${helpers.rhythmDiv * 2}px`
  },
  dialogAction : {
    width: '100%',
    display: 'block',
    '@media screen and (max-width : 500px)': {
      justifyContent: 'center',
    }
  },
  dialogActionInnerWrapper: {
    textAlign: 'center',
  },
  dialogContent :  {
    '@media screen and (max-width : 500px)': {
      minHeight: '150px',
    }
  },
};

const DialogBoxHeaderText = styled.p`
  font-family: ${helpers.commonFont};
  color: ${helpers.textColor};
  font-weight: 500;
`;

const ButtonsWrapper = styled.div`
  display: flex;

  @media screen and (max-width : ${helpers.mobile}px) {
    display: flex;
    flex-direction: column-reverse;
    padding-top: ${helpers.rhythmDiv}px;
  }
`;

const TermsOfServiceDialogBox = (props) => (
  <Dialog
    open={props.open}
    onClose={props.onModalClose}
    onRequestClose={props.onModalClose}
    aria-labelledby="terms-of-service"
    classes={{paper: props.classes.dialogPaper}}
    itemScope
    itemType="http://schema.org/Service"
  >
  <MuiThemeProvider theme={muiTheme}>

    <DialogBoxHeaderText>
      Before you can register you must agree to the SkillShape's Terms Of Service
    </DialogBoxHeaderText>

    <DialogActions classes={{root: props.classes.dialogAction}}>
        <PrimaryButton
            fullWidth={true}
            label="I agree"
            onClick={props.onAgreeButtonClick}
            itemScope
            itemType="http://schema.org/AgreeAction">
        </PrimaryButton>
        <TermsOfServiceButton
            label="Terms Of Service"
            onAgreeButtonClick={props.onAgreeButtonClick}
            onDisAgreeButtonClick={props.onModalClose}
        />
        <Button
            style={{ width: '100%', backgroundColor: helpers.danger, marginTop: 10, color:'#fff'}}
            onClick={props.onModalClose}
        >
            Cancel
        </Button>
    </DialogActions>

    </MuiThemeProvider>
  </Dialog>
);

TermsOfServiceDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  onAgreeButtonClick: PropTypes.func,
  onTermsOfServiceButtonClick: PropTypes.func,
}

export default withStyles(styles)(TermsOfServiceDialogBox);
