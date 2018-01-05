import React from 'react';
import { get } from 'lodash';
import { ContainerLoader } from '/imports/ui/loading/container';
import SelectArrayInput from '/imports/startup/client/material-ui-chip-input/selectArrayInput';
import { withStyles, toastrModal } from "/imports/util";
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Grid from 'material-ui/Grid';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  withMobileDialog,
} from 'material-ui/Dialog';
import Checkbox from 'material-ui/Checkbox';
import { FormControlLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';
import AddRow from './addRow';
import ConfirmationModal from '/imports/ui/modal/confirmationModal';
import '/imports/api/sLocation/methods';

const formId = "LocationForm";

const styles = theme => {
    console.log("theme -->>",theme)
    return {
        button: {
          margin: 5,
          width: 150
        },
        checked: {
            color: theme.palette.grey[300],
        },
    }
}

class MonthlyPriceForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initalizeFormValues();
    }

    initalizeFormValues = ()=> {
        let pymtType = get(this.props, 'data.pymtType', null);
        let pymtMethod = get(this.props, 'data.pymtMethod', null)
        let state = {
            isBusy: false,
            pymtType: pymtType,
            selectedClassType: get(this.props, 'data.selectedClassType', null),
            tabValue: 0,
            autoWithDraw: pymtType === "Automatic Withdrawal",
            payToGo: pymtType === "Pay To You Go",
            pymtDetails: get(this.props, 'data.pymtDetails', [ { month: null, cost: null} ])
        }
        if(pymtMethod && pymtMethod === "Pay Up Front")
            state.tabValue = 1;
        return state;
    }

    onSubmit = (event) => {
        event.preventDefault();
        const { selectedClassType, pymtType, tabValue } = this.state;
        const { data, schoolId, toastr } = this.props;
        // console.log("pymtType -->>",pymtType)
        // console.log("tabValue -->>",tabValue)
        const payload = {
            schoolId: schoolId,
            packageName: this.packageName.value,
            classTypeId: selectedClassType && selectedClassType.map(data => data._id),
            pymtMethod: "Pay Up Front",
            pymtDetails: this.refs.AddRow.getRowData(),
        }

        if(tabValue === 0) {
            if(!pymtType) {
                toastr.error("Please select any payment type.","Error");
                return
            }
            payload.pymtType = pymtType;
            payload.pymtMethod = "Pay Each Month";
        }

        this.setState({isBusy: true});

        if(data && data._id) {
            this.handleSubmit({ methodName: "monthlyPricing.editMonthlyPricing", doc: payload, doc_id: data._id})
        } else {
            this.handleSubmit({ methodName: "monthlyPricing.addMonthlyPricing", doc: payload })
        }
    }

    handleSubmit = ({methodName, doc, doc_id})=> {
        console.log("handleSubmit methodName-->>",methodName)
        console.log("handleSubmit doc-->>",doc)
        console.log("handleSubmit doc_id-->>",doc_id)
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

    handleSelectOnChange = event => {
        this.setState({ pymtType: event.target.value });
    }

    handleClassTypeInputChange = (value) => {
        Meteor.call("classType.getClassTypeByTextSearch",{schoolId:this.props.schoolId, textSearch: value}, (err,res) => {
            console.log("classType.getClassTypeByTextSearch res -->>",res)
            this.setState({
                classTypeData: res || [],
            })
        })
    }

    onClassTypeChange = (values)=> {
        this.setState({selectedClassType: values})
    }

    handleCheckBox = (key, disableKey, pymtType, event, isInputChecked) => {
        this.setState({
            [key]: isInputChecked,
            [disableKey]: false,
            pymtType: isInputChecked ? pymtType : null,
        })
    }

    cancelConfirmationModal = ()=> this.setState({showConfirmationModal: false})

    render() {
        console.log("MonthlyPriceForm render props -->>>",this.props);
        console.log("MonthlyPriceForm render state -->>>",this.state);
        const { fullScreen, data, classes } = this.props;
        const { classTypeData, pymtDetails } = this.state;
        return (
            <div>
                <Dialog
                  open={this.props.open}
                  onClose={this.props.onClose}
                  aria-labelledby="form-dialog-title"
                  fullScreen={fullScreen}
                >
                    <DialogTitle id="form-dialog-title">Add Monthly Pricing</DialogTitle>
                    { this.state.isBusy && <ContainerLoader/>}
                    {
                        this.state.showConfirmationModal && <ConfirmationModal
                            open={this.state.showConfirmationModal}
                            submitBtnLabel="Yes, Delete"
                            cancelBtnLabel="Cancel"
                            message="You will delete this Per Month Package, Are you sure?"
                            onSubmit={() => this.handleSubmit({ methodName: "monthlyPricing.removeMonthlyPricing", doc: data})}
                            onClose={this.cancelConfirmationModal}
                        />
                    }
                    {
                        this.state.error ? <div style={{color: 'red'}}>{this.state.error}</div> : (
                            <DialogContent>
                                <form id={formId} onSubmit={this.onSubmit}>
                                    <TextField
                                        required={true}
                                        defaultValue={data && data.packageName}
                                        margin="dense"
                                        inputRef={(ref)=> this.packageName = ref}
                                        label="Package Name"
                                        type="text"
                                        fullWidth
                                    />
                                    <SelectArrayInput
                                        disabled={false}
                                        floatingLabelText="Class Types"
                                        optionValue="_id"
                                        optionText="name"
                                        input={{ value: this.state.selectedClassType ,onChange: this.onClassTypeChange}}
                                        onChange={this.onClassTypeChange}
                                        setFilter={this.handleClassTypeInputChange}
                                        dataSourceConfig={{ text: 'name', value: '_id' }}
                                        choices={classTypeData}
                                    />
                                    <div className="responsive-tab">
                                        <div style={{display: "inline-flex",flexWrap: 'wrap',justifyContent: 'center'}}>
                                            <Button className={classes.button} onClick={() => this.setState({tabValue: 0})} raised color={(this.state.tabValue == 0) && "primary"} >
                                                Pay Each Month
                                            </Button>
                                            <Button className={classes.button} onClick={() => this.setState({tabValue: 1})} raised color={(this.state.tabValue == 1) && "primary"} >
                                                Pay Up Front
                                            </Button>
                                        </div>
                                    </div>
                                    <div style={{border: '1px solid blue', padding: 10, backgroundColor: '#C5D9A1'}}>
                                        {
                                            (this.state.tabValue === 0) && (
                                                <Grid container>
                                                    <Grid  item xs={12} sm={6}>
                                                        <FormControlLabel
                                                          control={
                                                            <Checkbox
                                                              checked={this.state.autoWithDraw}
                                                              onChange={this.handleCheckBox.bind(this, "autoWithDraw", "payToGo", "Automatic Withdrawal")}
                                                              value={"autoWithDraw"}
                                                              classes={{
                                                                checked: classes.checked,
                                                              }}
                                                            />
                                                          }
                                                          label="Automatic Withdrawal"
                                                        />

                                                    </Grid>
                                                    <Grid  item xs={12} sm={6}>
                                                        <FormControlLabel
                                                          control={
                                                            <Checkbox
                                                              checked={this.state.payToGo}
                                                              onChange={this.handleCheckBox.bind(this, "payToGo", "autoWithDraw", "Pay To You Go")}
                                                              value={"payToGo"}
                                                              classes={{
                                                                checked: classes.checked,
                                                              }}
                                                            />
                                                          }
                                                          label="Pay To You Go"
                                                        />
                                                    </Grid>
                                                </Grid>
                                            )
                                        }
                                        <AddRow ref="AddRow" rowData={pymtDetails} classes={classes}/>
                                    </div>

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

export default withStyles(styles)(withMobileDialog()(toastrModal(MonthlyPriceForm)));