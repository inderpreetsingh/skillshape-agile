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
import * as helpers from '../jss/helpers';
import muiTheme from '../jss/muitheme';

const styles = {
  dialogPaper: {
    padding: `${helpers.rhythmDiv * 2}px`,
  },
  dialogAction: {
    justifyContent: 'center',
  },
  dialogContent: {
    '@media screen and (max-width : 500px)': {
      minHeight: '150px',
    },
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

const WrongEmailAddressDialogBox = props => (
  <Dialog
    open={props.open}
    onClose={props.onModalClose}
    onRequestClose={props.onModalClose}
    aria-labelledby="terms-of-service"
    classes={{ paper: props.classes.dialogPaper }}
    itemScope
    itemType="http://schema.org/ConfirmAction"
  >
    <MuiThemeProvider theme={muiTheme}>
      <DialogTitle>
        <DialogTitleWrapper>
          <span itemProp="name">Wrong Email</span>
          {' '}
!
          <IconButton color="primary" onClick={props.onModalClose}>
            <ClearIcon />
          </IconButton>
        </DialogTitleWrapper>
      </DialogTitle>

      <DialogContent className={props.classes.dialogContent}>
        <Typography>
          We will look into the issue and contact the school phone. In the meantime do you want to
          start the listing from scratch or claim for existing listing ?
        </Typography>
      </DialogContent>

      <DialogActions classes={{ root: props.classes.dialogAction }}>
        <ButtonsWrapper>
          <PrimaryButton
            label="I will start new listing"
            onClick={props.onAgreeButtonClick}
            itemScope
            itemType="http://schema.org/AgreeAction"
          />
          <Button
            color="primary"
            onClick={props.onDisAgreeButtonClick}
            itemScope
            itemType="http://schema.org/DisagreeAction"
          >
            {' '}
            I can wait for confirmation
          </Button>
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
};

export default withStyles(styles)(WrongEmailAddressDialogBox);
