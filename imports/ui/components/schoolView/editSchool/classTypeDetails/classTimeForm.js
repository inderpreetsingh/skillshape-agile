import React, {Fragment} from 'react';
import { ContainerLoader } from '/imports/ui/loading/container';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import config from '/imports/config';
import TextField from 'material-ui/TextField';
import Input, { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select';
import Grid from 'material-ui/Grid';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  withMobileDialog,
} from 'material-ui/Dialog';
import ConfirmationModal from '/imports/ui/modal/confirmationModal';
import ResponsiveTabs from '/imports/util/responsiveTabs';
import { MaterialDatePicker } from '/imports/startup/client/material-ui-date-picker';
// import { MaterialTimePicker } from '/imports/startup/client/material-ui-time-picker';
import { WeekDaysRow } from './weekDaysRow';
import { FormControl } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import { OneTimeRow } from './oneTimeRow';
import '/imports/api/sLocation/methods';

const formId = "classTimeForm";

const styles = theme => {
    return {
      button: {
          margin: 5,
          width: 150
      },
      classtypeInputContainer: {
        alignItems: 'center',
        textAlign: 'left'
    }
    }
}

class ClassTimeForm extends React.Component {

    constructor(props){
      super(props);
      this.state = this.initializeFields();
    }

    initializeFields = () => {
        const { data, locationData, parentData } = this.props;
        console.log("initializeFields data -->>",this.props)
        let state = {
            roomData: [],
            roomId: "",
            startDate: new Date(),
            endDate: new Date()
        }

        if(!_.isEmpty(parentData) && !_.isEmpty(parentData.selectedLocation)) {
            state.roomData = parentData.selectedLocation.rooms;
            state.locationId = parentData.selectedLocation._id;
        }

        if(!_.isEmpty(data)) {
            if(data.scheduleType === "oneTime") {
                state.tabValue = 0
            } else if(data.scheduleType === "recurring") {
                state.tabValue = 1
            } else if(data.scheduleType === "OnGoing") {
                state.tabValue = 2
            }

            state.startDate = data.startDate;
            state.startTime = data.startTime;
            state.endDate = data.endDate;
            state.duration = data.duration;
            state.roomId = data.roomId;
        }
        console.log("Final state -->>",state)
        return state
    }

    onTabChange = (tabValue) => {
        console.log("onTabChange state -->>",tabValue)
        this.setState({tabValue})
    }

    handleChangeDate = (fieldName, date) => {
        console.log("handleChangeDate -->>",fieldName, date)
        this.setState({[fieldName]: new Date(date)})
    }

    onSubmit = (event) => {
        console.log("--------------------- ClassTimes from submit----------------")
        event.preventDefault()
        // console.log("onSubmit state -->>",this.state);
        const { schoolId, data, parentKey, } = this.props;
        const { tabValue, locationId } = this.state;

        const payload = {
            schoolId: schoolId,
            classTypeId: parentKey,
            name: this.classTimeName.value,
            desc: this.desc.value,
            locationId: locationId,
        }

        if(tabValue === 0) {

            payload.scheduleType = "oneTime";
            payload.scheduleDetails = { oneTime: this.refs.oneTimeRow.getRowData()};

        } else if(tabValue === 1) {

            payload.scheduleType = "recurring";
            payload.startDate = this.state.startDate;
            payload.endDate = this.state.endDate;
            payload.scheduleDetails = this.refs.weekDaysRow.getRowData();

        } else if(tabValue === 2) {

            payload.scheduleType = "OnGoing"
            payload.startDate = new Date();
            payload.scheduleDetails = this.refs.weekDaysRow.getRowData();

        }
        console.log("ClassTimes submit -->>",payload)

        if(data && data._id) {
            this.handleSubmit({ methodName: "classTimes.editClassTimes", doc: payload, doc_id: data._id })
        } else {
            this.handleSubmit({ methodName: "classTimes.addClassTimes", doc: payload })
        }

    }

    handleSubmit = ({ methodName, doc, doc_id })=> {
        console.log("handleSubmit methodName-->>",methodName)
        console.log("handleSubmit doc-->>",doc)
        console.log("handleSubmit doc_id-->>",doc_id)
        this.setState({isBusy: true});
        Meteor.call(methodName, { doc, doc_id }, (error, result) => {
            if (error) {
              console.error("error", error);
            }
            if (result) {
                this.props.onClose()
            }
            this.setState({isBusy: false, error});
        });
    }

  render() {
    const { fullScreen, data, classes, locationData } = this.props;
    const { skillCategoryData, skillSubjectData } = this.state;
    console.log("ClassTimeForm state -->>",this.state);
    return (
      <div>
        <Dialog
            open={this.props.open}
            onClose={this.props.onClose}
            aria-labelledby="form-dialog-title"
            fullScreen={fullScreen}
        >
              <DialogTitle id="form-dialog-title">Add Class Times</DialogTitle>
                    { this.state.isBusy && <ContainerLoader/>}
                    {
                        this.state.showConfirmationModal && <ConfirmationModal
                            open={this.state.showConfirmationModal}
                            submitBtnLabel="Yes, Delete"
                            cancelBtnLabel="Cancel"
                            message="You will delete this Class Times, Are you sure?"
                            onSubmit={() => this.handleSubmit({ methodName: "classTimes.removeClassTimes", doc: data})}
                            onClose={() => this.setState({showConfirmationModal: false})}
                        />
                    }
                    {
                        this.state.error ? <div style={{color: 'red'}}>{this.state.error}</div> : (
                            <DialogContent>
                                <form id={formId} onSubmit={this.onSubmit}>
                                    <TextField
                                        required={true}
                                        defaultValue={data && data.name}
                                        margin="dense"
                                        inputRef={(ref)=> this.classTimeName = ref}
                                        label="Class Time Name"
                                        type="text"
                                        fullWidth
                                    />
                                    <TextField
                                        defaultValue={data && data.desc}
                                        margin="dense"
                                        inputRef={(ref)=> this.desc = ref}
                                        label="Brief Description"
                                        type="text"
                                        fullWidth
                                    />
                                    <ResponsiveTabs
                                        defaultValue={this.state.tabValue}
                                        tabs={["One Time","Repeating with Start/End","Ongoing"]}
                                        color= "primary"
                                        onTabChange={this.onTabChange}
                                    />
                                    {
                                        this.state.tabValue === 0 && (
                                            <div style={{border: '3px solid blue', padding: 10}}>
                                                <OneTimeRow
                                                    ref="oneTimeRow"
                                                    data={data && data.scheduleDetails && data.scheduleDetails.oneTime}
                                                    roomData={this.state.roomData}
                                                />
                                            </div>
                                        )
                                    }
                                    {
                                        (this.state.tabValue === 1 || this.state.tabValue === 2) && (
                                            <div style={{border: '3px solid blue', padding: 10}}>
                                                {
                                                    this.state.tabValue === 1 && (
                                                        <Grid container>
                                                            <Grid item sm={6} xs={12}>
                                                                <MaterialDatePicker
                                                                    required={true}
                                                                    label={"Start Date"}
                                                                    floatingLabelText={"Start Date *"}
                                                                    value={this.state.startDate}
                                                                    onChange={this.handleChangeDate.bind(this, "startDate")}
                                                                    fullWidth={true}
                                                                />
                                                            </Grid>
                                                            <Grid item sm={6} xs={12}>
                                                                <MaterialDatePicker
                                                                    required={true}
                                                                    label={"End Date"}
                                                                    floatingLabelText={"End Date *"}
                                                                    value={this.state.endDate}
                                                                    onChange={this.handleChangeDate.bind(this, "endDate")}
                                                                    fullWidth={true}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    )
                                                }
                                                <WeekDaysRow
                                                    ref="weekDaysRow"
                                                    data={data && data.scheduleDetails}
                                                    roomData={this.state.roomData}
                                                />
                                            </div>
                                        )
                                    }
                                </form>
                            </DialogContent>
                        )
                    }
                    <DialogActions>
                    {
                        data && (
                            <Button onClick={() => this.setState({showConfirmationModal: true})} color="accent">
                                Delete
                            </Button>
                        )
                    }
                    <Button onClick={() => this.props.onClose()} color="primary">
                      Cancel
                    </Button>
                    <Button type="submit" form={formId} color="primary">
                      { data ? "Save" : "Submit" }
                    </Button>
                </DialogActions>
            </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(withMobileDialog()(ClassTimeForm));