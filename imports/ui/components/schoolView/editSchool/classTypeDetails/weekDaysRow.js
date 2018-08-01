import React from "react";
import Grid from "material-ui/Grid";
import { MaterialTimePicker } from "/imports/startup/client/material-ui-time-picker";
import Select from "material-ui/Select";
import TextField from "material-ui/TextField";
import Input, { InputLabel } from "material-ui/Input";
import Button from "material-ui/Button";
import { FormControl } from "material-ui/Form";
import { MenuItem } from "material-ui/Menu";
import Typography from "material-ui/Typography";
import config from "/imports/config";
import isEmpty from "lodash/isEmpty";

const scheduleDetails = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

export class WeekDaysRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initializeFields();
  }

  initializeFields = () => {
    const { data, locationData, parentData } = this.props;
    const state = {
      row: []
    };
    if (!_.isEmpty(data)) {
      // console.log("WeekDaysRow initializeFields -->>",data);
      for (let key in data) {
        for (let obj of data[key]) {
          state.row.push({
            key: key,
            startTime: obj.startTime,
            duration: obj.duration,
            day: obj.day,
            roomId: obj.roomId,
            timeUnits: (obj && obj.timeUnits) || "Minutes"
          });
        }
      }
    } else {
      // Initial state if we are adding time instead of editing class time
      state.row.push({
        key: "",
        startTime: new Date(),
        duration: "",
        day: null,
        roomId: "",
        timeUnits: "Minutes"
      });
    }
    // console.log("WeekDaysRow initializeFields -->>",state)
    return state;
  };

  handleChangeDate = (index, fieldName, date) => {
    const oldRow = [...this.state.row];
    oldRow[index][fieldName] = new Date(date);
    this.setState({ row: oldRow });
  };

  addNewRow = () => {
    const oldRow = [...this.state.row];
    oldRow.push({
      key: null,
      startTime: new Date(),
      duration: "",
      day: null,
      roomId: null
    });
    this.setState({ row: oldRow });
  };

  removeRow = (index, event) => {
    const oldRow = [...this.state.row];
    oldRow.splice(index, 1);
    this.setState({ row: oldRow });
  };

  handleSelectInputChange = (index, fieldName, event) => {
    const oldRow = [...this.state.row];
    oldRow[index][fieldName] = event.target.value;

    if (fieldName === "key") {
      let indexOfDay = scheduleDetails.indexOf(event.target.value);
      oldRow[index].day = 1 + scheduleDetails.indexOf(event.target.value);
      // Set Time according to week day selected.
      let ret = new Date();
      ret.setDate(ret.getDate() + ((indexOfDay - ret.getDay()) % 7) + 1);
      oldRow[index]["startTime"] = ret;
    }

    if (fieldName === "duration") {
      oldRow[index][fieldName] = parseInt(event.target.value);
    }
    this.setState({ row: oldRow });
  };

  getRowData = () => {
    let rowData = this.state.row.filter(data => {
      return data.key;
    });
    const grouped = _.groupBy(rowData, function(item) {
      return item.key;
    });
    return grouped;
  };

  render() {
    const { row } = this.state;
   
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
                {/*Repeating class is useful when you plan to teach the same class multiple times. You can schedule the recurring class at one go without the need to schedule every time you plan to offer the same class.*/}
                <FormControl fullWidth margin="dense">
                  <InputLabel htmlFor="weekDay" shrink={true}>
                    WeekDay
                  </InputLabel>
                  <Select
                    input={<Input id="weekDay" />}
                    value={data ? data.key : ""}
                    onChange={this.handleSelectInputChange.bind(
                      this,
                      index,
                      "key"
                    )}
                    fullWidth
                  >
                    {scheduleDetails.map((day, key) => {
                      return (
                        <MenuItem key={key} value={day}>
                          {day}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={6} xs={12}>
                <MaterialTimePicker
                  required={true}
                  value={data && data.startTime}
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
                  <Grid item sm={6}>
                    <TextField
                      defaultValue={data && data.duration}
                      margin="dense"
                      onChange={this.handleSelectInputChange.bind(
                        this,
                        index,
                        "duration"
                      )}
                      label="Duration"
                      type="number"
                      fullWidth
                      required={
                        data && data.key ? true : false
                      } /*Made it mandatory if week day selected*/
                      disabled={
                        data && data.key ? false : true
                      } /*Made it disabled if weekday is not selected*/
                    />
                  </Grid>
                  <Grid sm={6}>
                    <FormControl fullWidth margin="dense">
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
                    value={data && data.roomId ? data.roomId : !isEmpty(this.props.roomData) && this.props.roomData[0].id}
                    input={<Input id="roomId" />}
                    onChange={this.handleSelectInputChange.bind(
                      this,
                      index,
                      "roomId"
                    )}
                    fullWidth
                  >
                    {isEmpty(this.props.roomData) && (
                      <MenuItem value="" disabled>
                        No location added in Locations.
                      </MenuItem>
                    )}
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
        {/* <div>
          <Typography type="caption">
            Unless attendance to more than one class is required, a separate
            Class Times should be created for each class. If it is required that
            students come to more than one class, add the additional class time
            here.
          </Typography>
          <Button
            onClick={this.addNewRow}
            style={{ width: 162 }}
            raised
            color="secondary"
          >
            Add Another Time
          </Button>
        </div> */}
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
