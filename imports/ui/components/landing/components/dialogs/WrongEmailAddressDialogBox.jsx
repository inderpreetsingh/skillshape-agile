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
    justifyContent: 'center'
  },
  dialogContent :  {
    '@media screen and (max-width : 500px)': {
      minHeight: '150px',
    }
  },
};

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  width: 100%;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const WrongEmailAddressDialogBox = (props) => (
  <Dialog
    open={props.open}
    onClose={props.onModalClose}
    onRequestClose={props.onModalClose}
    aria-labelledby="terms-of-service"
    classes={{paper: props.classes.dialogPaper}}
  >
  <MuiThemeProvider theme={muiTheme}>

    <DialogTitle>
      <DialogTitleWrapper>
        Wrong Email !

        <IconButton color="primary" onClick={props.onModalClose}>
          <ClearIcon/>
        </IconButton >
      </DialogTitleWrapper>
    </DialogTitle>

    <DialogContent className={props.classes.dialogContent}>
      <Typography>
        We will look into the issue and contact the school phone. In the meantime do you want to start the listing from scratch or claim for existing listing ?
      </Typography>
    </DialogContent>

    <DialogActions classes={{root: props.classes.dialogAction}}>
      <ButtonsWrapper>
        <PrimaryButton label="I will start new listing" onClick={props.onAgreeButtonClick}></PrimaryButton>
        <Button color="primary" onClick={props.onDisAgreeButtonClick}> I can wait for confirmation</Button>
      </ButtonsWrapper>
    </DialogActions>

    </MuiThemeProvider>
  </Dialog>
);

WrongEmailAddressDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  onAgreeButtonClick: PropTypes.func,
  onDisAgreeButtonClick: PropTypes.func,
}

export default withStyles(styles)(WrongEmailAddressDialogBox);
