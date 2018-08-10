import React from "react";
import { get } from "lodash";
import { ContainerLoader } from "/imports/ui/loading/container";
import SelectArrayInput from "/imports/startup/client/material-ui-chip-input/selectArrayInput";
import { withStyles, toastrModal } from "/imports/util";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import { MenuItem } from "material-ui/Menu";
import Select from "material-ui/Select";
import Grid from "material-ui/Grid";
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  withMobileDialog
} from "material-ui/Dialog";
import Checkbox from "material-ui/Checkbox";
import { FormControl, FormControlLabel } from "material-ui/Form";
import Radio, { RadioGroup } from "material-ui/Radio";
import AddRow from "./addRow";
import ConfirmationModal from "/imports/ui/modal/confirmationModal";
import "/imports/api/sLocation/methods";
import { Card } from "material-ui";
import Input, { InputLabel} from "material-ui/Input";
// 1.perTime field in the collection monthyPricing.(Done)
// 2.dropDown for selecting the perTime classes.(Done)
// 3.saving in the collection.(Done)
// 4.on edit retrieving the value.(Done)
// 5.show perTime no of classes in the monthly pricing Card.
// 6. displaying the perTime no of classes in the package listing also.
// 7.maxmium classes only in monthly package.
const formId = "LocationForm";
const styles = theme => {
  return {
    button: {
      margin: 5,
      width: 150
    },
    checked: {
      color: theme.palette.grey[300]
    }
  };
};

class MonthlyPriceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initalizeFormValues();
  }

  initalizeFormValues = () => {
    let pymtType = get(this.props, "data.pymtType", null);
    let pymtMethod = get(this.props, "data.pymtMethod", null);
    let state = {
      isBusy: false,
      pymtType: pymtType,
      selectedClassType: get(this.props, "data.selectedClassType", null),
      tabValue: 0,
      autoWithDraw: pymtType && pymtType["autoWithDraw"],
      payAsYouGo: pymtType && pymtType["payAsYouGo"],
      pymtDetails: get(this.props, "data.pymtDetails", [
        { month: null, cost: null }
      ]),
      pymtMethod: pymtMethod,
      includeAllClassTypes: get(this.props, "data.includeAllClassTypes", ""),
      duPeriod: get(this.props, "data.duPeriod", "")
    };
    if (pymtMethod && pymtMethod === "Pay Up Front") state.tabValue = 1;
    return state;
  };

  onSubmit = event => {
    event.preventDefault();
    const { selectedClassType, pymtType, tabValue } = this.state;
    const { data, schoolId, toastr, classTypeData } = this.props;
    let allClassTypeIds = classTypeData.map(item => {
      return item._id;
    });
    const payload = {
      schoolId: schoolId,
      packageName: this.packageName.value,
      classTypeId: this.state.includeAllClassTypes
        ? allClassTypeIds
        : selectedClassType && selectedClassType.map(data => data._id),
      pymtMethod: "Pay Up Front",
      pymtDetails: this.refs.AddRow.getRowData(),
      includeAllClassTypes: this.state.includeAllClassTypes,
      noClasses:this.noClasses.value,
      duPeriod: this.state.duPeriod

    };
    if(payload.classTypeId==null){
      payload.classTypeId=[];
    }
    if (tabValue === 0) {
      // No option is selected for making payment then need to show this `Please select any payment type`.
      if (pymtType && !pymtType.autoWithDraw && !pymtType.payAsYouGo || pymtType==null || pymtType && pymtType.autoWithDraw && pymtType.payAsYouGo) {
        toastr.error("Please select one payment type.", "Error");
        return;
      }
      if (pymtType && pymtType.payUpFront) {
        delete pymtType.payUpFront;
      }
      payload.pymtType = pymtType;
      payload.pymtMethod = "Pay Each Month";
    } else {
      payload.pymtType = { payUpFront: true };
    }
    this.setState({ isBusy: true });

    if (data && data._id) {
      this.handleSubmit({
        methodName: "monthlyPricing.editMonthlyPricing",
        doc: payload,
        doc_id: data._id
      });
    } else {
      this.handleSubmit({
        methodName: "monthlyPricing.addMonthlyPricing",
        doc: payload
      });
    }
  };

  handleSubmit = ({ methodName, doc, doc_id }) => {
    Meteor.call(methodName, { doc, doc_id }, (error, result) => {
      if (error) {
      }
      if (result) {
        this.props.onClose();
      }
      this.setState({ isBusy: false, error });
    });
  };

  handleClassTypeInputChange = value => {
    Meteor.call(
      "classType.getClassTypeByTextSearch",
      { schoolId: this.props.schoolId, textSearch: value },
      (err, res) => {
        this.setState({
          classTypeData: res || []
        });
      }
    );
  };

  onClassTypeChange = values => {
    this.setState({ selectedClassType: values });
  };

  handleCheckBox = (key, disableKey, pymtType, event, isInputChecked) => {
    let oldPayment = this.state.pymtType || {};
    oldPayment[pymtType] = isInputChecked;
    this.setState({
      [key]: isInputChecked,
      pymtType: oldPayment,
      
    });
  };
  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  cancelConfirmationModal = () =>
    this.setState({ showConfirmationModal: false });

  render() {
    const { fullScreen, data, classes, schoolData, currency } = this.props;
    const { classTypeData, pymtMethod, pymtDetails } = this.state;
    const tabValue =
      this.state.tabValue == 0 ? "Pay Each Month" : "Pay Up Front";
    return (
      <div>
        <Dialog
          open={this.props.open}
          aria-labelledby="form-dialog-title"
          fullScreen={fullScreen}
        >
          <DialogTitle id="form-dialog-title">Add Monthly Pricing</DialogTitle>
          {this.state.isBusy && <ContainerLoader />}
          {this.state.showConfirmationModal && (
            <ConfirmationModal
              open={this.state.showConfirmationModal}
              submitBtnLabel="Yes, Delete"
              cancelBtnLabel="Cancel"
              message="You will delete this Per Month Package, Are you sure?"
              onSubmit={() =>
                this.handleSubmit({
                  methodName: "monthlyPricing.removeMonthlyPricing",
                  doc: data
                })
              }
              onClose={this.cancelConfirmationModal}
            />
          )}
          {this.state.error ? (
            <div style={{ color: "red" }}>{this.state.error}</div>
          ) : (
            <DialogContent>
              <form id={formId} onSubmit={this.onSubmit}>
                <TextField
                  required={true}
                  defaultValue={data && data.packageName}
                  margin="dense"
                  inputRef={ref => (this.packageName = ref)}
                  label="Package Name"
                  type="text"
                  fullWidth
                />
                <SelectArrayInput
                  disabled={false}
                  floatingLabelText="Class Types"
                  optionValue="_id"
                  optionText="name"
                  input={{
                    value: this.state.selectedClassType,
                    onChange: this.onClassTypeChange
                  }}
                  onChange={this.onClassTypeChange}
                  setFilter={this.handleClassTypeInputChange}
                  dataSourceConfig={{ text: "name", value: "_id" }}
                  choices={classTypeData}
                />
                <FormControl fullWidth margin="dense">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.includeAllClassTypes}
                        onChange={this.handleChange("includeAllClassTypes")}
                        value="includeAllClassTypes"
                      />
                    }
                    label="Include all classes"
                  />
                </FormControl>
                <div style={{display: 'flex', alignItems: 'flex-end'}}>
                <TextField
                  defaultValue={data && data.noClasses}
                  margin="dense"
                  inputRef={ref => (this.noClasses = ref)}
                  label="Maximum classes"
                  type="number"
                  fullWidth
                />
   
                
                  <FormControl fullWidth margin="dense">
                    <InputLabel htmlFor="duration-period">
                      Duration Period
                    </InputLabel>
                    <Select
                      required={true}
                      input={<Input id="duration-period" />}
                      value={this.state && this.state.duPeriod ? this.state.duPeriod : 'day'}
                      onChange={event =>
                        this.setState({ duPeriod: event.target.value })
                      }
                      fullWidth
                    >
                      <MenuItem value={"day"}>Day</MenuItem>
                      <MenuItem value={"month"}>Month</MenuItem>
                      <MenuItem value={"year"}>Year</MenuItem>
                    </Select>
                  </FormControl>
               </div>
                <div className="responsive-tab">
                  <div
                    style={{
                      display: "inline-flex",
                      flexWrap: "wrap",
                      justifyContent: "center"
                    }}
                  >
                    <Button
                      className={classes.button}
                      onClick={() => this.setState({ tabValue: 0 })}
                      raised
                      color={this.state.tabValue == 0 && "primary"}
                    >
                      Pay Each Month
                    </Button>
                    <Button
                      className={classes.button}
                      onClick={() => this.setState({ tabValue: 1 })}
                      raised
                      color={this.state.tabValue == 1 && "primary"}
                    >
                      Pay Up Front
                    </Button>
                  </div>
                </div>
                <div
                  style={{
                    border: "1px solid blue",
                    padding: 10,
                    backgroundColor: "#C5D9A1"
                  }}
                >
                  {this.state.tabValue === 0 && (
                    <Grid container>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={this.state.autoWithDraw}
                              onChange={this.handleCheckBox.bind(
                                this,
                                "autoWithDraw",
                                "payAsYouGo",
                                "autoWithDraw"
                              )}
                              value={"autoWithDraw"}
                              classes={{
                                checked: classes.checked
                              }}
                            />
                          }
                          label="Automatic Withdrawal"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={this.state.payAsYouGo}
                              onChange={this.handleCheckBox.bind(
                                this,
                                "payAsYouGo",
                                "autoWithDraw",
                                "payAsYouGo"
                              )}
                              value={"payAsYouGo"}
                              classes={{
                                checked: classes.checked
                              }}
                            />
                          }
                          label="Pay As You Go"
                        />
                      </Grid>
                    </Grid>
                  )}
                  <AddRow
                    ref="AddRow"
                    tabValue={tabValue}
                    rowData={
                      tabValue !== pymtMethod
                        ? [{ month: null, cost: null, currency: currency }]
                        : pymtDetails
                    }
                    classes={classes}
                    currency={currency}
                  />
                </div>
              </form>
            </DialogContent>
          )}
          <DialogActions>
            {data && !data.from && (
              <Button
                onClick={() => this.setState({ showConfirmationModal: true })}
                color="accent"
              >
                Delete
              </Button>
            )}
            <Button onClick={() => this.props.onClose()} color="primary">
              Cancel
            </Button>
            <Button type="submit" form={formId} color="primary">
              {data ? "Save" : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(
  withMobileDialog()(toastrModal(MonthlyPriceForm))
);
