import React, { Component } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import styled from "styled-components";
import Grid from "material-ui/Grid";
import isEmpty from "lodash/isEmpty";
import Input, { InputLabel, InputAdornment } from "material-ui/Input";
import Radio, { RadioGroup } from "material-ui/Radio";
import {
  FormLabel,
  FormControl,
  FormControlLabel,
  FormHelperText
} from "material-ui/Form";
import Multiselect from "react-widgets/lib/Multiselect";
import Checkbox from "material-ui/Checkbox";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import { withStyles } from "material-ui/styles";
import { MuiThemeProvider } from "material-ui/styles";

import * as helpers from "../jss/helpers.js";
import muiTheme from "../jss/muitheme.jsx";

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog
} from "material-ui/Dialog";

import { ContainerLoader } from "/imports/ui/loading/container";

const styles = {
  dialogPaper: {
    padding: `${helpers.rhythmDiv * 2}px`
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
  dialogAction: {
    width: "100%",
    margin: 0
  },
  dialogActionsRoot: {
    width: "100%",
    padding: `0 ${helpers.rhythmDiv * 3}px`,
    margin: 0,
    "@media screen and (max-width : 500px)": {
      padding: `0 ${helpers.rhythmDiv * 3}px`
    }
  },
  dialogActionsRootButtons: {
    width: "100%",
    padding: `0 ${helpers.rhythmDiv}px`,
    margin: 0,
    "@media screen and (max-width : 500px)": {
      padding: `0 ${helpers.rhythmDiv}px`
    }
  },
  dialogActionsRootSubmitButton: {
    width: "100%",
    padding: `0 ${helpers.rhythmDiv * 3}px`,
    margin: 0,
    "@media screen and (max-width : 500px)": {
      padding: `0 ${helpers.rhythmDiv * 3}px`
    }
  },
  formControlRoot: {
    marginBottom: `${helpers.rhythmDiv * 2}px`
  }
};

const ErrorWrapper = styled.span`
  color: red;
  margin: 15px;
`;
const ConfirmationDialog = styled.div`
  margin: 8px;
`;
class EditTaggedMemberDialogBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mediaTitle: get(this.props, "currentMediaData.name"),
      schoolMembers: [],
      mediaNotes: get(this.props, "currentMediaData.desc"),
      taggedMemberIds: get(this.props, "currentMediaData.taggedMemberIds"),
      mediaDefaultValue: get(
        this.props,
        `currentMediaData.users_permission[${Meteor.userId()}].accessType`,
        "public"
      ),
      isBusy: true,
      error: "",
      noMember:false,
      checkedAll:false,
      taggedMemberData:this.props&&this.props.currentMediaData.taggedMemberData?this.props.currentMediaData.taggedMemberData:[]
     
    };
  }

  componentWillMount() {
    let schoolId = get(this.props, "currentMediaData.schoolId");
    if (schoolId) {
      this.setState({ isBusy: true });
      Meteor.call(
        "schoolMemberDetails.getAllSchoolMembers",
        { schoolId },
        (err, res) => {
          let state = { isBusy: false };

          if (err) {
            state.error = err.reason || err.message;
          }

          if (res) {
            state.schoolMembers = res || [];
          }

          this.setState(state);
        }
      );
    }
  }

  handleMediaSettingChange = (event, type) => {
    this.setState({ mediaDefaultValue: type });
  };

  onSubmit = event => {
    event.preventDefault();
    if(!isEmpty(this.state.taggedMemberIds))
    {
      const mediaId = get(this.props, "currentMediaData._id");
      const payload = {
        name: this.state.mediaTitle,
        desc: this.state.mediaNotes,
        taggedMemberIds: this.state.taggedMemberIds,
        users_permission: {
          [Meteor.userId()]: { accessType: this.state.mediaDefaultValue }
        }
      };
  
      if (mediaId) {
        this.setState({ isBusy: true });
        Meteor.call("media.editMedia", mediaId, payload, (err, res) => {
          let state = { isBusy: false };
  
          if (err) {
            state.error = err.reason || err.message;
          }
  
          this.setState(state, () => {
            if (res) {
              this.props.onModalClose();
            }
          });
        });
      } else {
        this.setState({ error: "Access Denied!!!" });
      }
    }else{
      this.setState({noMember:true})
    }
   
  };

  collectSchoolMembers = values => {
    this.setState({ taggedMemberIds: values.map(ele => ele._id) });
  };
  //1.add all members id into taggedmemberids if checked otherwise empty
  //2.set checked value into the state 
  //3.show slected values into the multiselect.
handleChange=(e)=>{
  e.target.checked?this.setState({checkedAll:e.target.checked,taggedMemberIds: this.state.schoolMembers.map(ele => ele._id)}):this.setState({checkedAll:e.target.checked,taggedMemberIds: [],taggedMemberData:[]})
}
  deleteMedia = () => {
    this.setState({ isBusy: true });
    Meteor.call(
      "media.removeMedia",
      this.props.currentMediaData,
      (error, result) => {
        let state = { isBusy: false };
        if (error) {
          state.error = error.reason || error.message;
        }

        this.setState(state, () => {
          if (result) {
            this.props.onModalClose();
          }
        });
        // this.setState();
      }
    );
  };

  render() {
    const {
      classes,
      open,
      fullScreen,
      onModalClose,
      onUntagMeButtonClick,
      onEditButtonClick,
      currentMediaData
    } = this.props;

    const { mediaDefaultValue, isBusy, error } = this.state;
    // This is used to save Tagged media details
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
          {isBusy && <ContainerLoader />}
          <form onSubmit={this.onSubmit}>
            <Grid container>
              <Grid item md={4} sm={4} xs={4}>
                <Typography>Media Title:</Typography>
              </Grid>
              <Grid item md={8} sm={8} xs={8}>
                <Input
                  type="text"
                  value={this.state.mediaTitle}
                  onChange={event =>
                    this.setState({ mediaTitle: event.target.value })
                  }
                />
              </Grid>
              <Grid item md={4} sm={4} xs={4}>
                <Typography>Members: </Typography>
              </Grid>
              <Grid item md={8} sm={8} xs={8}>
              <FormControl fullWidth margin="dense">
                <FormControlLabel
                  control={
                  <Checkbox
                  checked={this.state.checkedAll}
                  onChange={(e)=>{this.handleChange(e)}}
                  value="checkedAll"
              />
                  }
                  label="Select All Members"
                />
              </FormControl>

             
              {!this.state.checkedAll &&  <Multiselect
                  textField={'firstName'}
                  valueField={"activeUserId"}
                  data={this.state.schoolMembers}
                  placeholder="School Members"
                  defaultValue={this.state.taggedMemberData}
                  onChange={this.collectSchoolMembers}
                /> }
               
              </Grid>
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
                  >
                    <FormControlLabel
                      value="public"
                      control={<Radio />}
                      label="Make media public so you can share them on social media."
                    />
                    <FormControlLabel
                      value="member"
                      control={<Radio />}
                      label="Make media from a school only available to members of the school that posted it."
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item md={4} sm={4} xs={4}>
                <Typography>Notes:</Typography>
              </Grid>
              <Grid item md={8} sm={8} xs={8}>
                <Input
                  value={this.state.mediaNotes}
                  onChange={event =>
                    this.setState({ mediaNotes: event.target.value })
                  }
                  fullWidth
                  style={{ border: "1px solid", backgroundColor: "#fff" }}
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid
                item
                item
                sm={12}
                xs={12}
                md={12}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                {error && <ErrorWrapper>{error}</ErrorWrapper>}
                <Button
                  style={{ color: helpers.danger }}
                  onClick={this.deleteMedia}
                >
                  Delete this image
                </Button>
                <Button
                  style={{ color: helpers.cancel }}
                  onClick={onModalClose}
                >
                  Cancel
                </Button>
                <Button type="submit" style={{ color: helpers.action }}>
                  Save
                </Button>
              </Grid>
            </Grid>
          </form>
        </MuiThemeProvider>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="xs"
          open={this.state.noMember}
          aria-labelledby="confirmation-dialog-title"
        >
          <DialogTitle id="confirmation-dialog-title">Confirmation</DialogTitle>
          <ConfirmationDialog>
            Please Select at least one member.
          </ConfirmationDialog>
          <DialogActions>
          
            <Button
              color="primary"
              onClick={() => this.setState({noMember:false})}
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </Dialog>
    );
  }
}

EditTaggedMemberDialogBox.propTypes = {
  currentMediaData: PropTypes.object.isRequired,
  onModalClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool
};

export default withMobileDialog()(
  withStyles(styles)(EditTaggedMemberDialogBox)
);
