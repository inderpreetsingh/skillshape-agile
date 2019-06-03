import ClearIcon from 'material-ui-icons/Clear';
import Dialog, { DialogContent, DialogTitle, withMobileDialog } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import ContactUsForm from '../contactUs/ContactUsForm';
import * as helpers from '../jss/helpers';
import muiTheme from '../jss/muitheme';

const styles = theme => ({
  dialogTitleRoot: {
    padding: `${helpers.rhythmDiv * 3}px ${helpers.rhythmDiv * 3}px 0 ${helpers.rhythmDiv * 3}px`,
    marginBottom: `${helpers.rhythmDiv * 2}px`,
    '@media screen and (max-width : 500px)': {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
    },
  },
  dialogContent: {
    padding: `0 ${helpers.rhythmDiv * 3}px`,
    paddingBottom: helpers.rhythmDiv * 3,
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'center',
    '@media screen and (max-width : 500px)': {
      minHeight: '150px',
    },
  },
  dialogActionsRoot: {
    padding: '0 8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  dialogActions: {
    width: '100%',
    paddingLeft: `${helpers.rhythmDiv * 2}px`,
  },
  dialogRoot: {
    width: '100%',
  },
  iconButton: {
    height: 'auto',
    width: 'auto',
  },
});

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  font-family: ${helpers.specialFont};
  width: 100%;
`;

const Title = styled.span`
  display: inline-block;
  width: 100%;
  text-align: center;
`;

class ContactUsDialogBox extends Component {
  render() {
    const { props } = this;
    // console.log(props,"...");
    return (
      <Dialog
        fullScreen={props.fullScreen}
        open={props.open}
        onClose={props.onModalClose}
        onRequestClose={props.onModalClose}
        aria-labelledby="contact us"
        classes={{ paper: props.classes.dialogRoot }}
      >
        <MuiThemeProvider theme={muiTheme}>
          <DialogTitle classes={{ root: props.classes.dialogTitleRoot }}>
            <DialogTitleWrapper>
              <Title>Contact Us</Title>
              <IconButton
                color="primary"
                onClick={props.onModalClose}
                classes={{ root: props.classes.iconButton }}
              >
                <ClearIcon />
              </IconButton>
            </DialogTitleWrapper>
          </DialogTitle>

          <DialogContent classes={{ root: props.classes.dialogContent }}>
            <ContactUsForm
              dialogBox
              onToastrClose={props.onModalClose}
              onFormSubmit={props.onModalClose}
            />
          </DialogContent>
        </MuiThemeProvider>
      </Dialog>
    );
  }
}

ContactUsDialogBox.propTypes = {
  onFormSubmit: PropTypes.func,
  onHandleInputChange: PropTypes.func,
  onModalClose: PropTypes.func,
  loading: PropTypes.bool,
};

export default withMobileDialog()(withStyles(styles)(ContactUsDialogBox));
