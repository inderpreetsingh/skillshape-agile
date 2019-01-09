import React from "react";
import Grid from "material-ui/Grid";
import { MaterialTimePicker } from "/imports/startup/client/material-ui-time-picker";
import Select from "material-ui/Select";
import MultiSelect from "react-select";
import TextField from "material-ui/TextField";
import Input, { InputLabel } from "material-ui/Input";
import { FormControl } from "material-ui/Form";
import { MenuItem } from "material-ui/Menu";
import Typography from "material-ui/Typography";
import config from "/imports/config";
import styled from "styled-components";
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
const ButtonWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const Wrapper = styled.div`
  ${helpers.flexCenter}
  flex-wrap: wrap;
`;

const FormWrapper = styled.div`
  background: white;
  max-width: 50%;
  width: 100%;
  margin-right: 8px;
  padding: ${helpers.rhythmDiv}px ${helpers.rhythmDiv * 2}px;
`;

const AddLinkedTime = styled.div`
  ${helpers.flexCenter}  
  max-width: 50%;
  flex-grow: 1;
  align-self:
  width: 100%;
  border: 1px dotted #333;
`;

export class WeekDaysRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initializeFields();
  }

  initializeFields = () => {
    const { data, locationData } = this.props;
    const state = {
      row: [],
      Weekdays: [
        { value: 1, label: "Monday" },
        { value: 2, label: "Tuesday" },
        { value: 3, label: "Wednesday" },
        { value: 4, label: "Thursday" },
        { value: 5, label: "Friday" },
        { value: 6, label: "Saturday" },
        { value: 0, label: "Sunday" }
      ]
    };
    if (!_.isEmpty(data)) {
      data.map((obj, index) => {
        state.row.push({
          key: obj.key,
          startTime: obj.startTime,
          duration: obj.duration,
          day: obj.day || 0,
          timeUnits: (obj && obj.timeUnits) || "Minutes",
        })
      })
      // for (let key in data) {
      //   for (let obj of data[key]) {
      //     state.row.push({
      //       key: obj.key,
      //       startTime: obj.startTime,
      //       duration: obj.duration,
      //       day: obj.day,
      //       timeUnits: (obj && obj.timeUnits) || "Minutes",
      //     });
      //   }
      // }
    } else {
      // Initial state if we are adding time instead of editing class time
      state.row.push({
        key: [{ label: 'Sunday', value: 0 }],
        startTime: new Date(),
        duration: 60,
        day: 0,
        timeUnits: "Minutes",
      });
    }
    return state;
  };

  handleChangeDate = (index, fieldName, date) => {
    const oldRow = [...this.state.row];
    oldRow[index][fieldName] = new Date(date);
    this.setState({ row: oldRow });
  };

  addNewRow = () => {
    const { locationData, roomData } = this.props;
    const oldRow = [...this.state.row];
    oldRow.push({
      key: [{ label: 'Sunday', value: 0 }],
      startTime: new Date(),
      duration: 60,
      day: 0,
    });
    this.setState({ row: oldRow });
  };
  //Set default location id if nothing selected 
  removeRow = (index, event) => {
    const oldRow = [...this.state.row];
    oldRow.splice(index, 1);
    this.setState({ row: oldRow });
  };

  handleSelectInputChange = (index, fieldName, event) => {
    const oldRow = [...this.state.row];
    const { locationData } = this.props;
    oldRow[index][fieldName] = event.target.value;

    if (fieldName === "key") {
      let indexOfDay = scheduleDetails.indexOf(event.target.value);
      oldRow[index].day = 1 + scheduleDetails.indexOf(event.target.value);
    }

    if (fieldName === "duration") {
      oldRow[index][fieldName] = parseInt(event.target.value);
    }

    this.setState({ row: oldRow });
  };

  getRowData = () => {
    // let rowData = this.state.row.filter(data => {
    //   return data.key;
    // });
    // const grouped = _.groupBy(rowData, function (item) {
    //   return item.key;
    // });
    // return grouped;
    console.log("this.state.row ", this.state.row);
    return this.state.row;
  };
  handleWeekDay = (key, index) => {
    let oldRow = this.state.row;
    oldRow[index][`key`] = key;
    this.setState({ row: oldRow });
  }
  render() {
    const { row, Weekdays } = this.state;
    return (
      <Wrapper>
        {row.map((data, index) => {
          return (<FormWrapper>

            {/*Repeating class is useful when you plan to teach the same class multiple times. You can schedule the recurring class at one go without the need to schedule every time you plan to offer the same class.*/}
            <FormControl fullWidth margin="dense">
              <InputLabel htmlFor="weekDay" shrink={true}>
                WeekDay
                  </InputLabel>

              {/* <Select
                    input={<Input id="weekDay" />}
                    value={data && data.key != '' ? data.key : scheduleDetails[0]}
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
                  </Select> */}
              <MultiSelect
                name="filters"
                placeholder="Weekdays"
                value={data.key || [{ label: 'Sunday', value: 6 }]}
                options={Weekdays}
                onChange={(e) => { this.handleWeekDay(e, index) }}
                multi
                style={{ backgroundColor: 'antiquewhite' }}
              />
            </FormControl>

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

            <TextField
              defaultValue={data && data.duration || 60}
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
                data && data.key && data.key != '' ? true : false
              } /*Made it mandatory if week day selected*/
              inputProps={{ min: "0" }}
            />

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



            <ButtonWrapper>
              <FormGhostButton
                alertColor
                onClick={this.removeRow.bind(this, index)}
                label="Delete"
              />
            </ButtonWrapper>
          </FormWrapper>
          );
        })}

        <AddLinkedTime>
          <FormGhostButton
            darkGreyColor
            onClick={this.addNewRow}
            label="Add Linked Class Time"
          />

        </AddLinkedTime>
      </Wrapper>
    );
  }
}
