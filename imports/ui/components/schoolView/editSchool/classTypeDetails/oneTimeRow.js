import React from "react";
import Grid from "material-ui/Grid";
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
import styled from "styled-components";
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
const ButtonWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;
export class OneTimeRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initializeFields();
  }

  initializeFields = () => {
    let state;
    const { data, parentData } = this.props;
    if (_.isEmpty(data)) {

      state = {
        row: [
          {
            startDate: new Date(),
            startTime: new Date(),
            duration: 60,
            timeUnits: "Minutes",
          }
        ]
      };
      this.props.handleNoOfRow(1);
    } else {
      state = { row: [...data] };
      this.props.handleNoOfRow(data.length);
    }
    return state;
  };
 
  addNewRow = () => {
    const {locationData,data,roomData} = this.props;
    const oldRow = [...this.state.row];
    oldRow.push({
      startDate: new Date(),
      startTime: new Date(),
      duration: 60,
    });
    this.setState({ row: oldRow });
    this.props.handleNoOfRow(1);
  };

  removeRow = (index, event) => {
    const oldRow = [...this.state.row];
    oldRow.splice(index, 1);
    this.setState({ row: oldRow });
    this.props.handleNoOfRow(-1);
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
  //Set default location id if nothing selected 
  setDefaultLocation=(defaultLocId)=>{
    this.setState({locationId:defaultLocId})
    return defaultLocId;
  }
  handleSelectInputChange = (index, fieldName, event) => {
    //index condition in if below is removed
    const { locationData } = this.props;

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
    console.log("this.state.row ", this.state.row);
    return this.state.row;
  };
  handleRoomData = (locationId,roomId,index)=> {
  this.setState({row:oldRow});
  }
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
                <MaterialDatePicker
                  required={true}
                  hintText={"Date"}
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
                      defaultValue={data && data.duration != "" ? data.duration : 60}
                      margin="dense"
                      label="Duration"
                      type="number"
                      onChange={this.handleSelectInputChange.bind(
                        this,
                        index,
                        "duration"
                      )}
                      fullWidth
                      inputProps={{ min: "0"}}
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
              
              <Grid item xs={12} sm={4}>
                
                 <ButtonWrapper>
            <FormGhostButton
              alertColor
              onClick={this.removeRow.bind(this, index)}
              label="Delete"
            />
          </ButtonWrapper>
              </Grid>
            </Grid>
          );
        })}
        <div>
          <div>
            
            <div
              style={{
                display: "flex",
                justifyContent: "center"
              }}
            >
              
              <ButtonWrapper>
                  <FormGhostButton
                    darkGreyColor
                    onClick={this.addNewRow}
                    label="Add Linked Class Time"
                  />
                </ButtonWrapper>
            
            </div>
          </div>
        </div>
      </div>
    );
  }
}
