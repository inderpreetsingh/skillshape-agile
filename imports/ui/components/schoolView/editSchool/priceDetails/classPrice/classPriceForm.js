import { get } from 'lodash';
import isEmpty from 'lodash/isEmpty';
import Checkbox from 'material-ui/Checkbox';
import Dialog, {
  DialogActions, DialogContent, DialogTitle, withMobileDialog,
} from 'material-ui/Dialog';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import React from 'react';
import styled from 'styled-components';
import '/imports/api/classPricing/methods';
import config from '/imports/config';
import SelectArrayInput from '/imports/startup/client/material-ui-chip-input/selectArrayInput';
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton.jsx';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
import { ContainerLoader } from '/imports/ui/loading/container';
import ConfirmationModal from '/imports/ui/modal/confirmationModal';
import {
  formatMoney, inputRestriction, withPopUp, withStyles, unSavedChecker,
} from '/imports/util';

const formId = 'ClassPriceForm';
const ButtonWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;
const styles = theme => ({
  button: {
    margin: 5,
    width: 150,
  },
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
});

class ClassPriceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBusy: false,
      pymtType: get(this.props, 'data.pymtType', ''),
      selectedClassType: get(this.props, 'data.selectedClassType', null),
      expPeriod: get(this.props, 'data.expPeriod', ''),
      includeAllClassTypes: get(this.props, 'data.includeAllClassTypes', ''),
      noExpiration: get(this.props, 'data.noExpiration', ''),
      currency: get(this.props, 'data.currency', this.props.currency),
      cost: get(this.props, 'data.cost', '0'),
      expDuration: get(this.props, 'data.exDuration', false),
    };
    this.props.handleIsSavedState(true);
  }

  handleClassTypeInputChange = (value) => {
    Meteor.call(
      'classType.getClassTypeByTextSearch',
      { schoolId: this.props.schoolId, textSearch: value },
      (err, res) => {
        this.setState({
          classTypeData: res || [],
        });
      },
    );
  };

  onClassTypeChange = (values) => {
    this.props.handleIsSavedState(false);
    this.setState({ selectedClassType: values });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { selectedClassType, expPeriod } = this.state;
    const { classTypeData, popUp } = this.props;
    const { data, schoolId } = this.props;
    const expDuration = this.expDuration.value && parseInt(this.expDuration.value);
    const allClassTypeIds = classTypeData.map(item => item._id);
    const payload = {
      schoolId,
      packageName: this.packageName.value,
      classTypeId: this.state.includeAllClassTypes
        ? allClassTypeIds
        : selectedClassType && selectedClassType.map(data => data._id),
      noClasses: this.noClasses.value && parseInt(this.noClasses.value),
      cost: this.classPriceCost.value && parseFloat(this.classPriceCost.value).toFixed(2),
      noExpiration: this.state.noExpiration,
      includeAllClassTypes: this.state.includeAllClassTypes,
      currency: this.state.currency,
    };
    if (isEmpty(payload.classTypeId) || !payload.currency || !payload.packageName || !payload.noClasses || !payload.cost || !this.state.noExpiration && !this.expDuration.value || !this.state.noExpiration && !expPeriod) {
      popUp.appear('alert', { title: 'Please Check', content: 'Not all required fields are complete.' });
      return;
    }
    if (!this.state.noExpiration) {
      payload.expDuration = parseInt(this.expDuration.value);
      payload.expPeriod = expPeriod;
    }
    if (payload.classTypeId == null) {
      payload.classTypeId = [];
    }
    this.setState({ isBusy: true });
    if (data && data._id) {
      this.handleSubmit({
        methodName: 'classPricing.editclassPricing',
        doc: payload,
        doc_id: data._id,
      });
    } else {
      this.handleSubmit({
        methodName: 'classPricing.addClassPricing',
        doc: payload,
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

  handleChange = name => (event) => {
    this.props.handleIsSavedState(false);
    this.setState({ [name]: event.target.checked });
  };

  cancelConfirmationModal = () => this.setState({ showConfirmationModal: false });

  render() {
    const {
      fullScreen, data, classes, schoolData, currency, handleIsSavedState,
    } = this.props;
    const { classTypeData, cost } = this.state;
    let selectedCost; let
      selectedCurrency;
    selectedCost = get(this.state, 'cost', get(this.props, 'data.cost', 0));
    selectedCurrency = get(this.state, 'currency', get(this.props, 'data.currency', '$'));
    return (
      <Dialog
        open={this.props.open}
        aria-labelledby="form-dialog-title"
        fullScreen={false}
        onClose={() => { unSavedChecker.call(this); }}
      >
        <DialogTitle id="form-dialog-title">Add Class Package</DialogTitle>
        {this.state.showConfirmationModal && (
          <ConfirmationModal
            open={this.state.showConfirmationModal}
            submitBtnLabel="Yes, Delete"
            cancelBtnLabel="Cancel"
            message="You will delete this Per Class Package, Are you sure?"
            onSubmit={() => this.handleSubmit({
              methodName: 'classPricing.removeClassPricing',
              doc: data,
            })
            }
            onClose={this.cancelConfirmationModal}
          />
        )}
        {this.state.isBusy && <ContainerLoader />}
        {this.state.error ? (
          <div style={{ color: 'red' }}>{this.state.error}</div>
        ) : (
          <DialogContent>
            <form id={formId} onSubmit={this.onSubmit}>
              <TextField
                required
                defaultValue={data && data.packageName}
                margin="dense"
                inputRef={ref => (this.packageName = ref)}
                label="Class Package Name"
                type="text"
                fullWidth
                onChange={() => { handleIsSavedState(false); }}
              />
              <SelectArrayInput
                disabled={false}
                floatingLabelText="Class Types"
                optionValue="_id"
                optionText="name"
                input={{
                  value: this.state.selectedClassType,
                  onChange: this.onClassTypeChange,
                }}
                onChange={this.onClassTypeChange}
                setFilter={this.handleClassTypeInputChange}
                dataSourceConfig={{ text: 'name', value: '_id' }}
                choices={classTypeData}
              />
              <FormControl fullWidth margin="dense">
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={this.state.includeAllClassTypes}
                      onChange={this.handleChange('includeAllClassTypes')}
                      value="includeAllClassTypes"
                    />
)}
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
                    inputProps={{ min: '0' }}
                    onChange={() => { handleIsSavedState(false); }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel htmlFor="expiration-period">
                      Expiration Period
                    </InputLabel>
                    <Select
                      required
                      input={<Input id="expiration-period" />}
                      value={this.state.expPeriod}
                      onChange={(event) => {
                        handleIsSavedState(false);
                        this.setState({ expPeriod: event.target.value });
                      }
                      }
                      fullWidth
                      disabled={this.state.noExpiration}
                    >
                      <MenuItem value="Days">Days</MenuItem>
                      <MenuItem value="Weeks">Weeks</MenuItem>
                      <MenuItem value="Months">Months</MenuItem>
                      <MenuItem value="Years">Year</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <FormControl fullWidth margin="dense">
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={this.state.noExpiration}
                      onChange={this.handleChange('noExpiration')}
                      value="noExpiration"
                    />
)}
                  label="No Expiration"
                />
              </FormControl>
              <TextField
                required
                defaultValue={data && data.noClasses}
                margin="dense"
                inputRef={ref => (this.noClasses = ref)}
                label="Number of Classes"
                type="number"
                fullWidth
                inputProps={{ min: '0' }}
                onChange={() => { handleIsSavedState(false); }}
              />

              <FormControl required fullWidth>
                <InputLabel htmlFor="amount">Cost</InputLabel>
                <Tooltip
                  animation="zoom"
                  placement="top"
                  trigger={['click', 'focus', 'hover']}
                  overlay={(
                    <span>
Actual Amount:
                      {' '}
                      {formatMoney(selectedCost, selectedCurrency)}
                    </span>
)}
                  overlayStyle={{ zIndex: 9999 }}
                >
                  <Input
                    id="class-cost"
                    inputRef={ref => (this.classPriceCost = ref)}
                    label="Cost"
                    defaultValue={data && Number.parseFloat(data.cost).toFixed(2)}
                    type="number"
                    onChange={(e) => {
                      handleIsSavedState(false);
                      const x = inputRestriction(e);
                      this.classPriceCost.value = x;
                      this.setState({ cost: x });
                    }}
                    startAdornment={(
                      <Select
                        required
                        input={<Input id="currency" />}
                        value={this.state.currency}
                        onChange={(event) => {
                          handleIsSavedState(false);
                          this.setState({ currency: event.target.value });
                        }
                    }
                      >
                        {config.currency.map((data, index) => (
                          <MenuItem
                            key={data.label}
                            value={data.value}
                          >
                            {data.value}
                          </MenuItem>
                        ))}
                      </Select>
)}
                    fullWidth
                    inputProps={{ min: '0' }}
                  />
                </Tooltip>
              </FormControl>
            </form>
          </DialogContent>
        )}
        <DialogActions>
          {data && !data.from && (
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
          <ButtonWrapper>
            <FormGhostButton
              type="submit"
              form={formId}
              onClick={this.onSubmit}
              label="Save"
              className={classes.save}
            />
          </ButtonWrapper>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(withMobileDialog()(withPopUp(ClassPriceForm)));
