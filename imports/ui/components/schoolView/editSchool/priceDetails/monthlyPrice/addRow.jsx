import { get } from 'lodash';
import { FormControl } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField';
import Tooltip from 'rc-tooltip';
import React from 'react';
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton';
import { formatMoney, inputRestriction } from '/imports/util';

export default class AddRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      row: get(this.props, 'rowData', [{ month: null, cost: null, currency: this.props.currency }]),
    };
  }

  componentWillReceiveProps(props) {
    // Change row data only if payment method changes
    if (this.props.tabValue != props.tabValue) {
      this.setState({
        row: get(props, 'rowData', [{ month: null, cost: null, currency: this.props.currency }]),
      });
    }
  }

  addNewRow = () => {
    const oldRow = [...this.state.row];
    oldRow.push({ month: null, cost: null, currency: this.props.currency });
    this.setState({ row: oldRow });
  };

  onChangeInput = (key, index, event) => {
    const { handleIsSavedState } = this.props;
    handleIsSavedState();
    const oldRow = [...this.state.row];
    if (key == 'cost') {
      const x = inputRestriction(event);
      oldRow[index][key] = x;
      event.target.value = x;
    } else {
      oldRow[index][key] = parseInt(event.target.value);
    }
    this.setState({ row: oldRow });
  };

  removeRow = (index, event) => {
    const oldRow = [...this.state.row];
    oldRow.splice(index, 1);
    this.setState({ row: oldRow });
  };

  getRowData = () => this.state.row;

  render() {
    const { tabValue, currency, handleIsSavedState } = this.props;

    return (
      <div
        style={{
          border: '1px solid black',
          margin: 2,
          padding: 5,
          backgroundColor: 'antiquewhite',
        }}
      >
        {this.state.row.map((data, index) => (
          <Grid key={tabValue + index} container>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                defaultValue={get(data, 'month', 0)}
                onChange={this.onChangeInput.bind(this, 'month', index)}
                margin="dense"
                label="Months"
                type="number"
                fullWidth
                inputProps={{ min: '0' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl margin="dense" required fullWidth>
                <InputLabel htmlFor="amount">Cost</InputLabel>
                <Tooltip
                  animation="zoom"
                  placement="top"
                  trigger={['click', 'focus', 'hover']}
                  overlay={(
                    <span>
                      Actual Amount:
                      {formatMoney(data.cost, data.currency)}
                    </span>
)}
                  overlayStyle={{ zIndex: 9999 }}
                >
                  <Input
                    defaultValue={Number.parseFloat(data.cost || 0).toFixed(2)}
                    inputRef={ref => (this.monthlyCost = ref)}
                    onChange={this.onChangeInput.bind(this, 'cost', index)}
                    startAdornment={(
                      <Select
                        required
                        input={<Input id="currency" />}
                        value={data.currency || currency}
                        onChange={(event) => {
                          const oldRow = [...this.state.row];
                          oldRow[index].currency = event.target.value;
                          this.setState({ row: oldRow });
                          handleIsSavedState();
                        }}
                      >
                        {config.currency.map((data, index) => (
                          <MenuItem key={data.label} value={data.value}>
                            {data.value}
                          </MenuItem>
                        ))}
                      </Select>
)}
                    label="Cost"
                    type="number"
                    fullWidth
                    inputProps={{ min: '0' }}
                  />
                </Tooltip>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormGhostButton
                alertColor
                onClick={this.removeRow.bind(this, index)}
                label="Delete"
              />
            </Grid>
          </Grid>
        ))}
        <FormGhostButton darkGreyColor onClick={this.addNewRow} label="Add Another Row" />
      </div>
    );
  }
}
