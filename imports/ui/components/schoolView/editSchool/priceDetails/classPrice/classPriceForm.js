import React from "react";
import { get } from "lodash";
import { ContainerLoader } from "/imports/ui/loading/container";
import SelectArrayInput from "/imports/startup/client/material-ui-chip-input/selectArrayInput";
import { withStyles } from "/imports/util";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import Grid from "material-ui/Grid";
import Select from "material-ui/Select";
import Input, { InputLabel, InputAdornment } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import ConfirmationModal from "/imports/ui/modal/confirmationModal";
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  withMobileDialog
} from "material-ui/Dialog";
import { FormControl, FormControlLabel } from "material-ui/Form";
import Icon from "material-ui/Icon";
import "/imports/api/classPricing/methods";
import Checkbox from "material-ui/Checkbox";

const formId = "ClassPriceForm";

const styles = theme => {
  return {
    button: {
      margin: 5,
      width: 150
    }
  };
};

class ClassPriceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBusy: false,
      pymtType: get(this.props, "data.pymtType", ""),
      selectedClassType: get(this.props, "data.selectedClassType", null),
      expPeriod: get(this.props, "data.expPeriod", ""),
      includeAllClassTypes: get(this.props, "data.includeAllClassTypes", ""),
      noExpiration: get(this.props, "data.noExpiration", "")
    };
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
    this.setState({ selectedClassType: values });
  };

  onSubmit = event => {
    event.preventDefault();
    const { selectedClassType, expPeriod } = this.state;
    const { classTypeData } = this.props;
    const { data, schoolId } = this.props;
    const expDuration =
      this.expDuration.value && parseInt(this.expDuration.value);
    let allClassTypeIds = classTypeData.map(item => {
      return item._id;
    });
    const payload = {
      schoolId: schoolId,
      packageName: this.packageName.value,
      classTypeId: this.state.includeAllClassTypes
        ? allClassTypeIds
        : selectedClassType && selectedClassType.map(data => data._id),
      expDuration: (!this.state.noExpiration && expDuration) || null,
      expPeriod:
        !this.state.noExpiration && expDuration && expDuration > 1
          ? expPeriod
          : expPeriod.replace("s", ""),
      noClasses: this.noClasses.value && parseInt(this.noClasses.value),
      cost: this.classPriceCost.value && parseInt(this.classPriceCost.value),
      noExpiration: this.state.noExpiration,
      includeAllClassTypes: this.state.includeAllClassTypes
    };
    this.setState({ isBusy: true });
    if (data && data._id) {
      this.handleSubmit({
        methodName: "classPricing.editclassPricing",
        doc: payload,
        doc_id: data._id
      });
    } else {
      this.handleSubmit({
        methodName: "classPricing.addClassPricing",
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
  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  cancelConfirmationModal = () =>
    this.setState({ showConfirmationModal: false });

  render() {
    const { fullScreen, data, classes,schoolData,currency } = this.props;
    const { classTypeData } = this.state;
    
    return (
      <Dialog
        open={this.props.open}
        aria-labelledby="form-dialog-title"
        fullScreen={fullScreen}
      >
        <DialogTitle id="form-dialog-title">Add Class Package</DialogTitle>
        {this.state.showConfirmationModal && (
          <ConfirmationModal
            open={this.state.showConfirmationModal}
            submitBtnLabel="Yes, Delete"
            cancelBtnLabel="Cancel"
            message="You will delete this Per Class Package, Are you sure?"
            onSubmit={() =>
              this.handleSubmit({
                methodName: "classPricing.removeClassPricing",
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
                defaultValue={data && data.packageName}
                margin="dense"
                inputRef={ref => (this.packageName = ref)}
                label="Class Package Name"
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
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required={!this.state.noExpiration}
                    disabled={this.state.noExpiration}
                    defaultValue={data && data.expDuration}
                    margin="dense"
                    inputRef={ref => (this.expDuration = ref)}
                    type="number"
                    label="Expiration Duration"
                    fullWidth
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
                      value={this.state.expPeriod}
                      onChange={event =>
                        this.setState({ expPeriod: event.target.value })
                      }
                      fullWidth
                      disabled={this.state.noExpiration}
                    >
                      <MenuItem value={"Days"}>Days</MenuItem>
                      <MenuItem value={"Months"}>Months</MenuItem>
                      <MenuItem value={"Year"}>Year</MenuItem>
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
              <TextField
                required={true}
                defaultValue={data && data.noClasses}
                margin="dense"
                inputRef={ref => (this.noClasses = ref)}
                label="Number of Classes"
                type="number"
                margin="dense"
                fullWidth
              />
              <FormControl required={true} fullWidth>
                <InputLabel htmlFor="amount">Cost</InputLabel>
                <Input
                  id="class-cost"
                  defaultValue={data && data.cost}
                  inputRef={ref => (this.classPriceCost = ref)}
                  label="Cost"
                  type="number"
                  startAdornment={
                    <InputAdornment position="start">{currency&&currency}</InputAdornment>
                  }
                  fullWidth
                />
              </FormControl>
            </form>
          </DialogContent>
        )}
        <DialogActions>
          {data && (
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
    );
  }
}

export default withStyles(styles)(withMobileDialog()(ClassPriceForm));
