import React, { Component } from "react";
import PropTypes from "prop-types";
import Recaptcha from "react-recaptcha";
import styled from "styled-components";
import Input, { InputLabel } from "material-ui/Input";

import IconButton from "material-ui/IconButton";
import ClearIcon from "material-ui-icons/Clear";
import Typography from "material-ui/Typography";
import { withStyles } from "material-ui/styles";
import { MuiThemeProvider } from "material-ui/styles";

import PrimaryButton from "../buttons/PrimaryButton.jsx";

import * as helpers from "../jss/helpers.js";
import muiTheme from "../jss/muitheme.jsx";

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog
} from "material-ui/Dialog";

import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText
} from "material-ui/Form";

const styles = {
  dialogPaper: {
    padding: `${helpers.rhythmDiv * 2}px`,
    paddingBottom: `${helpers.rhythmDiv}px`
  },
  dialogTitleRoot: {
    display: "flex",
    fontFamily: `${helpers.specialFont}`
  },
  dialogContent: {
    display: "flex",
    padding: helpers.rhythmDiv * 2,
    paddingTop: 0
  },
  dialogAction: {
    width: "100%",
    margin: 0
  },
  iconButton: {
    height: "auto",
    width: "auto"
  },
  formControlRoot: {
    marginBottom: `${helpers.rhythmDiv * 2}px`
  }
};

const DialogBoxHeaderText = styled.p`
  font-family: ${helpers.commonFont};
  color: ${helpers.textColor};
`;

const DialogTitleContainer = styled.div`
  ${helpers.flexCenter};
  margin: 0 0 ${helpers.rhythmDiv * 2}px 0;
  padding: 0 ${helpers.rhythmDiv * 3}px;
`;

const DialogTitleWrapper = styled.h1`
  ${helpers.flexCenter};
  font-family: ${helpers.specialFont};
  font-weight: 500;
  width: 100%;
  margin: 0;

  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: ${helpers.baseFontSize * 1.25}px;
  }
`;

const ButtonWrapper = styled.div`
  min-width: 100px;
  margin-left: ${helpers.rhythmDiv}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    margin-left: 0;
    margin-top: ${helpers.rhythmDiv * 2}px;
    width: 100%;
  }
`;

const MyForm = styled.form`
  display: flex;
  align-items: flex-end;

  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
    align-items: center;
  }
`;

class SchoolGetStartedDialogBox extends Component {
  state = {
    email: ""
  };

  handleLetsJoinButtonClick = () => {
    if (this.props.onLetsJoinButtonClick) {
      this.props.onLetsJoinButtonClick();
    }
  };

  handleInputChange = e => {
    this.setState({
      email: e.target.value
    });
  };

  render() {
    const { classes, open, fullScreen, onModalClose } = this.props;

    return (
      <Dialog
        open={open}
        onClose={onModalClose}
        onRequestClose={onModalClose}
        aria-labelledby="school-getstarted-dialog-box"
        classes={{ paper: classes.dialogPaper }}
      >
        <MuiThemeProvider theme={muiTheme}>
          <DialogTitleContainer>
            <DialogTitleWrapper>Get Started</DialogTitleWrapper>
            <IconButton
              color="primary"
              onClick={onModalClose}
              classes={{ root: classes.iconButton }}
            >
              <ClearIcon />
            </IconButton>
          </DialogTitleContainer>

          <DialogContent classes={{ root: classes.dialogContent }}>
            <MyForm>
              <FormControl fullWidth>
                <InputLabel htmlFor="email">Email Id</InputLabel>
                <Input
                  autoFocus
                  id="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.handleInputChange}
                  fullWidth
                />
              </FormControl>

              <ButtonWrapper>
                <PrimaryButton
                  type="submit"
                  label="Lets join"
                  onClick={this.handleLetsJoinButtonClick}
                  noMarginBottom
                />
              </ButtonWrapper>
            </MyForm>
          </DialogContent>
        </MuiThemeProvider>
      </Dialog>
    );
  }
}

SchoolGetStartedDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool
};

export default withMobileDialog()(
  withStyles(styles)(SchoolGetStartedDialogBox)
);
