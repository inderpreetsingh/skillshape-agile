import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import React from 'react';
import styled from 'styled-components';
import '/imports/api/sLocation/methods';
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton';
import SkillShapeDialogBox from '/imports/ui/components/landing/components/dialogs/SkillShapeDialogBox';
import { mobile, rhythmDiv } from '/imports/ui/components/landing/components/jss/helpers';
import { ContainerLoader } from '/imports/ui/loading/container';
import { withPopUp, confirmationDialog, unSavedChecker } from '/imports/util';
import { get } from 'lodash';


const styles = theme => ({
  button: {
    margin: 5,
    width: 150,
  },
  dialogActionsRoot: {
    [`@media screen and (max-width: ${mobile}px)`]: {
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
    },
  },
});

const ButtonWrapper = styled.div`
  margin-bottom: ${rhythmDiv}px;
`;

class RoomForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initializeState(this.props);
  }

  initializeState = (props) => {
    const { handleIsSavedState } = this.props;
    handleIsSavedState && handleIsSavedState(true);
    const state = {
      isBusy: false,
      name: get(props, 'data.name', 'Main Room'),
      capacity: get(props, 'data.capacity', null),
    };
    return state;
  };

  saveRoomFormData = (nextTab, event) => {
    event.preventDefault();
    const { data, parentKey } = this.props;
    const { name, capacity } = this.state;
    if (!name) {
      const { popUp } = this.props;
      const content = 'Location Name is required.';
      confirmationDialog({ popUp, errDialog: true, content });
      return false;
    }

    const payload = {
      name,
    };
    if (capacity) {
      payload.capacity = capacity;
    }
    this.setState({ isBusy: true });
    if (data) {
      payload.id = data.id;
      this.handleSubmit({
        methodName: 'location.editRoom',
        data: payload,
        locationId: parentKey,
        nextTab,
      });
    } else {
      this.handleSubmit({
        methodName: 'location.addRoom',
        data: payload,
        locationId: parentKey,
        nextTab,
      });
    }
  };

  handleSubmit = ({
    methodName, data, locationId, nextTab,
  }) => {
    Meteor.call(methodName, { locationId, data }, (error, result) => {
      const { handleIsSavedState } = this.props;
      handleIsSavedState && handleIsSavedState(true);
      const stateObj = { isBusy: false };
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

  handleDataChange = name => (event) => {
    const { handleIsSavedState } = this.props;
    handleIsSavedState && handleIsSavedState(true);
    const { value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  render() {
    const {
      fullScreen, data, classes, handleIsSavedState,
    } = this.props;
    const { name, capacity } = this.state;
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={() => {
            unSavedChecker.call(this);
          }}
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
              onAffirmationButtonClick={() => this.handleSubmit({
                methodName: 'location.roomRemove',
                data,
                locationId: this.props.parentKey,
              })
              }
              onModalClose={() => this.setState({ showConfirmationModal: false })}
            />
          )}
          {this.state.error ? (
            <div style={{ color: 'red' }}>{this.state.error}</div>
          ) : (
            <DialogContent>
              <DialogContentText>
                Please add one room at your location, even if there is only one room or area. You
                can say "Main Room" or "Main Area" or give the room name.
              </DialogContentText>
              <TextField
                required
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
                inputProps={{ min: '0' }}
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
                onClick={() => {
                  handleIsSavedState && handleIsSavedState(true);
                  this.props.onClose();
                }}
                label="Cancel"
              />
            </ButtonWrapper>
            <ButtonWrapper>
              <FormGhostButton
                type="button"
                onClick={this.saveRoomFormData.bind(this, null)}
                label={data ? 'Save' : 'Submit'}
              />
            </ButtonWrapper>
            {this.props && this.props.from && this.props.from == 'classTime' ? (
              ''
            ) : (
              <ButtonWrapper>
                <FormGhostButton
                  type="button"
                  onClick={this.saveRoomFormData.bind(this, 'nextTab')}
                  label="Save and Add Classes"
                />
              </ButtonWrapper>
            )}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(withPopUp(withMobileDialog()(RoomForm)));
