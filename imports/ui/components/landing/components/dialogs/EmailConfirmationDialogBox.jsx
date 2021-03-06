import ClearIcon from 'material-ui-icons/Clear';
import Button from 'material-ui/Button';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import PrimaryButton from '../buttons/PrimaryButton';
import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';
import { ContainerLoader } from '/imports/ui/loading/container';





const styles = {
  dialogPaper: {
    padding: `${helpers.rhythmDiv * 2}px`
  },
  dialogAction : {
    '@media screen and (max-width : 500px)': {
      justifyContent: 'center',
    }
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

  @media screen and (max-width : ${helpers.mobile}px) {
    display: flex;
    flex-direction: column;
  }
`;

const EmailConfirmationDialogBox = (props) => (
  <Dialog
    open={props.open}
    onClose={props.onModalClose}
    onRequestClose={props.onModalClose}
    aria-labelledby="terms-of-service"
    classes={{paper: props.classes.dialogPaper}}
    itemScope
    itemType="http://schema.org/ConfirmAction"
  >
  <MuiThemeProvider theme={muiTheme}>
    { props.isLoading && <ContainerLoader/>}
    <DialogTitle>
      <DialogTitleWrapper>
       <span itemProp="name"> Email Confirmation</span>

        <IconButton color="primary" onClick={props.onModalClose}>
          <ClearIcon/>
        </IconButton >
      </DialogTitleWrapper>
    </DialogTitle>

    <DialogContent className={props.classes.dialogContent}>
      <Typography>
        <span itemProp="description">You will be sent to {props.schoolEmail} to confirm. is this correct ?</span>
      </Typography>
    </DialogContent>

    <DialogActions classes={{root: props.classes.dialogAction}}>
      <ButtonsWrapper>
        <PrimaryButton label="Yes" onClick={props.onAgreeButtonClick} itemScope itemType="http://schema.org/AgreeAction"></PrimaryButton>
        <Button color="primary" onClick={props.onDisAgreeButtonClick} itemScope itemType="http://schema.org/DisagreeAction"> No, address is wrong!</Button>
      </ButtonsWrapper>
    </DialogActions>

    </MuiThemeProvider>
  </Dialog>
);

EmailConfirmationDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  schoolEmail: PropTypes.string,
  onAgreeButtonClick: PropTypes.func,
  onDisAgreeButtonClick: PropTypes.func,
  isLoading: PropTypes.bool,
}

EmailConfirmationDialogBox.defaultProps = {
    schoolEmail: 'school@abc.com',
    isLoading: false,
}

export default withStyles(styles)(EmailConfirmationDialogBox);
