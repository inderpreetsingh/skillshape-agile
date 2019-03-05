import { get } from "lodash";
import isEmpty from "lodash/isEmpty";
import Checkbox from "material-ui/Checkbox";
import Dialog, { DialogActions, DialogContent, DialogTitle, withMobileDialog } from "material-ui/Dialog";
import { FormControl, FormControlLabel } from "material-ui/Form";
import Grid from "material-ui/Grid";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import Select from "material-ui/Select";
import TextField from "material-ui/TextField";
import Tooltip from "rc-tooltip";
import React from "react";
import styled from "styled-components";
import "/imports/api/enrollmentFee/methods";
import SelectArrayInput from "/imports/startup/client/material-ui-chip-input/selectArrayInput";
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { ContainerLoader } from "/imports/ui/loading/container";
import ConfirmationModal from "/imports/ui/modal/confirmationModal";
import { formatMoney, inputRestriction, withPopUp, withStyles,confirmationDialog,unSavedChecker } from "/imports/util";
const ButtonWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;
const EnrollmentText = styled.div`
font-style: italic;
margin: 27px;
margin-bottom: 0px;
`;
const formId = "ClassPriceForm";

const styles = theme => {
  return {
    button: {
      margin: 5,
      width: 150
    },
    delete: {
      backgroundColor: "red",
      color: "black",
      fontWeight: 600
    },
    cancel: {
      backgroundColor: "yellow",
      color: "black",
      fontWeight: 600
    },
    save: {
      backgroundColor: "green",
      color: "black",
      fontWeight: 600
    }
  };
};
const enrollmentText = ` If you add a Class Type to an enrollment fee, students will need to purchase the Enrollment Fee before they can purchase Per Class or Monthly packages for that Class Type, or sign in to that class.`;
class EnrollmentFeeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBusy: false,
      pymtType: get(this.props, "data.pymtType", ""),
      selectedClassType: get(this.props, "data.selectedClassType", null),
      includeAllClassTypes: get(this.props, "data.includeAllClassTypes", ""),
      currency: get(this.props, "data.currency", this.props.currency),
      cost: get(this.props, "data.cost", "0"),
      expPeriod: get(this.props, "data.expPeriod", ""),
      noExpiration: get(this.props, "data.noExpiration", ""),
      expDuration: get(this.props,"data.expDuration",false),
    };
    this.props.handleIsSavedState(true);
  }

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
    this.props.handleIsSavedState(false);
    this.setState({ selectedClassType: values });
  };

  onSubmit = event => {
    event.preventDefault();
    const { selectedClassType,expPeriod } = this.state;
    const { data, schoolId, classTypeData, popUp } = this.props;
    let allClassTypeIds = classTypeData.map(item => {
      return item._id;
    });
    const payload = {
      schoolId: schoolId,
      name: this.enrollmentName.value,
      classTypeId: this.state.includeAllClassTypes
        ? allClassTypeIds
        : selectedClassType && selectedClassType.map(data => data._id),
      cost:
        this.enrollmentCost.value &&
        parseFloat(this.enrollmentCost.value).toFixed(2),
      includeAllClassTypes: this.state.includeAllClassTypes,
      currency: this.state.currency,
      noExpiration: this.state.noExpiration
    };
    if (payload.classTypeId == null) {
      payload.classTypeId = [];
    }
    if ( isEmpty(payload.classTypeId) || !payload.currency || !payload.name || !payload.cost || !this.state.noExpiration && !this.expDuration.value || !this.state.noExpiration && !expPeriod) {
        popUp.appear("alert", { title: "Please Check", content: "Not all required fields are complete." });
        return ;
    }
    if(!this.state.noExpiration){
        payload.expDuration = parseInt(this.expDuration.value);
        payload.expPeriod = expPeriod;
      }
    this.setState({ isBusy: true });
    if (data && data._id) {
      this.handleSubmit({
        methodName: "enrollmentFee.editEnrollmentFee",
        doc: payload,
        doc_id: data._id
      });
    } else {
      this.handleSubmit({
        methodName: "enrollmentFee.addEnrollmentFee",
        doc: payload
      });
    }
  };

  handleSubmit = ({ methodName, doc, doc_id }) => {
    this.props.handleIsSavedState(true);
    Meteor.call(methodName, { doc, doc_id }, (error, result) => {
      if (error) {
      }
      if (result) {
        this.props.onClose();
      }
      this.setState({ isBusy: false, error });
    });
  };

  handleChange = name => event => {
    this.props.handleIsSavedState(false);
    this.setState({ [name]: event.target.checked });
  };

  cancelConfirmationModal = () =>
    this.setState({ showConfirmationModal: false });
  
  render() {
    const { fullScreen, data, classes, handleIsSavedState} = this.props;
    const { classTypeData } = this.state;
    let selectedCost, selectedCurrency;
    selectedCost = get(this.state, "cost", get(this.props, "data.cost", 0));
    selectedCurrency = get(
      this.state,
      "currency",
      get(this.props, "data.currency", "$")
    );

    return (
      <Dialog
        open={this.props.open}
        aria-labelledby="form-dialog-title"
        fullScreen={false}
        onClose={()=>{unSavedChecker.call(this)}}
      >
        <DialogTitle id="form-dialog-title">Add Enrollment Fee</DialogTitle>
        <EnrollmentText>
        {enrollmentText}
        </EnrollmentText>
        {this.state.showConfirmationModal && (
          <ConfirmationModal
            open={this.state.showConfirmationModal}
            submitBtnLabel="Yes, Delete"
            cancelBtnLabel="Cancel"
            message="You will delete this Enrollment Fee, Are you sure?"
            onSubmit={() =>
              this.handleSubmit({
                methodName: "enrollmentFee.removeEnrollmentFee",
                doc: data
              })
            }
            onClose={this.cancelConfirmationModal}
          />
        )}
        {this.state.isBusy && <ContainerLoader />}
        {this.state.error ? (
          <div style={{ color: "red" }}>{this.state.error}</div>
        ) : (
          <DialogContent>
            <form id={formId} onSubmit={this.onSubmit}>
              <TextField
                required={true}
                defaultValue={data && data.name}
                margin="dense"
                inputRef={ref => (this.enrollmentName = ref)}
                label="Enrollment Fee Name"
                type="text"
                fullWidth
                onChange={()=>{handleIsSavedState(false)}}
              />
              {!this.state.includeAllClassTypes &&  <SelectArrayInput
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
              /> }
             
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

              <Grid container>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required={!this.state.noExpiration}
                    disabled={this.state.noExpiration}
                    defaultValue={this.state.expDuration}
                    margin="dense"
                    inputRef={ref => (this.expDuration = ref)}
                    type="number"
                    label="Expiration Duration"
                    fullWidth
                    inputProps={{ min: "0" }}
                    onChange={()=>{handleIsSavedState(false)}}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel htmlFor="expiration-period">
                      Expiration Period
                    </InputLabel>
                    <Select
                      required={true}
                      input={<Input id="expiration-period" />}
                      value={this.state.expPeriod || null}
                      onChange={event =>{
                        handleIsSavedState(false);
                        this.setState({ expPeriod: event.target.value})
                      }
                      }
                      fullWidth
                      disabled={this.state.noExpiration}
                    >
                      <MenuItem value={"Days"}>Days</MenuItem>
                      <MenuItem value={"Weeks"}>Weeks</MenuItem>
                      <MenuItem value={"Months"}>Months</MenuItem>
                      <MenuItem value={"Years"}>Year</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <FormControl fullWidth margin="dense">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.noExpiration}
                      onChange={this.handleChange("noExpiration")}
                      value="noExpiration"
                    />
                  }
                  label="No Expiration"
                />
              </FormControl>
              <FormControl margin="dense" required={true} fullWidth>
                <InputLabel htmlFor="amount">Cost</InputLabel>
                <Tooltip
                  animation="zoom"
                  placement="top"
                  trigger={["click", "focus", "hover"]}
                  overlay={
                    <span>
                      Actual Amount:{" "}
                      {formatMoney(selectedCost, selectedCurrency)}
                    </span>
                  }
                  overlayStyle={{ zIndex: 9999 }}
                >
                  <Input
                    defaultValue={
                      data && Number.parseFloat(data.cost).toFixed(2)
                    }
                    inputRef={ref => (this.enrollmentCost = ref)}
                    onChange={e => {
                      let x = inputRestriction(e);
                      handleIsSavedState(false)
                      this.enrollmentCost.value = x;
                      this.setState({ cost: x });
                    }}
                    startAdornment={
                      <Select
                        required={true}
                        input={<Input id="currency" />}
                        value={this.state.currency}
                        onChange={event =>{
                          handleIsSavedState(false)
                          this.setState({ currency: event.target.value})
                        }
                        }
                      >
                        {config.currency.map((data, index) => {
                          return (
                            <MenuItem key={data.label} value={data.value}>
                              {data.value}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    }
                    label="Cost"
                    type="number"
                    fullWidth
                    inputProps={{ min: "0"}}
                  />
                </Tooltip>
              </FormControl>
            </form>
          </DialogContent>
        )}
        <DialogActions>
          {data &&
            !data.from && (
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
              onClick={this.props.onClose}
              label="Cancel"
              className={classes.cancel}
            />
          </ButtonWrapper>
          <ButtonWrapper>
            <FormGhostButton
              type="submit"
              form={formId}
              onClick={this.onSubmit}
              label={"Save"}
              className={classes.save}
            />
          </ButtonWrapper>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)( withMobileDialog()(withPopUp(EnrollmentFeeForm)) );
