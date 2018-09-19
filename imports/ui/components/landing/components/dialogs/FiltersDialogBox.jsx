import React, { Component } from "react";
import PropTypes from "prop-types";
import Recaptcha from "react-recaptcha";
import styled from "styled-components";
import { SocialIcon } from "react-social-icons";

import IconButton from "material-ui/IconButton";
import ClearIcon from "material-ui-icons/Clear";
import Typography from "material-ui/Typography";
import { withStyles } from "material-ui/styles";
import { MuiThemeProvider } from "material-ui/styles";

import AttachedAlert from "/imports/ui/components/landing/components/helpers/AttachedAlert.jsx";
import PrimaryButton from "../buttons/PrimaryButton.jsx";
import FilterPanel from "../FilterPanel.jsx";
import IconInput from "../form/IconInput.jsx";

import * as helpers from "../jss/helpers.js";
import muiTheme from "../jss/muitheme.jsx";
import config from "/imports/config";

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  withMobileDialog
} from "material-ui/Dialog";

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
    "@media screen and (max-width : 500px)": {
      minHeight: "150px"
    }
  },
  dialogContentRoot: {
    width: "100%",
    padding: `0 ${helpers.rhythmDiv * 3}px`,
    paddingTop: helpers.rhythmDiv * 2,
    margin: 0,
    "@media screen and (max-width : 500px)": {
      padding: `0 ${helpers.rhythmDiv * 3}px`
    }
  },
  iconButton: {
    height: "auto",
    width: "auto"
  }
};

const AttachedAlertWrapper = styled.div`
  position: absolute;
  top: 50px;
  right: ${helpers.rhythmDiv * 6}px;
`;

const DialogTitleContainer = styled.div`
  ${helpers.flexCenter};
  margin: 0 0 ${helpers.rhythmDiv * 2}px 0;
  padding: 0 ${helpers.rhythmDiv * 3}px;
`;

const DialogTitle = styled.h1`
  ${helpers.flexCenter};
  font-family: ${helpers.specialFont};
  font-weight: 500;
  width: 100%;
  margin: 0;

  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: ${helpers.baseFontSize * 1.25}px;
  }
`;

class FiltersDialogBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterDialogBoxNoSearch: true
    };
  }

  componentWillReceiveProps(nextProps) {
    console.info(
      this.props.filterPanelProps,
      nextProps.filterPanelProps,
      "component will receive props....................."
    );
    if (
      this.props.filterPanelProps.isCardsBeingSearched !==
      nextProps.filterPanelProps.isCardsBeingSearched
    )
      this.setState({
        filterDialogBoxNoSearch: false
      });
  }

  render() {
    const {
      classes,
      open,
      title,
      fullScreen,
      onModalClose,
      filterPanelProps,
      filtersForSuggestion,
      onGiveSuggestion
    } = this.props;

    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onModalClose}
        onRequestClose={onModalClose}
        aria-labelledby="filters-dialog-box"
        classes={{ paper: classes.dialogPaper }}
      >
        <MuiThemeProvider theme={muiTheme}>
          <DialogTitleContainer>
            <DialogTitle>{title}</DialogTitle>
            <IconButton
              color="primary"
              onClick={onModalClose}
              classes={{ root: classes.iconButton }}
            >
              <ClearIcon />
            </IconButton>
          </DialogTitleContainer>

          <DialogContent
            classes={{
              root: classes.dialogContentRoot
            }}
          >
            <AttachedAlertWrapper>
              <AttachedAlert
                open={
                  !filterPanelProps.isCardsBeingSearched &&
                  !this.state.filterDialogBoxNoSearch
                }
                alertMsg={"Search criteria updated"}
              />
            </AttachedAlertWrapper>
            <FilterPanel
              {...filterPanelProps}
              filtersInDialogBox
              onModalClose={onModalClose}
              onGiveSuggestion={onGiveSuggestion}
              filtersForSuggestion={filtersForSuggestion}
            />
          </DialogContent>
        </MuiThemeProvider>
      </Dialog>
    );
  }
}

FiltersDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
  filterPanelProps: PropTypes.object,
  filtersForSuggestion: PropTypes.bool,
  onGiveSuggestion: PropTypes.func,
  open: PropTypes.bool,
  errorText: PropTypes.string,
  unsetError: PropTypes.func
};

FiltersDialogBox.defaultProps = {
  title: "Filter Content",
  onGiveSuggestion: () => {}
};

export default withMobileDialog()(withStyles(styles)(FiltersDialogBox));
