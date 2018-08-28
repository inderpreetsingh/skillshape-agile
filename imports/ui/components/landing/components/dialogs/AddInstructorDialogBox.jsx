import React, { Component } from "react";
import { browserHistory } from "react-router";
import PropTypes from "prop-types";
import styled from "styled-components";
import IconButton from "material-ui/IconButton";
import ClearIcon from "material-ui-icons/Clear";
import { withStyles } from "material-ui/styles";

import { MuiThemeProvider } from "material-ui/styles";
import { Text } from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import Student from "/imports/ui/components/landing/components/icons/Student.jsx";
import School from "/imports/ui/components/landing/components/icons/School.jsx";

import Dialog, {
  DialogContent,
  DialogActions,
  DialogTitle,
  withMobileDialog
} from "material-ui/Dialog";

import muiTheme from "/imports/ui/components/landing/components/jss/muitheme.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const styles = theme => {
  return {
    dialogTitleRoot: {
      padding: `${helpers.rhythmDiv * 3}px ${helpers.rhythmDiv *
        3}px 0 ${helpers.rhythmDiv * 3}px`,
      marginBottom: `${helpers.rhythmDiv * 2}px`,
      "@media screen and (max-width : 500px)": {
        padding: `0 ${helpers.rhythmDiv * 3}px`
      }
    },
    dialogContent: {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
      paddingBottom: helpers.rhythmDiv * 2,
      flexGrow: 0,
      display: "flex",
      justifyContent: "center",
      minHeight: 200,
      "@media screen and (max-width : 500px)": {
        // minHeight: "150px"
      }
    },
    dialogRoot: {
      width: "100%"
    },
    iconButton: {
      height: "auto",
      width: "auto"
    }
  };
};

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  font-family: ${helpers.specialFont};
  width: 100%;
`;

const ContentWrapper = styled.div``;

const Title = styled.span`
  display: inline-block;
  width: 100%;
  text-align: center;
`;

class AddInstructorDialogBox extends Component {
  constructor(props) {
    super(props);
  }

  onSubmit = () => {};

  render() {
    const { props } = this;
    return (
      <Dialog
        open={props.open}
        onClose={props.onModalClose}
        onRequestClose={props.onModalClose}
        aria-labelledby="add instructor"
        classes={{ paper: props.classes.dialogRoot }}
      >
        <MuiThemeProvider theme={muiTheme}>
          <DialogTitle classes={{ root: props.classes.dialogTitleRoot }}>
            <DialogTitleWrapper>
              <Title>Add instructor</Title>
              <IconButton
                color="primary"
                onClick={props.onModalClose}
                classes={{ root: props.classes.iconButton }}
              >
                <ClearIcon />
              </IconButton>
            </DialogTitleWrapper>
          </DialogTitle>

          <DialogContent classes={{ root: props.classes.dialogContent }} />
        </MuiThemeProvider>
      </Dialog>
    );
  }
}

AddInstructorDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  loading: PropTypes.bool
};

export default withStyles(styles)(AddInstructorDialogBox);
