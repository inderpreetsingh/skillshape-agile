import React from "react";
import styled from "styled-components";
import { ContainerLoader } from "/imports/ui/loading/container";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  withMobileDialog
} from "material-ui/Dialog";
import ConfirmationModal from "/imports/ui/modal/confirmationModal";
import SkillShapeDialogBox from "/imports/ui/components/landing/components/dialogs/SkillShapeDialogBox.jsx";
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import {
  mobile,
  rhythmDiv
} from "/imports/ui/components/landing/components/jss/helpers.js";

import "/imports/api/sLocation/methods";
import { toastrModal } from "/imports/util";

const formId = "RoomForm";

const styles = theme => {
  return {
    button: {
      margin: 5,
      width: 150
    },
    dialogActionsRoot: {
      [`@media screen and (max-width: ${mobile}px)`]: {
        flexWrap: "wrap",
        justifyContent: "flex-start"
      }
    }
  };
};

const ButtonWrapper = styled.div`
  margin-bottom: ${rhythmDiv}px;
`;

class RoomForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBusy: false
    };
  }

  saveRoomFormData = (nextTab, event) => {
    event.preventDefault();
    const { data, parentKey, toastr } = this.props;
    if (!this.roomName.value) {
      toastr.error("Please enter room name.", "Error");
      return false;
    }

    const payload = {
      name: this.roomName.value
    };
    if (this.capicity.value) {
      payload.capicity = this.capicity.value;
    }
    this.setState({ isBusy: true });
    if (data) {
      payload.id = data.id;
      this.handleSubmit({
        methodName: "location.editRoom",
        data: payload,
        locationId: parentKey,
        nextTab: nextTab
      });
    } else {
      this.handleSubmit({
        methodName: "location.addRoom",
        data: payload,
        locationId: parentKey,
        nextTab: nextTab
      });
    }
  };

  handleSubmit = ({ methodName, data, locationId, nextTab }) => {
    Meteor.call(methodName, { locationId, data }, (error, result) => {
      let stateObj = { isBusy: false };
      if (error) {
        stateObj.error = error.reason || error.message;
      }
      if (result) {
        this.props.onClose();
        if (nextTab) {
          this.props.moveToNextTab();
        }
      }
      this.setState(stateObj);
      // this.setState();
    });
  };

  render() {
    const { fullScreen, data, classes } = this.props;
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.props.onClose}
          aria-labelledby="form-dialog-title"
          fullScreen={fullScreen}
        >
          <DialogTitle id="form-dialog-title" />
          {this.state.isBusy && <ContainerLoader />}
          {this.state.showConfirmationModal && (
            <SkillShapeDialogBox
              type="alert"
              defaultButtons
              open={this.state.showConfirmationModal}
              affirmateBtnText="Yes, Delete"
              cancelBtnText="Cancel"
              title="Are you sure?"
              content="You will delete this room, so want to delete it?"
              onAffirmationButtonClick={() =>
                this.handleSubmit({
                  methodName: "location.roomRemove",
                  data: data,
                  locationId: this.props.parentKey
                })
              }
              onModalClose={() =>
                this.setState({ showConfirmationModal: false })
              }
            />
          )}
          {this.state.error ? (
            <div style={{ color: "red" }}>{this.state.error}</div>
          ) : (
            <DialogContent>
              <DialogContentText>
                Please add one room at your location, even if there is only one
                room or area. You can say "Main Room" or "Main Area" or give the
                room name.
              </DialogContentText>
              <form id={formId} onSubmit={this.onSubmit}>
                <TextField
                  required={true}
                  defaultValue={(data && data.name) || "Main Room"}
                  margin="dense"
                  inputRef={ref => (this.roomName = ref)}
                  label="Name"
                  type="text"
                  fullWidth
                />
                <TextField
                  defaultValue={data && data.capicity}
                  margin="dense"
                  inputRef={ref => (this.capicity = ref)}
                  label="Capicity"
                  type="number"
                  fullWidth
                />
              </form>
            </DialogContent>
          )}
          <DialogActions classes={{ root: classes.dialogActionsRoot }}>
            {data && (
              <ButtonWrapper>
                <FormGhostButton
                  color="alert"
                  onClick={() => this.setState({ showConfirmationModal: true })}
                  label="Delete"
                />
              </ButtonWrapper>
            )}
            <ButtonWrapper>
              <FormGhostButton
                color="dark-grey"
                onClick={() => this.props.onClose()}
                label="Cancel"
              />
            </ButtonWrapper>
            <ButtonWrapper>
              <FormGhostButton
                type="button"
                form={formId}
                onClick={this.saveRoomFormData.bind(this, null)}
                label={data ? "Save" : "Submit"}
              />
            </ButtonWrapper>
            <ButtonWrapper>
              <FormGhostButton
                type="button"
                form={formId}
                onClick={this.saveRoomFormData.bind(this, "nextTab")}
                label="Save and Add Classes"
              />
            </ButtonWrapper>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(toastrModal(withMobileDialog()(RoomForm)));
