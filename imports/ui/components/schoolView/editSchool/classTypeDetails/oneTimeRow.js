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
import { LinkedTime, CTFormWrapper, CTFormRow, CTFormControlHW } from './sharedStyledComponents';


const Wrapper = styled.div`
${helpers.flexCenter}
flex-wrap: wrap;

@media screen and (max-width: ${helpers.mobile}px) {
  flex-direction: column;
}
`;

const ButtonWrapper = styled.div`
  ${helpers.flexCenter}
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
    const { locationData, data, roomData } = this.props;
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
  setDefaultLocation = (defaultLocId) => {
    this.setState({ locationId: defaultLocId })
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
  handleRoomData = (locationId, roomId, index) => {
    this.setState({ row: oldRow });
  }
  render() {
    const { row } = this.state;
    return (
      <Wrapper>
        {row.map((data, index) => {
          return (<CTFormWrapper>
            <CTFormRow>
              <CTFormControlHW>
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
              </CTFormControlHW>
              <CTFormControlHW>
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
              </CTFormControlHW>
            </CTFormRow>

            <CTFormRow>
              <CTFormControlHW>
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
                  inputProps={{ min: "0" }}
                />
              </CTFormControlHW>

              <CTFormControlHW>
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
              </CTFormControlHW>
            </CTFormRow>

            <ButtonWrapper>
              <FormGhostButton
                icon
                iconName="delete"
                alertColor
                onClick={this.removeRow.bind(this, index)}
                label="Delete"
              />
            </ButtonWrapper>
          </CTFormWrapper>

          );
        })}

        <LinkedTime>
          <FormGhostButton
            darkGreyColor
            onClick={this.addNewRow}
            label="Add Linked Class Time"
          />

        </LinkedTime>

      </Wrapper>
    );
  }
}
