import React from "react";
import Grid from "material-ui/Grid";
import isEmpty from "lodash/isEmpty";
import { MaterialDatePicker } from "/imports/startup/client/material-ui-date-picker";
import { MaterialTimePicker } from "/imports/startup/client/material-ui-time-picker";
import Select from "material-ui/Select";
import TextField from "material-ui/TextField";
import Input, { InputLabel } from "material-ui/Input";
import Button from "material-ui/Button";
import { FormControl } from "material-ui/Form";
import { MenuItem } from "material-ui/Menu";
import Typography from "material-ui/Typography";
import config from "/imports/config";
import { DialogActions } from "material-ui/Dialog";

export class OneTimeRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initializeFields();
  }

  initializeFields = () => {
    let state;
    const { data, locationData, parentData } = this.props;

    if (isEmpty(data)) {
      state = {
        row: [
          {
            startDate: new Date(),
            startTime: new Date(),
            duration: "",
            roomId: "",
            timeUnits: "Minutes"
          }
        ]
      };
    } else {
      state = { row: [...data] };
    }
    return state;
  };

  addNewRow = () => {
    const oldRow = [...this.state.row];
    oldRow.push({
      startDate: new Date(),
      startTime: new Date(),
      duration: "",
      roomId: ""
    });
    this.setState({ row: oldRow });
  };

  removeRow = (index, event) => {
    const oldRow = [...this.state.row];
    oldRow.splice(index, 1);
    this.setState({ row: oldRow });
  };

  handleChangeDate = (index, fieldName, date) => {
    const oldRow = [...this.state.row];
    if (fieldName == "startTime") {
      let selectedDate = oldRow[index]["startDate"];
      let currentDate = selectedDate.getDate();
      date = new Date(date).setDate(currentDate);
    } else {
      // Need to change time according to selected date.
      oldRow[index]["startTime"] = new Date(date);
    }
    oldRow[index][fieldName] = new Date(date);
    this.setState({ row: oldRow });
  };

  handleSelectInputChange = (index, fieldName, event) => {
    //index condition in if below is removed
    if (fieldName && event) {
      const oldRow = [...this.state.row];
      if (fieldName === "duration") {
        oldRow[index][fieldName] = parseInt(event.target.value);
      } else {
        oldRow[index][fieldName] = event.target.value;
      }

      this.setState({ row: oldRow });
    }
  };

  getRowData = () => {
    return this.state.row;
  };

  render() {
    const { row } = this.state;
    console.log("OneTimeRow state -->>", this.state);
    return (
      <div>
        {row.map((data, index) => {
          return (
            <Grid
              style={{
                border: "1px solid black",
                marginBottom: 15,
                padding: 5,
                backgroundColor: "antiquewhite"
              }}
              key={index}
              container
            >
              <Grid item sm={6} xs={12}>
                <MaterialDatePicker
                  required={true}
                  hintText={"Start Date"}
                  floatingLabelText={"Date *"}
                  value={data ? data.startDate : ""}
                  onChange={this.handleChangeDate.bind(
                    this,
                    index,
                    "startDate"
                  )}
                  fullWidth={true}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <MaterialTimePicker
                  required={true}
                  value={data ? data.startTime : ""}
                  floatingLabelText={"Start Time *"}
                  hintText={"Start Time"}
                  onChange={this.handleChangeDate.bind(
                    this,
                    index,
                    "startTime"
                  )}
                  fullWidth={true}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Grid
                  container
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    padding: "3px"
                  }}
                >
                  <Grid sm={6}>
                    <TextField
                      required={true}
                      defaultValue={data ? data.duration : ""}
                      margin="dense"
                      label="Length"
                      type="number"
                      onChange={this.handleSelectInputChange.bind(
                        this,
                        index,
                        "duration"
                      )}
                      fullWidth
                      defaultValue={data && data.duration}
                    />
                  </Grid>
                  <Grid sm={6}>
                    <FormControl
                      fullWidth
                      margin="dense"
                      style={{ padding: "4px" }}
                    >
                      <InputLabel htmlFor="weekDay" shrink={true}>
                        Units
                      </InputLabel>
                      <Select
                        input={<Input id="duration" />}
                        value={(data && data.timeUnits) || "Minutes"}
                        onChange={this.handleSelectInputChange.bind(
                          this,
                          index,
                          "timeUnits"
                        )}
                        fullWidth
                      >
                        {config.duration.map((data, index) => {
                          return (
                            <MenuItem
                              key={`${index}-${data.value}`}
                              value={data.value}
                            >
                              {data.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth margin="dense">
                  <InputLabel htmlFor="roomId">Room</InputLabel>
                  <Select
                    input={<Input id="roomId" />}
                    value={data ? data.roomId : ""}
                    onChange={this.handleSelectInputChange.bind(
                      this,
                      index,
                      "roomId"
                    )}
                    fullWidth
                  >
                    {isEmpty(this.props.roomData) && (
                      <MenuItem value="" disabled>
                        Needs class type location
                      </MenuItem>
                    )}
                    {console.log("this.props.roomData", this.props.roomData)}
                    {this.props.roomData &&
                      this.props.roomData.map((data, index) => {
                        return (
                          <MenuItem key={index} value={data.id}>
                            {data.name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  onClick={this.removeRow.bind(this, index)}
                  raised
                  color="accent"
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          );
        })}
        <div>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <Typography
                type="caption"
                style={{ maxWidth: "188px", padding: "8px" }}
              >
                Use this if there is another class with the same repeating
                pattern and students are expected to attend all class times in
                this group.
              </Typography>

              <Typography
                type="caption"
                style={{ maxWidth: "188px", padding: "8px" }}
              >
                Use this if there is a different repeating type or students can
                come to any class time available.
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <Button onClick={this.addNewRow} raised color="secondary">
                Add Linked Class Time
              </Button>

              <Button
                onClick={this.props.saveClassTimes.bind(this, event, {
                  addSeperateTime: true
                })}
                raised
                color="secondary"
              >
                Add Separate Class Time
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
