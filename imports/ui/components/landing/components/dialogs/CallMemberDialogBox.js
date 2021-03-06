import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import PrimaryButton from "../buttons/PrimaryButton";
import IconButton from "material-ui/IconButton";
import ClearIcon from "material-ui-icons/Clear";
import PhoneIcon from "material-ui-icons/Phone";

import { MuiThemeProvider } from "material-ui/styles";
import { withStyles } from "material-ui/styles";

import * as helpers from "../jss/helpers.js";
import muiTheme from "../jss/muitheme.jsx";

import Dialog, {
  DialogContent,
  DialogTitle,
  withMobileDialog
} from "material-ui/Dialog";

import { ContainerLoader } from "/imports/ui/loading/container";

const styles = theme => {
  return {
    dialogTitleRoot: {
      padding: `${helpers.rhythmDiv * 3}px ${helpers.rhythmDiv *
        3}px 0 ${helpers.rhythmDiv * 3}px`,
      marginBottom: `${helpers.rhythmDiv * 2}px`
    },
    dialogContent: {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
      flexShrink: 0
    },
    dialogActionsRoot: {
      padding: "0 8px",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      justifyContent: "flex-start"
    },
    dialogActions: {
      width: "100%",
      paddingLeft: `${helpers.rhythmDiv * 2}px`
    },
    dialogRoot: {
      minHeight: "400px",
      maxWidth: "300px",
      width: "100%",
      [`@media screen and (max-width : ${helpers.mobile}px)`]: {
        maxWidth: "100%"
      }
    },
    phoneIcon: {
      width: 'auto',
      height: 'auto',
      marginRight: helpers.rhythmDiv,
      color: helpers.primaryColor,
      background: 'white'
    }
  };
};

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const DialogTitleWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  font-family: ${helpers.specialFont};
  width: 100%;
`;

const Title = styled.h2`
  display: inline-block;
  width: 100%;
  text-align: center;
  margin: ${helpers.rhythmDiv * 4}px 0;
  color: ${helpers.primaryColor};
  line-height: 1;
  font-weight: 300;
  font-style: italic;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize * 1.5}px;
`;

const CDWrapper = styled.div`
  ${helpers.flexCenter} display: inline-flex;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  padding: ${helpers.rhythmDiv}px;
  border: 1px solid ${helpers.primaryColor};
`;


const Contact = styled.a`
  color: ${helpers.primaryColor};
  font-size: 20px;

  :visited {
    color: ${helpers.primaryColor};
  }
`;

const CMTitle = Title.extend`
  margin: ${helpers.rhythmDiv * 2}px 0;
`;

const ContactDetails = props => (
  <CDWrapper>
    <IconButton color="primary" classes={{ root: props.classes.phoneIcon }} >phone</IconButton>
    <Contact href={`tel:${props.contactNumbers}`}>{props.contactNumbers}</Contact>
  </CDWrapper>
);

const CallMemberDialogBox = props => {
  // console.log(props,"...");
  return (
    <Dialog
      open={props.open}
      onClose={props.onModalClose}
      onRequestClose={props.onModalClose}
      aria-labelledby="contact us"
      classes={{ paper: props.classes.dialogRoot }}
    >
      <MuiThemeProvider theme={muiTheme}>
        <DialogTitle classes={{ root: props.classes.dialogTitleRoot }}>
          <DialogTitleWrapper>
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
          <ContentWrapper>
            <CMTitle>Phone Details:</CMTitle>
            {props.contactNumbers
              ? <ContactDetails {...props} />
              : "No Phone is provided yet"}

          </ContentWrapper>
        </DialogContent>
      </MuiThemeProvider>
    </Dialog>
  );
};

CallMemberDialogBox.propTypes = {
  onFormSubmit: PropTypes.func,
  onHandleInputChange: PropTypes.func,
  contactNumbers: PropTypes.arrayOf(PropTypes.strings),
  onModalClose: PropTypes.func,
  loading: PropTypes.bool
};

export default withMobileDialog()(withStyles(styles)(CallMemberDialogBox));
