/* 
1.ADD LOCATION Field in the class time form.
2.Get list of location for location fiedls.
3.Show list of rooms according to the selected location in the lfield.
4.Change in the database of class time.
5. Related changes in the class time popup in the calendar.
*/
import React, { Fragment } from "react";
import { get, isEmpty, remove, flatten, includes } from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';
import styled from "styled-components";
import { withStyles } from "material-ui/styles";
import { MaterialDatePicker } from "/imports/startup/client/material-ui-date-picker";
import Button from "material-ui/Button";

import TextField from "material-ui/TextField";
import Input, { InputLabel } from "material-ui/Input";
import Select from "material-ui/Select";
import Checkbox from "material-ui/Checkbox";
import { FormControl, FormControlLabel } from "material-ui/Form";
import Grid from "material-ui/Grid";
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogActions,
  withMobileDialog
} from "material-ui/Dialog";

import ConfirmationModal from "/imports/ui/modal/confirmationModal";
import ResponsiveTabs from "/imports/util/responsiveTabs";
import { ContainerLoader } from "/imports/ui/loading/container";
import config from "/imports/config";
// import { MaterialTimePicker } from '/imports/startup/client/material-ui-time-picker';
import { WeekDaysRow } from "./weekDaysRow";
import { MenuItem } from "material-ui/Menu";
import { OneTimeRow } from "./oneTimeRow";
import "/imports/api/sLocation/methods";

import PackageAttachment from '/imports/ui/components/landing/components/dialogs/PackageAttachement.jsx'
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import LocationForm from '/imports/ui/components/schoolView/editSchool/locationDetails/locationForm';
import RoomForm from "/imports/ui/components/schoolView/editSchool/locationDetails/roomForm";
import { mobile } from "/imports/ui/components/landing/components/jss/helpers.js";
import InstructorList from '/imports/ui/components/landing/components/classDetails/membersList/presentational/MembersList.jsx';
import AddInstructorDialogBox from "/imports/ui/components/landing/components/dialogs/AddInstructorDialogBox";

import { withPopUp } from '/imports/util';
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const ButtonWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const ListWrapper = styled.div`
  padding: 0 ${helpers.rhythmDiv * 2}px;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

let FormWrapper, DialogContentText, FormInputsWrapper;
FormWrapper = DialogContentText = FormInputsWrapper = styled.div`
  padding: 0 ${helpers.rhythmDiv * 3}px;
`;

DialogContentText = DialogContentText.extend`
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.specialFont};
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

const styles = theme => {
  return {
    delete: {
      backgroundColor: 'red',
      color: "black",
      fontWeight: 600
    },
    cancel: {
      backgroundColor: 'yellow',
      color: "black",
      fontWeight: 600
    },
    save: {
      backgroundColor: 'green',
      color: "black",
      fontWeight: 600
    },
    textField: {
      marginBottom: helpers.rhythmDiv
    },
    formControl: {
      marginBottom: helpers.rhythmDiv
    },
    dialogContent: {
      padding: 0,
      paddingBottom: helpers.rhythmDiv * 3
    },
    dialogActionsRoot: {
      [`@media screen and (max-width: ${mobile}px)`]: {
        flexWrap: "wrap",
        justifyContent: "center"
      }
    }
  };
};
/*
1.closed field in the collection.(Done)
2.Default value of closed checkbox.(Done)
3.Only shown in case of series.(Done)
4.storing in the state and then in collection.(Done)
5.Retrieving the default value.(Done)
6.Join class button will be set to closed class if class started.
7.Popup with some text.
*/
const formId = "classTimeForm";
class ClassTimeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initializeFields();
  }

  componentDidMount = () => {
    console.info("MOUNTED");
  }

  componentDidUpdate = () => {
    console.info("RE RENDERED....");
  }

  componentWillUnmount = () => {
    console.info("COMPONENT WILL UNMOUNT....");
  }

  initializeFields = () => {
    const { data, locationData, parentData, instructorsData } = this.props;
    let state = {
      roomData: [],
      roomId: "",
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
      instructorsData: instructorsData
    };



    if (!isEmpty(parentData) && !isEmpty(parentData.selectedLocation)) {
      state.roomData = parentData.selectedLocation.rooms;
    }
    // Default selected tab accoring to data found for `ClassTimes` rec.
    if (!isEmpty(data)) {
      if (data.scheduleType === "oneTime") {
        state.tabValue = 0;
      } else if (data.scheduleType === "recurring") {
        state.tabValue = 1;
      } else if (data.scheduleType === "OnGoing") {
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
    }
    else {
      locationData.map((location) => {
        location && location.rooms ? location.rooms.map((room) => {
          if (room.id == state.roomId) {
            state.roomData = !isEmpty(location.rooms) ? location.rooms : [];
            return;
          }
        }) : state.roomData = [];
      })
    }


    return state;
  };

  onTabChange = tabValue => {
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
    this.setState({ [fieldName]: new Date(date) });
  };

  handleLocAndRoom = (key, event) => {
    if (key == 'roomId') {
      this.setState({ roomId: event.target.value });
    } else {
      this.setState({ locationId: event.target.value })
      const { locationData } = this.props;
      locationData.map((location) => {
        !isEmpty(location.rooms) ? location.rooms.map((room) => {
          if (location._id == event.target.value) {
            this.setState({
              roomData: !isEmpty(location.rooms) ? location.rooms : [],
              roomId: location && location.rooms && location.rooms[0].id || ''
            });
          }
        }) : this.setState({ roomId: '', roomData: [] })
      })
    }
  }
  handleSearchChange = type => e => {
    const value = e.target.value;
    this.setState(state => {
      return {
        ...state,
        [type]: value
      };
    });
  };
  handleAddInstructorDialogBoxState = dialogBoxState => () => {
    this.setState(state => {
      return {
        ...state,
        addInstructorDialogBoxState: dialogBoxState
      };
    });
  };
  submitClassTimes = (nextTab, addSeperateTime) => (event) => {
    event.preventDefault();
    this.saveClassTimes(nextTab, addSeperateTime, event);
  }

  saveClassTimes = (nextTab, addSeperateTimeJson, event) => {
    event.preventDefault();
    const { schoolId, data, parentKey, parentData, popUp } = this.props;
    const { tabValue, locationId } = this.state;

    const payload = {
      schoolId: schoolId,
      classTypeId: parentKey,
      name: this.classTimeName.value,
      desc: this.desc.value,
      locationId: locationId,
      closed: this.state.closed,
      locationId: this.state.locationId,
      roomId: this.state.roomId,
      instructors: this.state.instructors
    };
    if (!this.classTimeName.value) {
      popUp.appear("alert", {
        title: "Class Time Name Empty",
        content: `Please Enter Class Time Name`,
        RenderActions: (
          <FormGhostButton label={'Ok'} onClick={() => { }} applyClose />

        )
      }, true);
      return false;
    }
    if (tabValue === 0) {
      payload.scheduleType = "oneTime";
      payload.scheduleDetails = this.refs.oneTimeRow.getRowData();
      if (this.state.noOfRow < 2) {
        payload.closed = false
      }
    } else if (tabValue === 1) {
      payload.scheduleType = "recurring";
      payload.startDate = this.state.startDate;
      payload.endDate = this.state.endDate;
      payload.scheduleDetails = this.refs.weekDaysRow.getRowData();
    } else if (tabValue === 2) {
      payload.scheduleType = "OnGoing";
      payload.startDate = new Date();
      payload.scheduleDetails = this.refs.weekDaysRow.getRowData();
    }
    if (data && data._id) {

      this.onSubmit({
        methodName: "classTimes.editClassTimes",
        doc: payload,
        doc_id: data._id,
        nextTab: nextTab,
        value: addSeperateTimeJson,
      });
    } else {
      this.onSubmit({
        methodName: "classTimes.addClassTimes",
        doc: payload,
        nextTab: nextTab,
        value: addSeperateTimeJson,
      });
    }
  };

  onSubmit = ({ methodName, doc, doc_id, value }) => {

    this.setState({ isBusy: true });
    Meteor.call(methodName, { doc, doc_id }, (error, result) => {

      if (error) {
      }
      if (result) {
        if (value.addSeperateTime == false) {
          this.setState({ PackageAttachment: true, PackageOpen: true, classTimeFormOnClose: this.props.onClose, value: value.addSeperateTime })

          // this.props.onClose();
        } else if (value.addSeperateTime == true) {
          this.setState({ PackageAttachment: true, PackageOpen: true, classTimeFormOnClose: this.props.onClose, value: value.addSeperateTime })
          //this.props.onClose( value.addSeperateTime );
        }
        else if (value == "delete") {
          this.props.onClose();
        } else {
          this.props.onClose();
          this.props.moveToNextTab();
        }
      }
      this.setState({ isBusy: false, error });
    });
  };
  //onsubmit1 for the handling again opening new classtime form
  closedCheckbox = () => {
    return <Fragment>
      {(this.state.tabValue == 1 || this.state.tabValue == 0 && this.state.noOfRow >= 2) && <FormControl fullWidth margin="dense">
        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.closed}
              onChange={() => {
                this.setState({ closed: !this.state.closed })
              }}
              value="closed"
            />
          }
          label="Do you want to make this a Closed Series / Set? This will close registration once the first class has started and students who join will be enrolled in the entire series."
        />
      </FormControl>}
    </Fragment>
  }
  instructorsIdsSetter = (instructorId, action) => {
    let instructors = this.state.instructors;
    if (action == 'add') {
      instructors.push(instructorId);
      instructors = flatten(instructors);
    }
    else if (action == 'remove') {
      instructors = remove(instructors, (n) => {
        return n != instructorId;
      })
    }
    this.setState({ instructors, addInstructorDialogBoxState: false });
  }
  render() {
    const { fullScreen, data, classes, schoolId, parentKey, parentData, locationData, popUp, instructorsData } = this.props;
    const { roomId, locationId, roomData, addInstructorDialogBoxState } = this.state;

    // let styleForBox = this.state.tabValue == 1 || this.state.tabValue == 0 && this.state.noOfRow >= 2 ? { border: '2px solid', padding: '7px', marginBottom: "2px", backgroundColor: "lightgray" } : {};
    let styleForBox = {};
    return (
      <div>
        <Dialog
          open={this.props.open}
          aria-labelledby="form-dialog-title"
          fullScreen={fullScreen}
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
              text={'Admin'}
            />
          )}
          {this.state.showConfirmationModal && (
            <ConfirmationModal
              open={this.state.showConfirmationModal}
              submitBtnLabel="Yes, Delete"
              cancelBtnLabel="Cancel"
              message="You will delete this Class Times, Are you sure?"
              onSubmit={() =>
                this.onSubmit({
                  methodName: "classTimes.removeClassTimes",
                  doc: data,
                  doc_id: data,
                  value: "delete"
                })
              }
              onClose={() => this.setState({ showConfirmationModal: false })}
            />
          )}
          {this.state.showLocationForm && <LocationForm
            open={true}
            schoolId={schoolId}
            onClose={(result) => {
              if (result) this.setState({ showLocationForm: false, showRoomForm: true, locId: result })
              else this.setState({ showLocationForm: false })
            }}
          />}
          {this.state.showRoomForm && this.state.locId &&
            <RoomForm
              parentKey={this.state.locId}
              open={this.state.showRoomForm}
              onClose={() => { this.setState({ showRoomForm: false }) }}
              from={'classTime'}
            />}

          {this.state.error ? (
            <div style={{ color: "red" }}>{this.state.error}</div>
          ) : (
              <DialogContent className={classes.dialogContent}>
                <DialogContentText>
                  This name helps differentiate different class times in the same
                  class type. Good examples include "Wednesday Night Swim" or
                  "Weekend Open Training."
                </DialogContentText>


                <form id={formId}>
                  <FormInputsWrapper>
                    <TextField
                      required={true}
                      defaultValue={data && data.name}
                      margin="dense"
                      inputRef={ref => (this.classTimeName = ref)}
                      label="Class Time Name"
                      type="text"
                      fullWidth
                      className={classes.textField}
                    />
                    <TextField
                      defaultValue={data && data.desc}
                      margin="dense"
                      inputRef={ref => (this.desc = ref)}
                      label="Brief Description (200 Characters)"
                      type="text"
                      fullWidth
                      multiline
                      className={classes.textField}
                      inputProps={{ maxLength: 200 }}
                    />
                    <FormControl className={classes.formControl} fullWidth margin="dense">
                      <InputLabel htmlFor="location">Location</InputLabel>
                      <Select
                        required={true}
                        input={<Input id="location" />}
                        value={locationId}
                        onChange={this.handleLocAndRoom.bind(this, 'locationId')}
                        fullWidth
                      >
                        {isEmpty(locationData) && (
                          <MenuItem value="" disabled>
                            No location added in Locations.
                          </MenuItem>
                        )}
                        {locationData.map((data, index) => {
                          return (
                            <MenuItem key={index} value={data._id}>{`${
                              data.address
                              }, ${data.city}, ${data.country}`}</MenuItem>
                          );
                        })}
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
                        {roomData &&
                          roomData.map((data, index) => {
                            return (
                              <MenuItem key={index} value={data.id}>
                                {data.name}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </FormControl>
                  </FormInputsWrapper>

                  <ClassTimeDataWrapper>
                    <ResponsiveTabs
                      variant="distributed"
                      defaultValue={1}
                      tabValue={this.state.tabValue}
                      tabs={["Single/Set", "Series", "Ongoing"]}
                      color="primary"
                      onTabChange={this.onTabChange}
                    />

                    <div style={styleForBox}>
                      {this.closedCheckbox()}
                      {this.state.tabValue == 1 && (
                        <Grid container>
                          <Grid item sm={6} xs={12}>
                            <MaterialDatePicker
                              required={true}
                              label={"Start Date"}
                              floatingLabelText={"Start Date *"}
                              value={this.state.startDate}
                              onChange={this.handleChangeDate.bind(
                                this,
                                "startDate"
                              )}
                              fullWidth={true}
                            />
                          </Grid>
                          <Grid item sm={6} xs={12}>
                            <MaterialDatePicker
                              required={true}
                              label={"End Date"}
                              floatingLabelText={"End Date *"}
                              value={this.state.endDate}
                              onChange={this.handleChangeDate.bind(
                                this,
                                "endDate"
                              )}
                              fullWidth={true}
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
                            data &&
                            data.scheduleDetails &&
                            data.scheduleDetails.oneTime
                          }
                          roomData={this.state.roomData}
                          saveClassTimes={this.saveClassTimes}
                          handleNoOfRow={this.handleNoOfRow}
                          locationData={locationData}
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
                        />
                      </div>
                    )}
                  </ClassTimeDataWrapper>

                  <ListWrapper>
                    <InstructorList
                      marginBottom={helpers.rhythmDiv * 2}
                      viewType={"instructorsView"}
                      searchedValue={this.state.teachersFilterWith}
                      onSearchChange={this.handleSearchChange("teachersFilterWith")}
                      data={instructorsData}
                      entityType={"teachers"}
                      searchedValue={this.state.teachersFilterWith}
                      onAddIconClick={this.handleAddInstructorDialogBoxState(true)}
                      popUp={popUp}
                      classTimeForm
                      instructorsIdsSetter={this.instructorsIdsSetter}
                      addInstructor
                      text={'Instructor'}
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
                onClick={() => this.props.onClose()}
                label="Cancel"
                className={classes.cancel}
              />
            </ButtonWrapper>
            <ButtonWrapper>
              <FormGhostButton
                onClick={() => { this.setState({ showLocationForm: true }) }}
                label="Add New Location"
                className={classes.cancel}
              />
            </ButtonWrapper>
            <ButtonWrapper>
              <FormGhostButton
                type="submit"
                form={formId}
                onClick={this.saveClassTimes.bind(this, event, {
                  addSeperateTime: false
                })}
                label={"Save"}
                className={classes.save}
              />
              {/*this.saveClassTimes.bind(this, event, {
                  addSeperateTime: false
                })*/}
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
        {this.state.PackageAttachment && <PackageAttachment
          open={this.state.PackageOpen}
          popUp={this.props.popUp}
          onClose={() => { this.setState({ PackageOpen: false }) }}
          schoolId={schoolId}
          classTypeId={parentKey}
          classTypeName={data && data.classTypeName ? data.classTypeName : { name: parentData.name, _id: parentData._id }}
          parentData={parentData}
          classTimeFormOnClose={() => {
            if (this.state.value) {
              this.state.classTimeFormOnClose(true)
            }
            else {
              this.state.classTimeFormOnClose()
            }
          }}
          closed={this.state.closed}
        />}
      </div>
    );
  }
}
export default createContainer((props) => {
  const { data } = props;
  let instructorsData = [], userSubscription;
  if (!isEmpty(data ? data.instructors : [])) {
    userSubscription = Meteor.subscribe('user.getUsersFromIds', data.instructors);
    if (userSubscription && userSubscription.ready()) {
      instructorsData = Meteor.users.find().fetch();
      if (!includes(data.instructors, Meteor.userId())) {
        instructorsData = remove(instructorsData, (ele) => {
          return ele._id != Meteor.userId()
        })
      }
    }
  }
  return {
    props,
    instructorsData
  }
}, withStyles(styles)(
  withPopUp(withMobileDialog()(ClassTimeForm))
))

