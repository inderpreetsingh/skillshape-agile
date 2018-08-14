import React, { Fragment } from "react";
import { ContainerLoader } from "/imports/ui/loading/container";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import config from "/imports/config";
import TextField from "material-ui/TextField";
import Input, { InputLabel } from "material-ui/Input";
import Select from "material-ui/Select";
import Checkbox from "material-ui/Checkbox";
import { FormControl, FormControlLabel } from "material-ui/Form";
import Grid from "material-ui/Grid";
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  withMobileDialog
} from "material-ui/Dialog";
import ConfirmationModal from "/imports/ui/modal/confirmationModal";
import ResponsiveTabs from "/imports/util/responsiveTabs";
import { MaterialDatePicker } from "/imports/startup/client/material-ui-date-picker";
// import { MaterialTimePicker } from '/imports/startup/client/material-ui-time-picker';
import { WeekDaysRow } from "./weekDaysRow";
import { MenuItem } from "material-ui/Menu";
import { OneTimeRow } from "./oneTimeRow";
import "/imports/api/sLocation/methods";
import PackageAttachment from '/imports/ui/components/landing/components/dialogs/PackageAttachement.jsx'
import { toastrModal } from "/imports/util";
import styled from "styled-components";
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
const ButtonWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;
const styles = theme => {
  return {
    delete: {
     backgroundColor:'red',
     color: "black",
     fontWeight: 600
    },
    cancel: {
      backgroundColor:'yellow',
      color: "black",
      fontWeight: 600
     },
     save: {
      backgroundColor:'green',
      color: "black",
      fontWeight: 600
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

  initializeFields = () => {
    const { data, locationData, parentData } = this.props;
    let state = {
      roomData: [],
      roomId: "",
      startDate: new Date(),
      endDate: new Date(),
      tabValue: 2,
      closed:false,
      noOfRow: 0,
      PackageAttachment:false,
      PackageOpen:true
    };

    if (!_.isEmpty(parentData) && !_.isEmpty(parentData.selectedLocation)) {
      state.roomData = parentData.selectedLocation.rooms;
      state.locationId = parentData.selectedLocation._id;
    }
    // Default selected tab accoring to data found for `ClassTimes` rec.
    if (!_.isEmpty(data)) {
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
      state.roomId = data.roomId;
      state.closed=data.closed
    }
    return state;
  };

  onTabChange = tabValue => {
    this.setState({ tabValue });
  };
  handleNoOfRow=(data)=>{
    this.setState({noOfRow:this.state.noOfRow + data});
  }
  handleChangeDate = (fieldName, date) => {
    this.setState({ [fieldName]: new Date(date) });
  };
  
  saveClassTimes = (nextTab, addSeperateTimeJson, event) => {
    event.preventDefault();
    const { schoolId, data, parentKey, parentData, toastr } = this.props;
    const { tabValue, locationId } = this.state;

    const payload = {
      schoolId: schoolId,
      classTypeId: parentKey,
      name: this.classTimeName.value,
      desc: this.desc.value,
      locationId: locationId,
      closed: this.state.closed
    };
    if (!this.classTimeName.value) {
      toastr.error("Please enter Class Time name.", "Error");
      return false;
    }
    if (tabValue === 0) {
      payload.scheduleType = "oneTime";
      payload.scheduleDetails = { oneTime: this.refs.oneTimeRow.getRowData() };
      if(this.state.noOfRow < 2){
        payload.closed=false
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
        value: addSeperateTimeJson 
      });
    } else {
      this.onSubmit({
        methodName: "classTimes.addClassTimes",
        doc: payload,
        nextTab: nextTab,
        value: addSeperateTimeJson 
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
          this.setState({PackageAttachment:true,PackageOpen:true,classTimeFormOnClose:this.props.onClose,value:value.addSeperateTime})

        // this.props.onClose();
        } else if (value.addSeperateTime == true) {
          this.setState({PackageAttachment:true,PackageOpen:true,classTimeFormOnClose:this.props.onClose,value:value.addSeperateTime})
         //this.props.onClose( value.addSeperateTime );
        } 
       else if (value == "delete") {
        this.props.onClose();
      }else {
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
                {(this.state.tabValue ==1 || this.state.tabValue==0 && this.state.noOfRow >= 2 ) && <FormControl fullWidth margin="dense">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.closed}
                        onChange={()=>{
                          this.setState({closed:!this.state.closed})
                        }}
                        value="closed"
                      />
                    }
                    label="Do you want to close registration for this series once the first class has started?
                     This will make it a Closed Series. Students who join the class will be enrolled in the 
                     entire series."
                  />
                </FormControl>}
    </Fragment>
  }
  render() {
    const { fullScreen, data, classes, locationData,schoolId,parentKey,parentData} = this.props;
    const { skillCategoryData, skillSubjectData } = this.state;
    console.log('this.props in ctf',this.props)
    return (
      <div>
        <Dialog
          open={this.props.open}
          aria-labelledby="form-dialog-title"
          fullScreen={fullScreen}
        >
          <DialogTitle id="form-dialog-title">Add Class Times</DialogTitle>
          {this.state.isBusy && <ContainerLoader />}
          {this.state.showConfirmationModal && (
            <ConfirmationModal
              open={this.state.showConfirmationModal}
              submitBtnLabel="Yes, Delete"
              cancelBtnLabel="Cancel"
              message="You will delete this Class Times, Are you sure?"
              onSubmit={() =>
                this.onSubmit({
                  methodName: "classTimes.removeClassTimes",
                  doc:data,
                  doc_id:data,
                  value:"delete"
                })
              }
              onClose={() => this.setState({ showConfirmationModal: false })}
            />
          )}
          {this.state.error ? (
            <div style={{ color: "red" }}>{this.state.error}</div>
          ) : (
            <DialogContent>
              <DialogContentText>
                This name helps differentiate different class times in the same
                class type. Good examples include "Wednesday Night Swim" or
                "Weekend Open Training."
              </DialogContentText>
              <form id={formId}>
                <TextField
                  required={true}
                  defaultValue={data && data.name}
                  margin="dense"
                  inputRef={ref => (this.classTimeName = ref)}
                  label="Class Time Name"
                  type="text"
                  fullWidth
                />
                <TextField
                  defaultValue={data && data.desc}
                  margin="dense"
                  inputRef={ref => (this.desc = ref)}
                  label="Brief Description"
                  type="text"
                  fullWidth
                />
                <ResponsiveTabs
                  defaultValue={1}
                  tabValue={this.state.tabValue}
                  tabs={["Single/Set", "Series", "Ongoing"]}
                  color="primary"
                  onTabChange={this.onTabChange}
                  />
                  {this.closedCheckbox()}
                {this.state.tabValue === 0 && (
                  <div style={{ border: "3px solid blue", padding: 10 }}>
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
                    />
                  </div>
                )}
                {(this.state.tabValue === 1 || this.state.tabValue === 2) && (
                  <div style={{ border: "3px solid blue", padding: 10 }}>
                    {this.state.tabValue === 1 && (
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
                    <WeekDaysRow
                      ref="weekDaysRow"
                      data={data && data.scheduleDetails}
                      roomData={this.state.roomData}
                      saveClassTimes={this.saveClassTimes}
                    />
                  </div>
                )}
              </form>
            </DialogContent>
          )}
          <DialogActions>
            {data && (
            //   <Button
            //     onClick={() => this.setState({ showConfirmationModal: true })}
            //     color="accent"
            //     className={classes.delete}
            //   >
            //     Delete
            //   </Button>
            // )}
            // <Button onClick={() => this.props.onClose()} color="primary" className={classes.cancel}>
            //   Cancel
            // </Button>
            // <Button
            //   type="button"
            //   form={formId}
            //   name="save-class-times"
            //   color="primary"
            //   className={classes.save}
            //   onClick={this.saveClassTimes.bind(this, event, {
            //     addSeperateTime: false
            //   })}
            // >
            //   {data ? "Save" : "Submit"}
            // </Button>
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
            type="submit"
            form={formId}
            onClick={this.saveClassTimes.bind(this, event, {
                  addSeperateTime: false
                })}
            label={data ? "Save" : "Submit"}
            className={classes.save}
          />
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
       onClose={()=>{this.setState({PackageOpen:false})}} 
       schoolId={schoolId}
       classTypeId={parentKey}
       classTypeName={data && data.classTypeName?data.classTypeName :{name:parentData.name,_id:parentData._id}}
       parentData={parentData}
       classTimeFormOnClose={()=>{
         if(this.state.value){
          this.state.classTimeFormOnClose(true)
         }
         else{
          this.state.classTimeFormOnClose()
         }
        }}
        closed={this.state.closed}
       />} 
      </div>
    );
  }
}

export default withStyles(styles)(
  toastrModal(withMobileDialog()(ClassTimeForm))
);
