import { get } from 'lodash';
import isEmpty from 'lodash/isEmpty';
import Button from 'material-ui/Button';
import Checkbox from 'material-ui/Checkbox';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField';
import React from 'react';
import styled from 'styled-components';
import AddRow from './addRow';
import '/imports/api/sLocation/methods';
import SelectArrayInput from '/imports/startup/client/material-ui-chip-input/selectArrayInput';
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import { ContainerLoader } from '/imports/ui/loading/container';
import ConfirmationModal from '/imports/ui/modal/confirmationModal';
import { unSavedChecker, withPopUp, withStyles } from '/imports/util';

const ButtonWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const formId = 'LocationForm';
const styles = theme => ({
  button: {
    margin: 5,
    width: 150,
  },
  checked: {
    color: theme.palette.grey[300],
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

class MonthlyPriceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initalizeFormValues();
  }

  initalizeFormValues = () => {
    this.props.handleIsSavedState(true);
    const pymtType = get(this.props, 'data.pymtType', null);
    const pymtMethod = get(this.props, 'data.pymtMethod', null);
    const state = {
      isBusy: false,
      pymtType,
      selectedClassType: get(this.props, 'data.selectedClassType', null),
      tabValue: 0,
      autoWithDraw: pymtType && pymtType.autoWithDraw,
      payAsYouGo: pymtType && pymtType.payAsYouGo,
      pymtDetails: get(this.props, 'data.pymtDetails', [{ month: null, cost: null }]),
      pymtMethod,
      includeAllClassTypes: get(this.props, 'data.includeAllClassTypes', ''),
      duPeriod: get(this.props, 'data.duPeriod', ''),
    };

    if (pymtMethod && pymtMethod === 'Pay Up Front') state.tabValue = 1;
    return state;
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { selectedClassType, pymtType, tabValue } = this.state;
    const {
      data, schoolId, popUp, classTypeData,
    } = this.props;
    let rowsUniqueness = true;
    const allClassTypeIds = classTypeData.map(item => item._id);
    this.refs.AddRow.getRowData().map((value1, index1) => {
      this.refs.AddRow.getRowData().map((value2, index2) => {
        if (
          value1.month == value2.month
          && value1.currency == value2.currency
          && index1 != index2
        ) {
          rowsUniqueness = false;
        }
      });
    });
    if (rowsUniqueness) {
      const payload = {
        schoolId,
        packageName: this.packageName.value,
        classTypeId: this.state.includeAllClassTypes
          ? allClassTypeIds
          : selectedClassType && selectedClassType.map(data => data._id),
        pymtMethod: 'Pay Up Front',
        pymtDetails: this.refs.AddRow.getRowData(),
        includeAllClassTypes: this.state.includeAllClassTypes,
        noClasses: this.noClasses.value,
        duPeriod: this.state.duPeriod,
      };
      if (isEmpty(payload.classTypeId) || !payload.packageName || !payload.pymtDetails) {
        popUp.appear('alert', { title: 'Error', content: 'Some Field is missing.' });
        return;
      }
      if (tabValue === 0) {
        // No option is selected for making payment then need to show this `Please select any payment type`.
        if ((pymtType && !pymtType.autoWithDraw && !pymtType.payAsYouGo) || !pymtType) {
          popUp.appear('alert', { title: 'Error', content: 'Please select any payment type.' });
          return;
        }
        if (pymtType && pymtType.payUpFront) {
          delete pymtType.payUpFront;
        }
        payload.pymtType = pymtType;
        payload.pymtMethod = 'Pay Each Month';
      } else {
        payload.pymtType = { payUpFront: true };
      }
      this.setState({ isBusy: true });

      if (data && data._id) {
        this.handleSubmit({
          methodName: 'monthlyPricing.editMonthlyPricing',
          doc: payload,
          doc_id: data._id,
        });
      } else {
        this.handleSubmit({ methodName: 'monthlyPricing.addMonthlyPricing', doc: payload });
      }
    } else {
      popUp.appear('alert', { title: 'Error', content: 'Month and currency must be unique' });
    }
  };

  handleSubmit = ({ methodName, doc, doc_id }) => {
    this.props.handleIsSavedState(true);
    Meteor.call(methodName, { doc, doc_id }, (error, result) => {
      if (result) {
        console.log(result);
        this.props.onClose();
      } else {
        this.setState({ isBusy: false, error });
      }
    });
  };

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

  handleCheckBox = (key, disableKey, pymtType, event, isInputChecked) => {
    this.props.handleIsSavedState(false);
    const oldPayment = this.state.pymtType || {};
    oldPayment[pymtType] = isInputChecked;
    oldPayment[disableKey] = !isInputChecked;
    this.setState({
      [key]: isInputChecked,
      pymtType: oldPayment,
      [disableKey]: !isInputChecked,
    });
  };

  handleChange = name => (event) => {
    this.props.handleIsSavedState(false);
    this.setState({ [name]: event.target.checked });
  };

  cancelConfirmationModal = () => this.setState({ showConfirmationModal: false });

  render() {
    const {
      data, classes, currency, handleIsSavedState,
    } = this.props;
    const { classTypeData, pymtMethod, pymtDetails } = this.state;
    const tabValue = this.state.tabValue === 0 ? 'Pay Each Month' : 'Pay Up Front';
    return (
      <div>
        <Dialog
          open={this.props.open}
          aria-labelledby="form-dialog-title"
          fullScreen={false}
          onClose={() => {
            unSavedChecker.call(this);
          }}
        >
          <DialogTitle id="form-dialog-title">Add Monthly Pricing</DialogTitle>
          {this.state.isBusy && <ContainerLoader />}
          {this.state.showConfirmationModal && (
            <ConfirmationModal
              open={this.state.showConfirmationModal}
              submitBtnLabel="Yes, Delete"
              cancelBtnLabel="Cancel"
              message="You will delete this Per Month Package, Are you sure?"
              onSubmit={() => this.handleSubmit({
                methodName: 'monthlyPricing.removeMonthlyPricing',
                doc: data,
              })
              }
              onClose={this.cancelConfirmationModal}
            />
          )}
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
                  label="Package Name"
                  type="text"
                  fullWidth
                  onChange={() => {
                    handleIsSavedState(false);
                  }}
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
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <TextField
                    defaultValue={data && data.noClasses}
                    margin="dense"
                    inputRef={ref => (this.noClasses = ref)}
                    label="Maximum classes"
                    type="number"
                    fullWidth
                    inputProps={{ min: '0' }}
                    onChange={() => {
                      handleIsSavedState(false);
                    }}
                  />

                  <FormControl fullWidth margin="dense">
                    <InputLabel htmlFor="duration-period">Duration Period</InputLabel>
                    <Select
                      required
                      input={<Input id="duration-period" />}
                      value={this.state.duPeriod || 'day'}
                      onChange={(event) => {
                        handleIsSavedState(false);
                        this.setState({ duPeriod: event.target.value });
                      }}
                      fullWidth
                    >
                      <MenuItem value="Day">Day</MenuItem>
                      <MenuItem value="Week">Week</MenuItem>
                      <MenuItem value="Month">Month</MenuItem>
                      <MenuItem value="Year">Year</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="responsive-tab">
                  <div
                    style={{
                      display: 'inline-flex',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                    }}
                  >
                    <Button
                      className={classes.button}
                      onClick={() => this.setState({ tabValue: 0 })}
                      raised
                      color={this.state.tabValue == 0 && 'primary'}
                    >
                      Pay Each Month
                    </Button>
                    <Button
                      className={classes.button}
                      onClick={() => this.setState({ tabValue: 1 })}
                      raised
                      color={this.state.tabValue == 1 && 'primary'}
                    >
                      Pay Up Front
                    </Button>
                  </div>
                </div>
                <div
                  style={{
                    border: '1px solid blue',
                    padding: 10,
                    backgroundColor: 'dimgrey',
                  }}
                >
                  {this.state.tabValue === 0 && (
                    <Grid container>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={(
                            <Checkbox
                              checked={this.state.autoWithDraw}
                              onChange={this.handleCheckBox.bind(
                                this,
                                'autoWithDraw',
                                'payAsYouGo',
                                'autoWithDraw',
                              )}
                              value="autoWithDraw"
                              classes={{
                                checked: classes.checked,
                              }}
                            />
)}
                          label="Automatic Withdrawal"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={(
                            <Checkbox
                              checked={this.state.payAsYouGo}
                              onChange={this.handleCheckBox.bind(
                                this,
                                'payAsYouGo',
                                'autoWithDraw',
                                'payAsYouGo',
                              )}
                              value="payAsYouGo"
                              classes={{
                                checked: classes.checked,
                              }}
                            />
)}
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
                        ? [{ month: null, cost: null, currency }]
                        : pymtDetails
                    }
                    classes={classes}
                    currency={currency}
                    handleIsSavedState={() => {
                      handleIsSavedState(false);
                    }}
                  />
                </div>
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
      </div>
    );
  }
}

export default withStyles(styles)(withMobileDialog()(withPopUp(MonthlyPriceForm)));
