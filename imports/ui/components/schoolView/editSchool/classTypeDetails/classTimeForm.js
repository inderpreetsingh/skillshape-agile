import {
  flatten, get, includes, isEmpty, remove,
} from 'lodash';
import Checkbox from 'material-ui/Checkbox';
import Dialog, {
  DialogActions, DialogContent, DialogTitle, withMobileDialog,
} from 'material-ui/Dialog';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import PropTypes, { instanceOf } from 'prop-types';
import { OneTimeRow } from './oneTimeRow';
import { WeekDaysRow } from './weekDaysRow';
import '/imports/api/sLocation/methods';
import { MaterialDatePicker } from '/imports/startup/client/material-ui-date-picker';
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton';
import InstructorList from '/imports/ui/components/landing/components/classDetails/membersList/presentational/MembersList';
import AddInstructorDialogBox from '/imports/ui/components/landing/components/dialogs/AddInstructorDialogBox';
import PackageAttachment from '/imports/ui/components/landing/components/dialogs/PackageAttachement';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import { Text } from '/imports/ui/components/landing/components/jss/sharedStyledComponents';
import LocationForm from '/imports/ui/components/schoolView/editSchool/locationDetails/locationForm';
import RoomForm from '/imports/ui/components/schoolView/editSchool/locationDetails/roomForm';
import { ContainerLoader } from '/imports/ui/loading/container';
import ConfirmationModal from '/imports/ui/modal/confirmationModal';
import { unSavedChecker, withPopUp } from '/imports/util';
import ResponsiveTabs from '/imports/util/responsiveTabs';


const ButtonWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const ListWrapper = styled.div`
  padding: 0 ${helpers.rhythmDiv * 2}px;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const FormInputsWrapper = styled.div`
  padding: 0 ${helpers.rhythmDiv * 3}px;
`;

const DialogContentText = Text.extend`
  padding: 0;
  font-family: ${helpers.commonFont};
  color: ${helpers.secondaryTextColor};
`;

const CheckBoxText = Text.extend`
  font-family: ${helpers.commonFont};
  color: ${helpers.secondaryTextColor};
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const Instructors = styled.div`
  font-size: 17px;
  padding: ${helpers.rhythmDiv}px;
  background-color: aliceblue;
`;

const ClassTimeDataWrapper = styled.div`
  margin-top: ${helpers.rhythmDiv}px;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  padding: ${helpers.rhythmDiv * 3}px ${helpers.rhythmDiv * 2}px ${helpers.rhythmDiv * 4}px ${helpers.rhythmDiv * 2}px;
  background-color: ${helpers.panelColor};
`;

const styles = theme => ({
  delete: {
    backgroundColor: 'red',
    color: 'black',
    fontWeight: 600,
  },
  cancel: {
    backgroundColor: 'yellow',
    color: 'black',
    fontWeight: 600,
  },
  save: {
    backgroundColor: 'green',
    color: 'black',
    fontWeight: 600,
  },
  textField: {
    marginBottom: helpers.rhythmDiv,
  },
  formLabel: {
    color: helpers.black,
  },
  formControlLabel: {
    fontSize: helpers.baseFontSize,
  },
  checkBoxRoot: {
    marginLeft: 0,
    height: helpers.rhythmDiv * 3,
  },
  formControl: {
    marginBottom: helpers.rhythmDiv,
  },
  dialogContent: {
    padding: 0,
    paddingBottom: helpers.rhythmDiv * 3,
  },
  dialogActionsRoot: {
    [`@media screen and (max-width: ${helpers.mobile}px)`]: {
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
  },
});
const formId = 'classTimeForm';
class ClassTimeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initializeFields();
  }

  initializeFields = () => {
    const {
      data, locationData, parentData, instructorsData, handleIsSavedState,
    } = this.props;
    handleIsSavedState(true);
    const state = {
      roomData: [],
      roomId: '',
      locationId: '',
      startDate: new Date(),
      endDate: new Date(),
      tabValue: 2,
      closed: false,
      noOfRow: 0,
      PackageAttachment: false,
      PackageOpen: true,
      showLocationForm: false,
      showRoomForm: false,
      locId: '',
      instructors: [],
      instructorsData,
      parentData,
    };


    if (!isEmpty(parentData) && !isEmpty(parentData.selectedLocation)) {
      state.roomData = parentData.selectedLocation.rooms;
    }
    // Default selected tab accoring to data found for `ClassTimes` rec.
    if (!isEmpty(data)) {
      if (data.scheduleType === 'oneTime') {
        state.tabValue = 0;
      } else if (data.scheduleType === 'recurring') {
        state.tabValue = 1;
      } else if (data.scheduleType === 'OnGoing') {
        state.tabValue = 2;
      }
      state.startDate = data.startDate;
      state.startTime = data.startTime;
      state.endDate = data.endDate;
      state.duration = data.duration;
      state.roomId = data.roomId || '';
      state.locationId = data.locationId || '';
      state.closed = data.closed;
      state.instructors = get(data, 'instructors', []);
    }

    if (!state.locationId && !state.roomId) {
      state.locationId = locationData[0] && locationData[0]._id || '';
      state.roomData = locationData[0] && locationData[0].rooms && locationData[0].rooms || [];
      state.roomId = locationData[0] && locationData[0].rooms && locationData[0].rooms[0].id || '';
    } else {
      locationData.map((location) => {
        location && location.rooms ? location.rooms.map((room) => {
          if (room.id == state.roomId) {
            state.roomData = !isEmpty(location.rooms) ? location.rooms : [];
          }
        }) : state.roomData = [];
      });
    }


    return state;
  };

  onTabChange = (tabValue) => {
    this.setState({ tabValue });
    const { data } = this.props;
    if (tabValue == 0 && this.state.noOfRow != 0) {
      this.setState({ noOfRow: 0 });
    }
  };

  handleNoOfRow = (data) => {
    this.setState({ noOfRow: this.state.noOfRow + data });
  }

  handleChangeDate = (fieldName, date) => {
    const { handleIsSavedState } = this.props;
    handleIsSavedState(false);
    this.setState({ [fieldName]: new Date(date) });
  };

  handleLocAndRoom = (key, event) => {
    const { handleIsSavedState } = this.props;
    handleIsSavedState(false);
    if (event.target.value === 'add_new_location') {
      this.handleAddNewLocation();
      return;
    }

    if (key == 'roomId') {
      this.setState({ roomId: event.target.value });
    } else {
      this.setState({ locationId: event.target.value });
      const { locationData } = this.props;
      locationData.map((location) => {
        !isEmpty(location.rooms) ? location.rooms.map((room) => {
          if (location._id == event.target.value) {
            this.setState({
              roomData: !isEmpty(location.rooms) ? location.rooms : [],
              roomId: location.rooms && location.rooms[0].id || '',
            });
          }
        }) : this.setState({ roomId: '', roomData: [] });
      });
    }
  }

  handleSearchChange = type => (e) => {
    const { value } = e.target;
    this.setState(state => ({
      ...state,
      [type]: value,
    }));
  };

  handleAddInstructorDialogBoxState = dialogBoxState => () => {
    this.setState(state => ({
      ...state,
      addInstructorDialogBoxState: dialogBoxState,
    }));
  };

  submitClassTimes = (nextTab, addSeperateTime) => (event) => {
    event.preventDefault();
    this.saveClassTimes(nextTab, addSeperateTime, event);
  }

  saveClassTimes = (nextTab, addSeperateTimeJson, event) => {
    event.preventDefault();
    const {
      schoolId, data, parentKey, parentData, popUp,
    } = this.props;
    const { tabValue, locationId } = this.state;
    // console.log(this, "this...");
    // debugger;
    const payload = {
      schoolId,
      classTypeId: parentKey,
      name: this.classTimeName.value,
      desc: this.desc.value,
      locationId,
      closed: this.state.closed,
      roomId: this.state.roomId,
      instructors: this.state.instructors,
    };
    if (!this.classTimeName.value) {
      popUp.appear('alert', {
        title: 'Class Time Name Empty',
        content: 'Please Enter Class Time Name',
        RenderActions: (
          <FormGhostButton label="Ok" onClick={() => { }} applyClose />

        ),
      }, true);
      return false;
    }
    if (tabValue === 0) {
      payload.scheduleType = 'oneTime';
      payload.scheduleDetails = this.refs.oneTimeRow.getRowData();
      if (this.state.noOfRow < 2) {
        payload.closed = false;
      }
    } else if (tabValue === 1) {
      payload.scheduleType = 'recurring';
      payload.startDate = this.state.startDate;
      payload.endDate = this.state.endDate;
      payload.scheduleDetails = this.refs.weekDaysRow.getRowData();
    } else if (tabValue === 2) {
      payload.scheduleType = 'OnGoing';
      payload.startDate = new Date();
      payload.scheduleDetails = this.refs.weekDaysRow.getRowData();
    }
    if (data && data._id) {
      this.onSubmit({
        methodName: 'classTimes.editClassTimes',
        doc: payload,
        doc_id: data._id,
        nextTab,
        value: addSeperateTimeJson,
      });
    } else {
      this.onSubmit({
        methodName: 'classTimes.addClassTimes',
        doc: payload,
        nextTab,
        value: addSeperateTimeJson,
      });
    }
  };

  handleAddNewLocation = () => {
    this.setState({ showLocationForm: true });
  }

  onSubmit = ({
    methodName, doc, doc_id, value,
  }) => {
    this.setState({ isBusy: true });
    Meteor.call(methodName, { doc, doc_id }, (error, result) => {
      if (error) {
      }
      if (result) {
        if (value.addSeperateTime == false) {
          this.setState({
            PackageAttachment: true, PackageOpen: true, classTimeFormOnClose: this.props.onClose, value: value.addSeperateTime,
          });

          // this.props.onClose();
        } else if (value.addSeperateTime == true) {
          this.setState({
            PackageAttachment: true, PackageOpen: true, classTimeFormOnClose: this.props.onClose, value: value.addSeperateTime,
          });
          // this.props.onClose( value.addSeperateTime );
        } else if (value == 'delete') {
          this.props.onClose();
        } else {
          this.props.onClose();
          this.props.moveToNextTab();
        }
      }
      this.setState({ isBusy: false, error });
    });
  };

  // onsubmit1 for the handling again opening new classtime form
  closedCheckbox = () => {
    const { classes } = this.props;
    return (
      <Fragment>
        {(this.state.tabValue == 1 || this.state.tabValue == 0 && this.state.noOfRow >= 2)
        && (
        <Fragment>
          <FormControl fullWidth>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={this.state.closed}
                  onChange={() => {
                    this.setState({ closed: !this.state.closed });
                  }}
                  value="closed"
                  classes={{
                    root: classes.checkBoxRoot,
                  }}
                />
)}
              classes={{
                label: classes.formControlLabel,
              }}
              label="Make it closed series/set ?"
            />
          </FormControl>
          <CheckBoxText>
            This will close registration once the first class has started and students who join will be enrolled in the entire series.
          </CheckBoxText>
        </Fragment>
        )}
      </Fragment>
    );
  }

  instructorsIdsSetter = (instructorId, action) => {
    let { instructors } = this.state;
    if (action == 'add') {
      instructors.push(instructorId);
      instructors = flatten(instructors);
    } else if (action == 'remove') {
      instructors = remove(instructors, n => n != instructorId);
    }
    this.setState({ instructors, addInstructorDialogBoxState: false });
  }

  render() {
    const {
      data, classes, schoolId, parentKey, locationData, popUp, instructorsData, handleIsSavedState,
    } = this.props;
    const {
      roomId, locationId, roomData, addInstructorDialogBoxState, parentData,
    } = this.state;

    // let styleForBox = this.state.tabValue == 1 || this.state.tabValue == 0 && this.state.noOfRow >= 2 ? { border: '2px solid', padding: '7px', marginBottom: "2px", backgroundColor: "lightgray" } : {};
    const styleForBox = {};
    return (
      <div>
        <Dialog
          open={this.props.open}
          aria-labelledby="form-dialog-title"
          fullScreen={false}
          onClose={() => { unSavedChecker.call(this); }}
        >
          <DialogTitle id="form-dialog-title">Add Class Times</DialogTitle>
          {this.state.isBusy && <ContainerLoader />}
          {addInstructorDialogBoxState && (
            <AddInstructorDialogBox
              open={addInstructorDialogBoxState}
              onModalClose={this.handleAddInstructorDialogBoxState(false)}
              popUp={popUp}
              classTimeForm
              schoolId={schoolId}
              instructorsIdsSetter={this.instructorsIdsSetter}
              text="Admin"
            />
          )}
          {this.state.showConfirmationModal && (
            <ConfirmationModal
              open={this.state.showConfirmationModal}
              submitBtnLabel="Yes, Delete"
              cancelBtnLabel="Cancel"
              message="You will delete this Class Times, Are you sure?"
              onSubmit={() => this.onSubmit({
                methodName: 'classTimes.removeClassTimes',
                doc: data,
                doc_id: data,
                value: 'delete',
              })
              }
              onClose={() => this.setState({ showConfirmationModal: false })}
            />
          )}
          {this.state.showLocationForm && (
          <LocationForm
            open
            schoolId={schoolId}
            onClose={(result) => {
              if (result) this.setState({ showLocationForm: false, showRoomForm: true, locId: result });
              else this.setState({ showLocationForm: false });
            }}
            handleIsSavedState={handleIsSavedState}
          />
          )}
          {this.state.showRoomForm && this.state.locId
            && (
            <RoomForm
              parentKey={this.state.locId}
              open={this.state.showRoomForm}
              onClose={() => { this.setState({ showRoomForm: false }); }}
              from="classTime"
            />
            )}

          {this.state.error ? (
            <div style={{ color: 'red' }}>{this.state.error}</div>
          ) : (
            <DialogContent className={classes.dialogContent}>

              <form id={formId}>
                <FormInputsWrapper>
                  <TextField
                    required
                    defaultValue={data && data.name}
                    margin="dense"
                    inputRef={ref => (this.classTimeName = ref)}
                    label="Class Time Name"
                    type="text"
                    fullWidth
                    onChange={() => { handleIsSavedState(false); }}
                    className={classes.textField}
                  />

                  <DialogContentText>
                      This name helps differentiate different class times in the same
                      class type. Good examples include "Wednesday Night Swim" or
                      "Weekend Open Training."
                  </DialogContentText>

                  <TextField
                    defaultValue={data && data.desc}
                    margin="dense"
                    inputRef={ref => (this.desc = ref)}
                    label="Brief Description (200 Characters)"
                    type="text"
                    fullWidth
                    multiline
                    className={classes.textField}
                    onChange={() => { handleIsSavedState(false); }}
                    inputProps={{ maxLength: 200 }}
                  />
                  <FormControl className={classes.formControl} fullWidth margin="dense">
                    <InputLabel htmlFor="location">Location</InputLabel>
                    <Select
                      required
                      input={<Input id="location" />}
                      value={locationId}
                      onChange={this.handleLocAndRoom.bind(this, 'locationId')}
                      fullWidth
                    >
                      {/* isEmpty(locationData) && (
                          <MenuItem value="" disabled>
                            No location added in Locations.
                          </MenuItem>
                        ) */}
                      {locationData.map((data, index) => (
                        <MenuItem key={index} value={data._id}>
                          {`${
                            data.address ? `${data.address}, ` : ''
                          }${data.city ? `${data.city}, ` : ''} ${data.country ? data.country : ''}`}

                        </MenuItem>
                      ))}
                      <MenuItem key="add_location" value="add_new_location">
                          + Add New Location
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl className={classes.formControl} fullWidth margin="dense">
                    <InputLabel htmlFor="roomId">Room</InputLabel>
                    <Select
                      input={<Input id="roomId" />}
                      value={roomId}
                      onChange={this.handleLocAndRoom.bind(this, 'roomId')}
                      fullWidth
                    >
                      {_.isEmpty(roomData) && (
                      <MenuItem value="" disabled>
                            No location added in Locations.
                      </MenuItem>
                      )}
                      {roomData
                          && roomData.map((data, index) => (
                            <MenuItem key={index} value={data.id}>
                              {data.name}
                            </MenuItem>
                          ))}
                    </Select>
                  </FormControl>
                </FormInputsWrapper>

                <ClassTimeDataWrapper>
                  <ResponsiveTabs
                    variant="distributed"
                    defaultValue={1}
                    tabValue={this.state.tabValue}
                    tabs={['Single/Set', 'Series', 'Ongoing']}
                    color="primary"
                    onTabChange={this.onTabChange}
                  />

                  <div style={styleForBox}>
                    {this.closedCheckbox()}
                    {this.state.tabValue == 1 && (
                    <Grid container>
                      <Grid item sm={6} xs={12}>
                        <MaterialDatePicker
                          required
                          label="Start Date"
                          floatingLabelText="Start Date *"
                          value={this.state.startDate}
                          onChange={this.handleChangeDate.bind(
                            this,
                            'startDate',
                          )}
                          fullWidth
                        />
                      </Grid>
                      <Grid item sm={6} xs={12}>
                        <MaterialDatePicker
                          required
                          label="End Date"
                          floatingLabelText="End Date *"
                          value={this.state.endDate}
                          onChange={this.handleChangeDate.bind(
                            this,
                            'endDate',
                          )}
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                    )}
                  </div>

                  {this.state.tabValue === 0 && (
                  <div>
                    <OneTimeRow
                      ref="oneTimeRow"
                      data={
                            data
                            && data.scheduleDetails
                          }
                      roomData={this.state.roomData}
                      saveClassTimes={this.saveClassTimes}
                      handleNoOfRow={this.handleNoOfRow}
                      locationData={locationData}
                      handleIsSavedState={() => { handleIsSavedState(false); }}
                    />
                  </div>
                  )}
                  {(this.state.tabValue === 1 || this.state.tabValue === 2) && (
                  <div>
                    <WeekDaysRow
                      ref="weekDaysRow"
                      data={data && data.scheduleDetails}
                      roomData={this.state.roomData}
                      saveClassTimes={this.saveClassTimes}
                      locationData={locationData}
                      handleIsSavedState={() => { handleIsSavedState(false); }}
                    />
                  </div>
                  )}
                </ClassTimeDataWrapper>

                <ListWrapper>
                  <InstructorList
                    marginBottom={helpers.rhythmDiv * 2}
                    viewType="instructorsView"
                    searchedValue={this.state.teachersFilterWith}
                    onSearchChange={this.handleSearchChange('teachersFilterWith')}
                    data={instructorsData}
                    entityType="teachers"
                    onAddIconClick={this.handleAddInstructorDialogBoxState(true)}
                    popUp={popUp}
                    classTimeForm
                    instructorsIdsSetter={this.instructorsIdsSetter}
                    addInstructor
                    text="Instructor"
                  />
                </ListWrapper>

                <Instructors>
                    Instructors changes will show here after saving this class time.
                </Instructors>
              </form>
            </DialogContent>
          )}
          <DialogActions classes={{ root: this.props.classes.dialogActionsRoot }}>
            {!_.isEmpty(data) && (

              <ButtonWrapper>
                <FormGhostButton
                  alertColor
                  onClick={() => this.setState({ showConfirmationModal: true })}
                  label="Delete"
                  className={classes.delete}
                />
              </ButtonWrapper>
            )}
            <ButtonWrapper>
              <FormGhostButton
                darkGreyColor
                onClick={() => {
                  handleIsSavedState(true);
                  this.props.onClose();
                }}
                label="Cancel"
                className={classes.cancel}
              />
            </ButtonWrapper>
            {/* <ButtonWrapper>
              <FormGhostButton
                onClick={() => { this.setState({ showLocationForm: true }) }}
                label="Add New Location"
                className={classes.cancel}
              />
            </ButtonWrapper> */}
            <ButtonWrapper>
              <FormGhostButton
                type="submit"
                form={formId}
                onClick={this.saveClassTimes.bind(this, event, {
                  addSeperateTime: false,
                })}
                label="Save"
                className={classes.save}
              />
              {/* this.saveClassTimes.bind(this, event, {
                  addSeperateTime: false
                }) */}
            </ButtonWrapper>
            {/* <Button
              type="button"
              form={formId}
              name="save-and-go-to-pricing"
              color="primary"
              onClick={this.saveClassTimes.bind(this, "nextTab", event)}
            >
              Save and Add Pricing
            </Button> */}
          </DialogActions>
        </Dialog>
        {this.state.PackageAttachment && (
        <PackageAttachment
          open={this.state.PackageOpen}
          popUp={this.props.popUp}
          onClose={() => { this.setState({ PackageOpen: false }); }}
          schoolId={schoolId}
          classTypeId={parentKey}
          classTypeName={data && data.classTypeName ? data.classTypeName : { name: parentData.name, _id: parentData._id }}
          parentData={parentData}
          handleIsSavedState={handleIsSavedState}
          classTimeFormOnClose={() => {
            if (this.state.value) {
              this.state.classTimeFormOnClose(true);
            } else {
              this.state.classTimeFormOnClose();
            }
          }}
          closed={this.state.closed}
        />
        )}
      </div>
    );
  }
}
ClassTimeForm.propTypes = {
  data: PropTypes.instanceOf(Object),
  classes: PropTypes.instanceOf(Object),
  handleIsSavedState: PropTypes.func.isRequired,
  locationData: PropTypes.arrayOf(instanceOf(Object)),
  schoolId: PropTypes.string.isRequired,
  popUp: PropTypes.instanceOf(Object),
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  parentData: PropTypes.instanceOf(Object),
  instructorsData: PropTypes.arrayOf(instanceOf(Object)).isRequired,
  parentKey: PropTypes.string,
};
ClassTimeForm.defaultProps = {
  data: {},
  classes: {},
  locationData: [],
  popUp: {},
  parentData: {},
  parentKey: '',
};
export default createContainer((props) => {
  const { data } = props;
  let instructorsData = []; let
    userSubscription;
  if (!isEmpty(data ? data.instructors : [])) {
    userSubscription = Meteor.subscribe('user.getUsersFromIds', data.instructors);
    if (userSubscription && userSubscription.ready()) {
      instructorsData = Meteor.users.find().fetch();
      if (!includes(data.instructors, Meteor.userId())) {
        instructorsData = remove(instructorsData, ele => ele._id != Meteor.userId());
      }
    }
  }
  return {
    props,
    instructorsData,
  };
}, withStyles(styles)(
  withPopUp(withMobileDialog()(ClassTimeForm)),
));
