import React, { Fragment } from "react";
import styled from "styled-components";
import DocumentTitle from "react-document-title";
import { createContainer } from "meteor/react-meteor-data";

import { formStyles, cutString } from "/imports/util";
import MyCalender from "/imports/ui/components/users/myCalender";
import ClassTimes from "/imports/api/classTimes/fields";
import ClassType from "/imports/api/classType/fields";
import ClassInterest from "/imports/api/classInterest/fields";

import { withStyles } from "material-ui/styles";
import Radio, { RadioGroup } from "material-ui/Radio";
import Card from "material-ui/Card";
import Divider from "material-ui/Divider";
import Checkbox from "material-ui/Checkbox";
import { FormControlLabel, FormControl } from "material-ui/Form";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions
} from "material-ui/ExpansionPanel";
import Typography from "material-ui/Typography";
import PropTypes from "prop-types";
import ExpandMoreIcon from "material-ui-icons/ExpandMore";
import uniqBy from "lodash/uniqBy";

import newStyles from "./styles.js";
const styles = formStyles();

const inputStyle = {
  minWidth: 150,
  display: "flex"
};

const expansionPanelStyle = {
  display: "flex",
  flexDirection: "column"
};

const inlineDivs = {
  display: "inline-flex",
  border: "1px solid rgb(221, 221, 221)"
};
const StrongText = styled.p`
  margin: 0;
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.specialFont};
  font-weight: 500;
  line-height: 1;
`;

class ManageMyCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "both",
      classTimesData: [],
      myClassTimes: [],
      manageAll: true,
      attendAll: true,
      schoolClassTime: true,
      managedClassTimes: [],
      schoolClassTimes: [],
      filter: {
        classTimesIds: [],
        classTimesIdsForCI: [],
        manageClassTimeIds: [],
        schoolClassTimeId: []
      }
    };
  }

  handleClassOnChange = (event, type) => {
    this.setState({ type });
  };
  componentDidMount() {
    this.intitializeClassTimeFilterForCalander(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.intitializeClassTimeFilterForCalander(nextProps);
  }
  intitializeClassTimeFilterForCalander = props => {
    const {
      classTimesData,
      classInterestData,
      managedClassTimes,
      schoolClassTimes,
      classTypeData
    } = props;
    if (!_.isEmpty(classTimesData) || !_.isEmpty(classInterestData)) {
      let {
        classTimesIds,
        classTimesIdsForCI,
        manageClassTimeIds,
        schoolClassTimeId
      } = this.state.filter;
      let myClassTimes = [];
      let managedClassTime = [];
      let myClassTimesIds = classInterestData.map(data => data.classTimeId);
      let managedClassTimeIds = managedClassTimes.map(data => data._id);
      let schoolClassTimeIds = schoolClassTimes.map(data => data._id);
      let schoolClassTime = [];
      for (var i = 0; i < classTimesData.length; i++) {
        classTimesData[i].isCheck = true;
        classTimesIds.push(classTimesData[i]._id);

        if (myClassTimesIds.indexOf(classTimesData[i]._id) > -1) {
          myClassTimes.push({ ...classTimesData[i] });
          classTimesIdsForCI.push(classTimesData[i]._id);
        }
        if (managedClassTimeIds.indexOf(classTimesData[i]._id) > -1) {
          managedClassTime.push({ ...classTimesData[i] });
          manageClassTimeIds.push(classTimesData[i]._id);
        }
        if (schoolClassTimeIds.indexOf(classTimesData[i]._id) > -1) {
          schoolClassTime.push({ ...classTimesData[i] });
          schoolClassTimeId.push(classTimesData[i]._id);
        }
      }
      for (var i = 0; i < classTypeData.length; i++) {
        classTypeData[i].isCheck = true;
      }
      classTimesIds = _.union(classTimesIds, myClassTimesIds);
      this.setState({
        classTimesData,
        myClassTimes,
        managedClassTimes: managedClassTime,
        schoolClassTimes: schoolClassTime,
        classTypeData: classTypeData,
        filter: {
          classTimesIds: _.uniq(classTimesIds),
          classTimesIdsForCI: _.uniq(classTimesIdsForCI),
          manageClassTimeIds: _.uniq(manageClassTimeIds),
          schoolClassTimeId: _.uniq(schoolClassTimeId)
        }
      });
    }
  };
  handleChangeClassTime = (
    parentKey,
    fieldName,
    childKey,
    classTimeId,
    event,
    isInputChecked
  ) => {
    console.log(
      parentKey,
      fieldName,
      childKey,
      classTimeId,
      event,
      isInputChecked
    );
    const data = this.state[fieldName];
    let oldFilter = { ...this.state.filter };
    let ids = oldFilter[childKey] || [];
    let classTimesIds = [...oldFilter.classTimesIds];
    let manageClassTimeIds = [...oldFilter.manageClassTimeIds];
    let schoolClassTimeId = [...oldFilter.schoolClassTimeId];
    console.log("handleChangeClassTime data-->>", data);
    console.log("handleChangeClassTime ids-->>", ids);
    let bool = true;
    for (let i = 0; i < data.length; i++) {
      if (data[i]._id === classTimeId) {
        data[i].isCheck = isInputChecked;

        if (isInputChecked) {
          ids.push(classTimeId);
          oldFilter[childKey] = ids;
          if (parentKey === "attendAll") {
            classTimesIds.push(classTimeId);
            oldFilter.classTimesIds = classTimesIds;
          }
          if (parentKey === "manageAll") {
            manageClassTimeIds.push(classTimeId);
            oldFilter.manageClassTimeIds = manageClassTimeIds;
          }
          if (parentKey === "schoolClassTime") {
            schoolClassTimeId.push(classTimeId);
            oldFilter.schoolClassTimeId = schoolClassTimeId;
          }
        } else {
          let index = classTimesIds.indexOf(classTimeId);
          console.log(
            "handleChangeClassTime classTimesIds-->>",
            index,
            classTimeId
          );
          if (index > -1) {
            classTimesIds.splice(index, 1);
          }
          oldFilter.classTimesIds = classTimesIds;
          console.log("handleChangeClassTime oldFilter-->>", oldFilter);

          if (parentKey === "attendAll") {
            let index = ids.indexOf(classTimeId);
            if (index > -1) {
              ids.splice(index, 1);
            }
            oldFilter[childKey] = ids;
          }
          if (parentKey === "manageAll") {
            let index = ids.indexOf(classTimeId);
            if (index > -1) {
              ids.splice(index, 1);
            }
            oldFilter[childKey] = ids;
          }
          if (parentKey === "schoolClassTime") {
            let index = ids.indexOf(classTimeId);
            if (index > -1) {
              ids.splice(index, 1);
            }
            oldFilter[childKey] = ids;
          }
        }
      }

      if (!data[i].isCheck) {
        bool = false;
      }
    }

    this.setState({
      filter: oldFilter,
      [parentKey]: bool
    });
  };

  handleChangeClassType = (
    classTypeId,
    fieldName,
    childKey,
    event,
    isInputChecked
  ) => {
    console.log(
      "handle class type change",
      classTypeId,
      fieldName,
      childKey,
      event,
      isInputChecked
    );
    console.log("this.state----->", this.state);
    const data = this.state[fieldName];
    console.log("data----->", data);
    console.log("this.state.filter------------>", this.state.filter);
    let oldFilter = { ...this.state.filter };
    for (let i = 0; i < data.length; i++) {
      if (data[i].classTypeId === classTypeId) {
        data[i].isCheck = isInputChecked;
        if (isInputChecked) {
          oldFilter[childKey].push(data[i]._id);
        } else {
          let index = oldFilter[childKey].indexOf(data[i]._id);
          if (index > -1) {
            oldFilter[childKey].splice(index, 1);
          }
        }
      }
    }
    console.log("oldFilter------------>", oldFilter);
    this.setState({
      filter: oldFilter
    });
  };
  // onChange={this.handleChangeAllClassTime.bind(this, "manageAll", "classTimesData", "classTimesIds")}
  // this, "schoolClassTimes", "myClassTimes", "classTimesIdsForCI"
  handleChangeAllClassTime = (
    parentKey,
    fieldName,
    childKey,
    event,
    isInputChecked
  ) => {
    console.log(
      "handleChangeAllClassTime -->>",
      parentKey,
      fieldName,
      childKey,
      event,
      isInputChecked
    );
    // manageAll classTimesData classTimesIds false
    const data = this.state[fieldName];
    console.log("data", data);
    console.log("This.state----------->", this.state);
    let oldFilter = { ...this.state.filter };
    console.log("oldFilter===>", JSON.stringify(oldFilter));
    let classTimesIds = [...oldFilter.classTimesIds];
    let manageClassTimeIds = [...oldFilter.manageClassTimeIds];
    let schoolClassTimeId = [...oldFilter.schoolClassTimeId];
    oldFilter[childKey] = [];
    for (let i = 0; i < data.length; i++) {
      data[i].isCheck = isInputChecked;

      if (isInputChecked) {
        oldFilter[childKey].push(data[i]._id);
        if (parentKey === "attendAll") {
          oldFilter.classTimesIds.push(data[i]._id);
        }
        if (parentKey === "manageAll") {
          oldFilter.manageClassTimeIds.push(data[i]._id);
        }
        if (parentKey === "schoolClassTime") {
          oldFilter.schoolClassTimeId.push(data[i]._id);
        }
      } else {
        if (parentKey === "attendAll") {
          let index = classTimesIds.indexOf(data[i]._id);
          if (index > -1) {
            classTimesIds.splice(index, 1);
            console.log("classTimesIds inside111111====>", classTimesIds);
          }
          oldFilter.classTimesIds = classTimesIds;
        }
        if (parentKey === "manageAll") {
          let index = manageClassTimeIds.indexOf(data[i]._id);
          if (index > -1) {
            manageClassTimeIds.splice(index, 1);
            console.log("classTimesIds inside2222222====>", manageClassTimeIds);
          }
          oldFilter.manageClassTimeIds = manageClassTimeIds;
        }
        if (parentKey === "schoolClassTime") {
          let index = schoolClassTimeId.indexOf(data[i]._id);
          if (index > -1) {
            schoolClassTimeId.splice(index, 1);
            console.log("classTimesIds inside3333333====>", schoolClassTimeId);
          }
          oldFilter.schoolClassTimeId = schoolClassTimeId;
        }
      }
    }
    classTimesIds = _.uniq(oldFilter.classTimesIds);
    manageClassTimeIds = _.uniq(oldFilter.manageClassTimeIds);
    schoolClassTimeId = _.uniq(oldFilter.schoolClassTimeId);
    oldFilter.classTimesIds = classTimesIds;
    oldFilter.manageClassTimeIds = manageClassTimeIds;
    oldFilter.schoolClassTimeId = schoolClassTimeId;
    console.log("oldFilter after-->>", oldFilter);
    this.setState({
      [parentKey]: isInputChecked,
      [fieldName]: data,
      filter: oldFilter
    });
  };

  filterClassTypeDataForMyClassTimes = (classInterestData, classTimesData) => {
    console.log(
      "classInterestData, classTimesData",
      classInterestData,
      classTimesData
    );
    let classTypeForInterests = [];
    classInterestData &&
      classInterestData.forEach((classInterest, index) => {
        classTimesData &&
          classTimesData.forEach(classTime => {
            if (classTime.classTypeId == classInterest.classTypeId) {
              let classTypeData = ClassType.findOne(classTime.classTypeId);
              classTypeForInterests.push(classTypeData);
            }
          });
      });
    classTypeForInterests = _.without(classTypeForInterests, undefined);
    classTypeForInterests = uniqBy(classTypeForInterests, "_id");
    return classTypeForInterests;
  };
  filteredClassTypesForManageClassType = (
    managedClassTimes,
    classTimesData
  ) => {
    console.log(
      "managedClassTimes, classTimesData",
      managedClassTimes,
      classTimesData
    );
    let managedClassTypes = [];
    managedClassTimes &&
      managedClassTimes.forEach((managedClassTime, index) => {
        classTimesData &&
          classTimesData.forEach(classTime => {
            if (classTime.classTypeId == managedClassTime.classTypeId) {
              let classTypeData = ClassType.findOne(classTime.classTypeId);
              managedClassTypes.push(classTypeData);
            }
          });
      });
    managedClassTypes = _.without(managedClassTypes, undefined);
    managedClassTypes = uniqBy(managedClassTypes, "_id");
    return managedClassTypes;
  };

  filteredClassTypesForSchoolClassType = (schoolClassTimes, classTimesData) => {
    console.log(
      "managedClassTimes, classTimesData",
      schoolClassTimes,
      classTimesData
    );
    let schoolClassTypes = [];
    schoolClassTimes &&
      schoolClassTimes.forEach((schoolClassTime, index) => {
        classTimesData &&
          classTimesData.forEach(classTime => {
            schoolClassTimes.forEach((managedClassTime, index) => {
              if (classTime.classTypeId == schoolClassTime.classTypeId) {
                let classTypeData = ClassType.findOne(classTime.classTypeId);
                schoolClassTypes.push(classTypeData);
              }
            });
          });
        schoolClassTypes = _.without(schoolClassTypes, undefined);
        schoolClassTypes = uniqBy(schoolClassTypes, "_id");
        return schoolClassTypes;
      });
  };

  idmatching = (classTypeId, Time, classTypedata) => {
    console.log(
      "classTypeId, Time, classTypedata",
      classTypeId,
      Time,
      classTypedata
    );
    value = classTypedata.map(index => {
      console.log("index._id,classTypeId", index._id, classTypeId);
      console.log(
        "index._id,classTypeId",
        typeof index._id,
        typeof classTypeId
      );
      if (index._id === classTypeId) {
        console.log("inside ", index._id, classTypeId);
        return index.name;
      }
    });
    console.log("value", value);
    value = value.filter(function(element) {
      return element !== undefined;
    });
    return value[0] + ":" + Time;
  };

  render() {
    console.log("ManageMyCalendar props--->>", this.props);
    console.log("ManageMyCalendar state--->>", this.state);
    // const { schoolClassTimes } = this.props;
    const { classes, classInterestData } = this.props;
    const {
      type,
      classTimesData,
      myClassTimes,
      filter,
      managedClassTimes,
      schoolClassTimes,
      classTypeData
    } = this.state;
    console.log("--------------------------------", classTypeData);
    let filteredClassTypesForMyClassTimes = this.filterClassTypeDataForMyClassTimes(
      classInterestData,
      classTimesData
    );
    let filteredClassTypesForManageClassType = this.filteredClassTypesForManageClassType(
      managedClassTimes,
      classTimesData
    );
    let filteredClassTypesForSchoolClassType = this.filteredClassTypesForSchoolClassType(
      schoolClassTimes,
      classTimesData
    );
    console.log(
      "filteredClassTypesForMyClassTimes====",
      filteredClassTypesForMyClassTimes
    );
    return (
      <DocumentTitle title={this.props.route && this.props.route.name}>
        <div>
          {/*<Card style={{padding: 10, margin: 15}}> */}
          <Card style={{ padding: 8 }}>
            <FormControl component="fieldset" required>
              <RadioGroup
                aria-label="classTimes"
                value={this.state.type}
                name="classTimes"
                style={{
                  width: "100%",
                  padding: 15,
                  display: "inline",
                  flexWrap: "wrap"
                }}
                onChange={this.handleClassOnChange}
                defaultSelected="Select any one"
              >
                <FormControlLabel
                  value="both"
                  control={<Radio />}
                  label="Show All"
                  classes={{ label: classes.label }}
                />
                {managedClassTimes &&
                  managedClassTimes.length > 0 && (
                    <FormControlLabel
                      value="managing"
                      control={<Radio />}
                      label="Class I am Managing"
                      classes={{ label: classes.label }}
                    />
                  )}
                {myClassTimes &&
                  myClassTimes.length > 0 && (
                    <FormControlLabel
                      value="attending"
                      control={<Radio />}
                      label="Class I am Attending"
                      classes={{ label: classes.label }}
                    />
                  )}
                {schoolClassTimes &&
                  schoolClassTimes.length > 0 && (
                    <FormControlLabel
                      value="school"
                      control={<Radio />}
                      label="School Class Times"
                      classes={{ label: classes.label }}
                    />
                  )}
              </RadioGroup>
            </FormControl>
            <Divider />
            {(type === "both" || type === "attending") &&
              filteredClassTypesForMyClassTimes &&
              filteredClassTypesForMyClassTimes.length > 0 && (
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>
                      <div style={styles.formControl}>
                        <div style={{ minWidth: 150, display: "flex" }}>
                          <StrongText>Class I am Attending</StrongText>
                        </div>
                      </div>
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails style={expansionPanelStyle}>
                    <Fragment>
                      <div style={inlineDivs}>
                        <div style={styles.formControl}>
                          <div style={inputStyle}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={this.state.attendAll}
                                  onChange={this.handleChangeAllClassTime.bind(
                                    this,
                                    "attendAll",
                                    "myClassTimes",
                                    "classTimesIdsForCI"
                                  )}
                                  value="classTimesIdsForCI"
                                />
                              }
                              classes={{ label: classes.label }}
                              label="All"
                            />
                          </div>
                        </div>
                        {filteredClassTypesForMyClassTimes.map(
                          (classType, index) => {
                            return (
                              <div key={index} style={styles.formControl}>
                                <div style={inputStyle}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={classType.isCheck}
                                        onChange={this.handleChangeClassType.bind(
                                          this,
                                          classType._id,
                                          "myClassTimes",
                                          "classTimesIdsForCI"
                                        )}
                                        value={classType._id}
                                      />
                                    }
                                    label={classType.name}
                                    classes={{ label: classes.label }}
                                  />
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                      <div
                        style={{
                          ...styles.formControlInline,
                          display: "inline-flex",
                          alignItems: "center",
                          padding: 10,
                          border: "solid 1px #ddd"
                        }}
                      >
                        {myClassTimes.map((classTime, index) => {
                          const result = classTypeData.filter(item => {
                            if (item._id == classTime.classTypeId) {
                              return item;
                            }
                          });
                          return (
                            <div key={index} style={styles.formControl}>
                              <div style={inputStyle}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={classTime.isCheck}
                                      onChange={this.handleChangeClassTime.bind(
                                        this,
                                        "attendAll",
                                        "myClassTimes",
                                        "classTimesIdsForCI",
                                        classTime._id
                                      )}
                                      value={classTime._id}
                                    />
                                  }
                                  label={`${result &&
                                    result[0] &&
                                    result[0].name}: ${cutString(
                                    classTime.name,
                                    12
                                  )}`}
                                  classes={{ label: classes.label }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <Divider />
                    </Fragment>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              )}
            {(type === "both" || type === "managing") &&
              managedClassTimes &&
              managedClassTimes.length > 0 && (
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <div style={styles.formControl}>
                      <div style={inputStyle}>
                        <StrongText>Class I am Managing</StrongText>
                      </div>
                    </div>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails style={expansionPanelStyle}>
                    <Fragment>
                      <div style={inlineDivs}>
                        <div style={styles.formControl}>
                          <div style={inputStyle}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={this.state.attendAll}
                                  onChange={this.handleChangeAllClassTime.bind(
                                    this,
                                    "attendAll",
                                    "myClassTimes",
                                    "classTimesIdsForCI"
                                  )}
                                  value="classTimesIdsForCI"
                                />
                              }
                              classes={{ label: classes.label }}
                              label="All"
                            />
                          </div>
                        </div>
                        {filteredClassTypesForManageClassType.map(
                          (classType, index) => {
                            return (
                              <div key={index} style={styles.formControl}>
                                <div style={inputStyle}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={classType.isCheck}
                                        onChange={this.handleChangeClassType.bind(
                                          this,
                                          classType._id,
                                          "myClassTimes",
                                          "classTimesIdsForCI"
                                        )}
                                        value={classType._id}
                                      />
                                    }
                                    label={classType.name}
                                    classes={{ label: classes.label }}
                                  />
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                      <ExpansionPanelDetails>
                        <Fragment>
                          <div
                            style={{
                              ...styles.formControlInline,
                              display: "inline-flex",
                              alignItems: "center",
                              padding: 10,
                              border: "solid 1px #ddd"
                            }}
                          >
                            <div style={styles.formControl}>
                              <div style={inputStyle}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={this.state.manageAll}
                                      onChange={this.handleChangeAllClassTime.bind(
                                        this,
                                        "manageAll",
                                        "managedClassTimes",
                                        "classTimesIds"
                                      )}
                                      value="classTimesIds"
                                    />
                                  }
                                  classes={{ label: classes.label }}
                                  label="All"
                                />
                              </div>
                            </div>
                            {managedClassTimes &&
                              managedClassTimes.map((classTime, index) => {
                                const result = classTypeData.filter(item => {
                                  if (item._id == classTime.classTypeId) {
                                    if (item) return item;
                                  }
                                });
                                return (
                                  <div key={index} style={styles.formControl}>
                                    <div style={inputStyle}>
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={classTime.isCheck}
                                            onChange={this.handleChangeClassTime.bind(
                                              this,
                                              "manageAll",
                                              "managedClassTimes",
                                              "manageClassTimeIds",
                                              classTime._id
                                            )}
                                            value={classTime._id}
                                          />
                                        }
                                        classes={{ label: classes.label }}
                                        label={this.idmatching(
                                          classTime.classTypeId,
                                          classTime.name,
                                          this.props.classTypeData
                                        )}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                          <Divider />
                        </Fragment>
                      </ExpansionPanelDetails>
                      <Divider />
                    </Fragment>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              )}
            {(type === "both" || type === "school") &&
              schoolClassTimes &&
              schoolClassTimes.length > 0 && (
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <div style={styles.formControl}>
                      <div style={{ minWidth: 150, display: "flex" }}>
                        <StrongText>School Class Times</StrongText>
                      </div>
                    </div>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Typography>
                      <Fragment>
                        <div
                          style={{
                            ...styles.formControlInline,
                            display: "inline-flex",
                            alignItems: "center",
                            padding: 10,
                            border: "solid 1px #ddd"
                          }}
                        >
                          <div style={styles.formControl}>
                            <div style={inputStyle}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={this.state.schoolClassTime}
                                    onChange={this.handleChangeAllClassTime.bind(
                                      this,
                                      "schoolClassTime",
                                      "schoolClassTimes",
                                      "schoolClassTimeId"
                                    )}
                                    value="schoolClassTimeId"
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="All"
                              />
                            </div>
                          </div>
                          {schoolClassTimes.map((classTime, index) => {
                            const result = classTypeData.filter(item => {
                              if (item._id == classTime.classTypeId) {
                                return item;
                              }
                            });
                            return (
                              <div key={index} style={styles.formControl}>
                                <div style={inputStyle}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={classTime.isCheck}
                                        onChange={this.handleChangeClassTime.bind(
                                          this,
                                          "schoolClassTime",
                                          "schoolClassTimes",
                                          "schoolClassTimeId",
                                          classTime._id
                                        )}
                                        value={classTime._id}
                                      />
                                    }
                                    classes={{ label: classes.label }}
                                    label={`${result &&
                                      result[0] &&
                                      result[0].name}: ${cutString(
                                      classTime.name,
                                      12
                                    )}`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </Fragment>
                    </Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              )}
            <MyCalender
              manageMyCalendar={
                this.props.route && this.props.route.name == "MyCalendar"
              }
              manageMyCalendarFilter={filter}
              {...this.props}
            />
          </Card>
        </div>
      </DocumentTitle>
    );
  }
}

export default createContainer(props => {
  console.log("props in manageMyCalendar", this);
  const classTimesData = ClassTimes.find({}).fetch();
  console.log("classTimesData===>", classTimesData);
  let classTypeIds = classTimesData.map(item => item.classTypeId);
  console.log("classTypeIds-------------------", classTypeIds);
  Meteor.subscribe("classTime.getclassType", {
    classTypeIds
  });
  let classTypeData = ClassType.find({ _id: { $in: classTypeIds } }).fetch();
  console.log("classTypeData------------>", classTypeData);

  let managedClassTimes = [];
  // Class Times that are managed by current user.
  if (props.currentUser) {
    let currentUser = props.currentUser;
    let adminUserSchoolIds =
      currentUser && currentUser.profile && currentUser.profile.schoolId;
    if (adminUserSchoolIds) {
      let mangedClassJson = { schoolId: { $in: adminUserSchoolIds } };
      managedClassTimes = ClassTimes.find(mangedClassJson).fetch();
    }
  }
  // Class Times of current School.
  let schoolClassTimes = [];
  if (props.schoolId) {
    schoolClassTimes = ClassTimes.find({ schoolId: props.schoolId }).fetch();
  }
  const classInterestData = ClassInterest.find({}).fetch();
  console.log("managedClassTimes", managedClassTimes);

  return {
    ...props,
    classTimesData,
    classInterestData,
    managedClassTimes,
    schoolClassTimes,
    classTypeData
  };
}, withStyles(newStyles)(ManageMyCalendar));
