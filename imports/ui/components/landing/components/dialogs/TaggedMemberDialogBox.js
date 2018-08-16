import React, { Component, Fragment } from "react";
import styled from "styled-components";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";
import Grid from "material-ui/Grid";
import Radio, { RadioGroup } from "material-ui/Radio";
import Input, { InputLabel, InputAdornment } from "material-ui/Input";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import Checkbox from "material-ui/Checkbox";
import { withStyles } from "material-ui/styles";
import { MuiThemeProvider } from "material-ui/styles";
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";

import * as helpers from "../jss/helpers.js";
import muiTheme from "../jss/muitheme.jsx";

import Dialog, { withMobileDialog } from "material-ui/Dialog";

import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText
} from "material-ui/Form";

import { ContainerLoader } from "/imports/ui/loading/container";

const styles = {
  dialogPaper: {
    padding: `${helpers.rhythmDiv * 2}px`
  }
};

const ErrorWrapper = styled.span`
  color: red;
  margin: 15px;
`;

class TaggedMemberDialogBox extends Component {
  constructor(props) {
    super(props);
    this.state = this.initializeState();
  }

  initializeState = () => {
    const taggedMemberIds = get(
      this.props,
      "currentMediaData.taggedMemberIds",
      []
    );
    let state = {
      mediaDefaultValue: get(
        this.props,
        `currentMediaData.users_permission[${Meteor.userId()}].accessType`,
        "public"
      ),
      memberTaggedStatus:
        taggedMemberIds.indexOf(get(this.props, "memberInfo._id")) != -1,
      isBusy: false,
      error: ""
    };
    return state;
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleMediaSettingChange = event => {
    this.setState({
      mediaDefaultValue: event.target.value
    });
  };

  // This is used to handle "Untag me" and change User specific media settings.
  onSubmit = event => {
    event.preventDefault();
    const mediaId = get(this.props, "currentMediaData._id");
    const payload = {
      users_permission: {
        [Meteor.userId()]: {
          accessType: this.state.mediaDefaultValue
        }
      },
      taggedObj: {
        memberId: get(this.props, "memberInfo._id"),
        memberTaggedStatus: this.state.memberTaggedStatus
      }
    };

    if (mediaId) {
      this.setState({ isBusy: true });
      Meteor.call("media.editMedia", mediaId, payload, (err, res) => {
        let state = { isBusy: false };

        if (err) {
          state.error = err.reason || err.message;
        }

        this.setState(state);
      });
    } else {
      this.setState({ error: "Access Denied!!!" });
    }
  };

  render() {
    const {
      classes,
      open,
      fullScreen,
      onModalClose,
      onUntagMeButtonClick,
      onEditButtonClick,
      currentMediaData,
      schoolData
    } = this.props;

    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onModalClose}
        onRequestClose={onModalClose}
        aria-labelledby="sign-up"
        classes={{ paper: classes.dialogPaper }}
      >
        <MuiThemeProvider theme={muiTheme}>
          <form onSubmit={this.onSubmit}>
            {this.state.isBusy && <ContainerLoader />}
            <Grid container>
              <Grid item md={4} sm={4} xs={4}>
                <Typography>Media Title:</Typography>
              </Grid>
              <Grid item md={8} sm={8} xs={8}>
                <Typography>{currentMediaData.name}</Typography>
              </Grid>
              <Grid item md={4} sm={4} xs={4}>
                <Typography>Members:</Typography>
              </Grid>
              <Grid item md={8} sm={8} xs={8}>
                {!isEmpty(currentMediaData.taggedMemberData) &&
                  currentMediaData.taggedMemberData.map(userData => {
                    if (userData.firstName && userData.lastName) {
                      return `${userData.firstName} ${userData &&
                        userData.lastName}`;
                    } else {
                      return `${userData.firstName}`;
                    }
                  })}
                <Typography />
              </Grid>
              <Grid item md={4} sm={4} xs={4}>
                <Typography>School:</Typography>
              </Grid>
              <Grid item md={8} sm={8} xs={8}>
                <Typography>{schoolData.name}</Typography>
              </Grid>
              {Meteor.userId() !== currentMediaData.createdBy && (
                <Fragment>
                  <Grid item md={4} sm={4} xs={4}>
                    <Typography>You are tagged:</Typography>
                  </Grid>
                  <Grid item md={8} sm={8} xs={8}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.memberTaggedStatus}
                          onChange={this.handleChange("memberTaggedStatus")}
                          value="memberTaggedStatus"
                          color="primary"
                        />
                      }
                      label="Untag Me"
                    />
                  </Grid>
                </Fragment>
              )}
              <Grid item md={4} sm={4} xs={4}>
                <Typography>Permissions:</Typography>
              </Grid>
              <Grid item md={8} sm={8} xs={8}>
                <FormControl component="fieldset" required>
                  <RadioGroup
                    aria-label="mediaSetting"
                    value={this.state.mediaDefaultValue}
                    name="mediaSetting"
                    onChange={this.handleMediaSettingChange}
                    defaultSelected="both"
                    style={{ display: "inline" }}
                  >
                    <FormControlLabel
                      value="public"
                      control={<Radio />}
                      label="Public"
                    />
                    <FormControlLabel
                      value="member"
                      control={<Radio />}
                      label="School only"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              {currentMediaData.desc && (
                <Grid container style={{ padding: 8 }}>
                  <Grid item md={4} sm={4} xs={4}>
                    <Typography>Notes:</Typography>
                  </Grid>
                  <Grid item md={8} sm={8} xs={8}>
                    <Typography>{currentMediaData.desc}</Typography>
                  </Grid>
                </Grid>
              )}
              <Grid
                item
                md={12}
                sm={12}
                xs={12}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                {/* <Button style={{ backgroundColor: "#ffd740" }}>
                  Report as inappropriate
                </Button> */}
                <FormGhostButton
                  darkGreyColor
                  label='Report as inappropriate'
                />
                {this.state.error && (
                  <ErrorWrapper>{this.state.error}</ErrorWrapper>
                )}
                {Meteor.userId() == currentMediaData.createdBy ? (
                  // <Button
                  //   style={{ backgroundColor: "#4caf50" }}
                  //   onClick={this.props.openEditTaggedModal}
                  // >
                  //   Edit
                  // </Button>
                  <FormGhostButton
                    label='Edit'
                    onClick={this.props.openEditTaggedModal}
                  />
                ) : (
                    // <Button type="submit" style={{ backgroundColor: "#ffd740" }}>
                    //   Save
                    // </Button>
                    <FormGhostButton
                      type='submit'
                      label='Save'
                    />
                  )}
              </Grid>
            </Grid>
          </form>
        </MuiThemeProvider>
      </Dialog>
    );
  }
}

TaggedMemberDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  currentMediaData: PropTypes.object.isRequired,
  memberInfo: PropTypes.object.isRequired
};

export default withMobileDialog()(withStyles(styles)(TaggedMemberDialogBox));
