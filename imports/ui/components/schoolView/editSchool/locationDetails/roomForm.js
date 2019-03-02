import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle, withMobileDialog } from "material-ui/Dialog";
import { withStyles } from "material-ui/styles";
import TextField from "material-ui/TextField";
import React from "react";
import styled from "styled-components";
import "/imports/api/sLocation/methods";
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import SkillShapeDialogBox from "/imports/ui/components/landing/components/dialogs/SkillShapeDialogBox.jsx";
import { mobile, rhythmDiv } from "/imports/ui/components/landing/components/jss/helpers.js";
import { ContainerLoader } from "/imports/ui/loading/container";
import { withPopUp,confirmationDialog } from "/imports/util";
import {get} from 'lodash';

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
    this.state = this.initializeState(this.props);
  }
  
  initializeState = (props) =>{
    let state =  {
      isBusy: false,
      isSaved:true,
      name: get(props,'data.name','Main Room'),
      capacity: get(props,'data.capacity',null)
    }
    return state;
  }
  saveRoomFormData = (nextTab, event) => {
    event.preventDefault();
    const { data, parentKey } = this.props;
    const {name,capacity} = this.state;
    if (!name) {
      const {popUp} =this.props;
      const content = 'Location Name is required.';
      confirmationDialog({popUp,errDialog:true,content});
      return false;
    }

    const payload = {
      name: name
    };
    if (capacity ){
      payload.capacity = capacity;
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
      let stateObj = { isBusy: false,isSaved:true };
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
  handleDataChange = name => event => {
    const value = event.target.value;
    this.setState({
      [name]:value,
      isSaved:false
    })
  }
  unSavedChecker = () => {
    const {isSaved} = this.state;
    const {onClose,popUp} = this.props;
    if(isSaved){
      onClose();
    }else{
      let data = {};
      data = {
        popUp,
        title: 'Oops',
        type: 'alert',
        content: 'You have still some unsaved changes. Please save first.',
        buttons: [{ label: 'Close Anyway', onClick:onClose, greyColor: true },{ label: 'Ok', onClick:()=>{}}]
      }
      confirmationDialog(data);
    }

  }
  render() {
    const { fullScreen, data, classes } = this.props;
    const {name,capacity} = this.state;
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
                <TextField
                  required={true}
                  margin="dense"
                  label="Name"
                  value={name}
                  type="text"
                  onChange={this.handleDataChange('name')}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Capacity"
                  type="number"
                  value={capacity}
                  fullWidth
                  onChange={this.handleDataChange('capacity')}
                  inputProps={{ min: "0"}}
                />
            </DialogContent>
          )}
          <DialogActions classes={{ root: classes.dialogActionsRoot }}>
            {data && (
              <ButtonWrapper>
                <FormGhostButton
                  color="alert"
                  type="button"
                  onClick={() => this.setState({ showConfirmationModal: true })}
                  label="Delete"
                />
              </ButtonWrapper>
            )}
            <ButtonWrapper>
              <FormGhostButton
              type="button"
                color="dark-grey"
                onClick={this.unSavedChecker}
                label="Cancel"
              />
            </ButtonWrapper>
            <ButtonWrapper>
              <FormGhostButton
                type="button"
                onClick={this.saveRoomFormData.bind(this, null)}
                label={data ? "Save" : "Submit"}
              />
            </ButtonWrapper>
            {this.props && this.props.from && this.props.from=='classTime' ? '' : <ButtonWrapper>
              <FormGhostButton
                type="button"
                onClick={this.saveRoomFormData.bind(this, "nextTab")}
                label="Save and Add Classes"
              />
            </ButtonWrapper>}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(withPopUp(withMobileDialog()(RoomForm)));
