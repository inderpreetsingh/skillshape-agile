import { get } from 'lodash';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Card from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from 'material-ui/ExpansionPanel';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import styled from 'styled-components';
import newStyles from './styles';
import ClassInterest from '/imports/api/classInterest/fields';
import ClassTimes from '/imports/api/classTimes/fields';
import ClassType from '/imports/api/classType/fields';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import MyCalender from '/imports/ui/components/users/myCalender';
import { Loading } from '/imports/ui/loading';
import { cutString, formStyles, withPopUp } from '/imports/util';

const styles = formStyles();

const inputStyle = {
  minWidth: 150,
  display: 'flex',
};

const expansionPanelStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const inlineDivs = {
  display: 'inline-flex',
  border: '1px solid rgb(221, 221, 221)',
  flexWrap: 'wrap',
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
      type: 'both',
      classTimesData: [],
      myClassTimes: [],
      manageAll: true,
      attendAll: true,
      schollAll: true,
      isLoading: false,
      schoolClassTime: true,
      managedClassTimes: [],
      schoolClassTimes: [],
      filter: {
        classTimesIds: [],
        classTimesIdsForCI: [],
        manageClassTimeIds: [],
        schoolClassTimeId: [],
      },
      copyFilter: {
        classTimesIds: [],
        classTimesIdsForCI: [],
        manageClassTimeIds: [],
        schoolClassTimeId: [],
      },
    };
  }

  handleClassOnChange = (event, type) => {
    const oldFilter = { ...this.state.copyFilter };
    if (type == 'attending') {
      oldFilter.manageClassTimeIds = [];
      oldFilter.schoolClassTimeId = [];
    } else if (type == 'managing') {
      oldFilter.classTimesIdsForCI = [];
      oldFilter.schoolClassTimeId = [];
    } else if (type == 'school') {
      oldFilter.manageClassTimeIds = [];
      oldFilter.classTimesIdsForCI = [];
    } else if (type == 'both') {
      oldFilter.manageClassTimeIds = this.state.copyFilter.manageClassTimeIds;
      oldFilter.schoolClassTimeId = this.state.copyFilter.schoolClassTimeId;
      oldFilter.classTimesIdsForCI = this.state.copyFilter.classTimesIdsForCI;
    }
    this.setState({ filter: oldFilter, type });
  };

  componentDidMount() {
    this.intitializeClassTimeFilterForCalander(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.intitializeClassTimeFilterForCalander(nextProps);
  }

  intitializeClassTimeFilterForCalander = (props) => {
    const {
      classTimesData,
      classInterestData,
      managedClassTimes,
      schoolClassTimes,
      classTypeData,
      managedClassTypeData,
      schoolClassTypesData,
      classTypeForInterests,
    } = props;
    if (!_.isEmpty(classTimesData) || !_.isEmpty(classInterestData)) {
      let {
        classTimesIds,
        classTimesIdsForCI,
        manageClassTimeIds,
        schoolClassTimeId,
      } = this.state.filter;
      this.setState({ isLoading: true });
      const myClassTimes = [];
      const managedClassTime = [];
      const myClassTimesIds = classInterestData.map(data => data.classTimeId);
      const managedClassTimeIds = managedClassTimes.map(data => data._id);
      const schoolClassTimeIds = schoolClassTimes.map(data => data._id);
      const schoolClassTime = [];
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
          if (this.props.params && this.props.params.classTypeId) {
            if (classTimesData[i].classTypeId === this.props.params.classTypeId) {
              schoolClassTime.push({ ...classTimesData[i] });
              // This is pushed to show event on screen for these class times
              schoolClassTimeId.push(classTimesData[i]._id);
            } else {
              classTimesData[i].isCheck = false;
              schoolClassTime.push({ ...classTimesData[i] });
            }
          } else {
            schoolClassTime.push({ ...classTimesData[i] });
            schoolClassTimeId.push(classTimesData[i]._id);
          }
        }
      }
      // Tick check box for class type initially from here
      for (var i = 0; i < managedClassTypeData.length; i++) {
        managedClassTypeData[i].isCheck = true;
      }
      for (var i = 0; i < schoolClassTypesData.length; i++) {
        schoolClassTypesData[i].isCheck = true;
      }
      for (var i = 0; i < classTypeForInterests.length; i++) {
        classTypeForInterests[i].isCheck = true;
      }
      classTimesIds = _.union(classTimesIds, myClassTimesIds);
      this.setState({
        isLoading: false,
        classTimesData,
        myClassTimes,
        managedClassTimes: managedClassTime,
        schoolClassTimes: schoolClassTime,
        classTypeData,
        managedClassTypes: managedClassTypeData,
        schoolClassTypes: schoolClassTypesData,
        classTypeForInterests,
        filter: {
          classTimesIds: _.uniq(classTimesIds),
          classTimesIdsForCI:
            this.state.type != 'school' && this.state.type != 'managing'
              ? _.uniq(classTimesIdsForCI)
              : [],
          manageClassTimeIds:
            this.state.type != 'school' && this.state.type != 'attending'
              ? _.uniq(manageClassTimeIds)
              : [],
          schoolClassTimeId:
            this.state.type != 'managing' && this.state.type != 'attending'
              ? _.uniq(schoolClassTimeId)
              : [],
        },
        copyFilter: {
          classTimesIds: _.uniq(classTimesIds),
          classTimesIdsForCI: _.uniq(classTimesIdsForCI),
          manageClassTimeIds: _.uniq(manageClassTimeIds),
          schoolClassTimeId: _.uniq(schoolClassTimeId),
        },
      });
    }
  };

  handleChangeClassTime = (parentKey, fieldName, childKey, classTimeId, event, isInputChecked) => {
    const data = this.state[fieldName];
    const oldFilter = { ...this.state.filter };
    const ids = oldFilter[childKey] || [];
    const classTimesIds = [...oldFilter.classTimesIds];
    const manageClassTimeIds = [...oldFilter.manageClassTimeIds];
    const schoolClassTimeId = [...oldFilter.schoolClassTimeId];
    let bool = true;
    for (let i = 0; i < data.length; i++) {
      if (data[i]._id === classTimeId) {
        data[i].isCheck = isInputChecked;

        if (isInputChecked) {
          ids.push(classTimeId);
          oldFilter[childKey] = ids;
          if (parentKey === 'attendAll') {
            classTimesIds.push(classTimeId);
            oldFilter.classTimesIds = classTimesIds;
          }
          if (parentKey === 'manageAll') {
            manageClassTimeIds.push(classTimeId);
            oldFilter.manageClassTimeIds = manageClassTimeIds;
          }
          if (parentKey === 'schoolClassTime') {
            schoolClassTimeId.push(classTimeId);
            oldFilter.schoolClassTimeId = schoolClassTimeId;
          }
        } else {
          const index = classTimesIds.indexOf(classTimeId);
          if (index > -1) {
            classTimesIds.splice(index, 1);
          }
          oldFilter.classTimesIds = classTimesIds;

          if (parentKey === 'attendAll') {
            const index = ids.indexOf(classTimeId);
            if (index > -1) {
              ids.splice(index, 1);
            }
            oldFilter[childKey] = ids;
          }
          if (parentKey === 'manageAll') {
            const index = ids.indexOf(classTimeId);
            if (index > -1) {
              ids.splice(index, 1);
            }
            oldFilter[childKey] = ids;
          }
          if (parentKey === 'schoolClassTime') {
            const index = ids.indexOf(classTimeId);
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
      [parentKey]: bool,
    });
  };

  handleChangeClassType = (parentKey, classTypeId, fieldName, childKey, isInputChecked) => {
    const data = this.state[fieldName];
    const oldFilter = { ...this.state.filter };
    const ids = _.uniq(oldFilter[childKey] || []);
    const { classTypeForInterests } = { ...this.state };
    const { managedClassTypes } = { ...this.state };
    const { schoolClassTypes } = { ...this.state };
    // Class time Ids of Class Types:
    const classTimesIds = [...oldFilter.classTimesIds];
    const manageClassTimeIds = [...oldFilter.manageClassTimeIds];
    const schoolClassTimeId = [...oldFilter.schoolClassTimeId];

    for (let i = 0; i < data.length; i++) {
      if (data[i].classTypeId === classTypeId) {
        data[i].isCheck = isInputChecked;
        if (isInputChecked) {
          oldFilter[childKey].push(data[i]._id);
          if (parentKey == 'attendingTimePanel') {
            // Push _ids of ClassTimes records:-
            if (data[i].classTypeId == classTypeId) {
              classTimesIds.push(data[i]._id);
              oldFilter.classTimesIds = classTimesIds;
              data[i].isCheck = isInputChecked;
            }
            // Toggle class type for interests.
            for (let j = 0; j < classTypeForInterests.length; j++) {
              if (classTypeForInterests[j]._id == classTypeId) {
                classTypeForInterests[j].isCheck = isInputChecked;
                // oldFilter.classTimesIds.push(classTypeForInterests[j].classTimeId);
              }
            }
          } else if (parentKey == 'managingTimePanel') {
            if (data[i].classTypeId == classTypeId) {
              data[i].isCheck = isInputChecked;
              manageClassTimeIds.push(data[i]._id);
              oldFilter.manageClassTimeIds = manageClassTimeIds;
            }
            // Toggle class type for interests.
            for (let j = 0; j < managedClassTypes.length; j++) {
              if (managedClassTypes[j]._id == classTypeId) {
                managedClassTypes[j].isCheck = isInputChecked;
              }
            }
          } else if (parentKey == 'schoolTimePanel') {
            // Toggle class type for interests.
            for (let j = 0; j < schoolClassTypes.length; j++) {
              if (schoolClassTypes[j]._id == classTypeId) {
                schoolClassTypes[j].isCheck = isInputChecked;
              }
              if (data[i].classTypeId == classTypeId) {
                data[i].isCheck = isInputChecked;
                schoolClassTimeId.push(data[i]._id);
                oldFilter.schoolClassTimeId = schoolClassTimeId;
              }
            }
          } else if (parentKey == 'classTimePanel') {
          }
        } else if (parentKey == 'attendingTimePanel') {
          if (data[i].classTypeId == classTypeId) {
            data[i].isCheck = isInputChecked;
            const index = ids.indexOf(data[i]._id);
            if (index > -1) {
              ids.splice(index, 1);
            }
            oldFilter[childKey] = ids;
          }
          // Toggle class type for interests.
          for (let j = 0; j < classTypeForInterests.length; j++) {
            if (classTypeForInterests[j]._id == classTypeId) {
              classTypeForInterests[j].isCheck = isInputChecked;
            }
          }
        } else if (parentKey == 'managingTimePanel') {
          // Toggle class type for interests.
          for (let j = 0; j < managedClassTypes.length; j++) {
            if (managedClassTypes[j]._id == classTypeId) {
              managedClassTypes[j].isCheck = isInputChecked;
            }
            if (data[i].classTypeId == classTypeId) {
              data[i].isCheck = isInputChecked;
              const index = ids.indexOf(data[i]._id);
              if (index > -1) {
                ids.splice(index, 1);
              }
              oldFilter[childKey] = ids;
            }
          }
        } else if (parentKey == 'schoolTimePanel') {
          // Toggle class type for interests.
          for (let j = 0; j < schoolClassTypes.length; j++) {
            if (schoolClassTypes[j]._id == classTypeId) {
              schoolClassTypes[j].isCheck = isInputChecked;
            }
            if (data[i].classTypeId == classTypeId) {
              data[i].isCheck = isInputChecked;
              const index = ids.indexOf(data[i]._id);
              if (index > -1) {
                ids.splice(index, 1);
              }
              oldFilter[childKey] = ids;
            }
          }
        }
      }
    }
    oldFilter[childKey] = _.uniq(oldFilter[childKey]);
    this.setState({
      filter: oldFilter,
      classTypeForInterests,
      managedClassTypes,
      schoolClassTypes,
      [fieldName]: data,
    });
  };
  // onChange={this.handleChangeAllClassTime.bind(this, "manageAll", "classTimesData", "classTimesIds")}
  // this, "schoolClassTimes", "myClassTimes", "classTimesIdsForCI"

  handleChangeAllClassType = (parentKey, fieldName, childKey, event, isInputChecked) => {
    // get class interests:
    // loop over class interests.
    // get classTypeId from class interest.
    // myclassTime[classTypeId] = isInputchecked.
    // filter.classTimeIdsForCI.push(myClassTime._id);
    // setState filter
    // parentKey: class interest data/ manageclassTypedata/ schoolclasstypedata.
    const oldFilter = { ...this.state.filter };
    const classTypeData = { ...this.state[fieldName] };
    const classTimeData = { ...this.state[childKey] };
    const classTimeIds = [...oldFilter.classTimesIds];
    let manageClassTimeIds = [...oldFilter.manageClassTimeIds];
    let schoolClassTimeId = [...oldFilter.schoolClassTimeId];

    for (let i = 0; i < classTypeData.length; i++) {
      for (let j = 0; j < classTimeData.length; j++) {
        classTimeData[j].classTypeId = isInputChecked;
        if (isInputChecked) {
          if (parentKey == 'attendingPanel') {
            classTimeIds.push(classTimeData[j]._id);
            oldFilter.classTimesIds = classTimeIds;
          }
        } else if (parentKey == 'attendingPanel') {
          const index = classTimeIds.indexOf(classTimeData[j]._id);
          if (index > -1) {
            classTimeIds.splice(index, 1);
          }
          oldFilter[childKey] = classTimeIds;
        }
      }
    }
    classTimesIds = _.uniq(oldFilter.classTimesIds);
    manageClassTimeIds = _.uniq(oldFilter.manageClassTimeIds);
    schoolClassTimeId = _.uniq(oldFilter.schoolClassTimeId);
    oldFilter.classTimesIds = classTimesIds;
    oldFilter.manageClassTimeIds = manageClassTimeIds;
    oldFilter.schoolClassTimeId = schoolClassTimeId;
    this.setState({
      [parentKey]: isInputChecked,
      [fieldName]: classTypeData,
      filter: oldFilter,
    });
  };

  handleChangeAllClassTime = (parentKey, fieldName, childKey, event, isInputChecked) => {
    const oldFilter = { ...this.state.filter };
    const classTypeData = { ...this.state.fieldName };
    const classTimeData = { ...this.state.childKey };
    const classTimeIds = [...oldFilter.classTimesIds];
    let manageClassTimeIds = [...oldFilter.manageClassTimeIds];
    let schoolClassTimeId = [...oldFilter.schoolClassTimeId];

    for (let i = 0; i < classTypeData.length; i++) {
      for (let j = 0; j < classTimeData.length; j++) {
        classTimeData[j].classTypeId = isInputChecked;
        if (isInputChecked) {
          if (parentKey == 'attendingPanel') {
            classTimeIds.push(classTimeData[j]._id);
            oldFilter.classTimesIds = classTimeIds;
          }
        } else if (parentKey == 'attendingPanel') {
          const index = classTimeIds.indexOf(classTimeData[j]._id);
          if (index > -1) {
            classTimeIds.splice(index, 1);
          }
          oldFilter[childKey] = classTimeIds;
        }
      }
    }
    classTimesIds = _.uniq(oldFilter.classTimesIds);
    manageClassTimeIds = _.uniq(oldFilter.manageClassTimeIds);
    schoolClassTimeId = _.uniq(oldFilter.schoolClassTimeId);
    oldFilter.classTimesIds = classTimesIds;
    oldFilter.manageClassTimeIds = manageClassTimeIds;
    oldFilter.schoolClassTimeId = schoolClassTimeId;
  };

  idmatching = (classTypeId, Time, classTypedata) => {
    let value = classTypedata.map((index) => {
      if (index._id === classTypeId) {
        return index.name;
      }
    });
    value = value.filter(element => element !== undefined);
    return `${value[0]}: ${Time}`;
  };

  //  shouldComponentUpdate(nextProps,nextState){
  //    if(nextState.isLoading || nextProps.containerLoad)
  //      return false
  //      return true;;
  //  }
  render() {
    // const { schoolClassTimes } = this.props;
    const { classes } = this.props;
    const {
      type,
      classTimesData,
      myClassTimes,
      filter,
      managedClassTimes,
      schoolClassTimes,
      classTypeData,
      managedClassTypes,
      schoolClassTypes,
      classTypeForInterests,
      isLoading,
    } = this.state;
    const { containerLoad, route = {} } = this.props;
    if (isLoading || containerLoad) {
      return <Loading />;
    }
    console.count('manageCalendarRenderCount 3');
    return (
      <DocumentTitle title={route.name}>
        <div>
          {/* <Card style={{padding: 10, margin: 15}}> */}
          <Card style={{ padding: 8 }}>
            <FormControl component="fieldset" required>
              <RadioGroup
                aria-label="classTimes"
                value={this.state.type}
                name="classTimes"
                style={{
                  width: '100%',
                  padding: 15,
                  display: 'inline',
                  flexWrap: 'wrap',
                }}
                onChange={this.handleClassOnChange}
                defaultSelected="Select any one"
              >
                {classTypeData && classTypeData.length > 0 && (
                  <FormControlLabel
                    value="both"
                    control={<Radio />}
                    label="Show All"
                    classes={{ label: classes.label }}
                  />
                )}
                {managedClassTimes && managedClassTimes.length > 0 && (
                  <FormControlLabel
                    value="managing"
                    control={<Radio />}
                    label="Class I am Managing"
                    classes={{ label: classes.label }}
                  />
                )}
                {myClassTimes && myClassTimes.length > 0 && (
                  <FormControlLabel
                    value="attending"
                    control={<Radio />}
                    label="Class I am Attending"
                    classes={{ label: classes.label }}
                  />
                )}
                {schoolClassTimes && schoolClassTimes.length > 0 && (
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
            {(type === 'both' || type === 'attending')
              && classTypeForInterests
              && classTypeForInterests.length > 0 && (
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>
                      <div style={styles.formControl}>
                        <div style={{ minWidth: 150, display: 'flex' }}>
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
                            {/* <FormControlLabel
                              control={
                                <Checkbox
                                  checked={this.state.attendAll}
                                  onChange={this.handleChangeAllClassType.bind(
                                    this,
                                    "attendingPanel",
                                    "classTypeForInterests",
                                    "myClassTimes"
                                  )}
                                  value="classTimesIdsForCI"
                                />
                              }
                              classes={{ label: classes.label }}
                              label="All"
                            /> */}
                          </div>
                        </div>
                        {classTypeForInterests.map((classType, index) => (
                          <div key={index} style={styles.formControl}>
                            <div style={inputStyle}>
                              <FormControlLabel
                                control={(
                                  <Checkbox
                                    checked={classType.isCheck}
                                    onChange={this.handleChangeClassType.bind(
                                      this,
                                      'attendingTimePanel',
                                      classType._id,
                                      'myClassTimes',
                                      'classTimesIdsForCI',
                                    )}
                                    value={classType._id}
                                  />
)}
                                label={classType.name}
                                classes={{ label: classes.label }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div
                        style={{
                          ...styles.formControlInline,
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: 10,
                          border: 'solid 1px #ddd',
                        }}
                      >
                        {myClassTimes
                          && myClassTimes.map((classTime, index) => {
                            const result = classTypeData.filter((item) => {
                              if (item._id == classTime.classTypeId) {
                                return item;
                              }
                            });
                            return (
                              <div key={index} style={styles.formControl}>
                                <div style={inputStyle}>
                                  <FormControlLabel
                                    control={(
                                      <Checkbox
                                        checked={classTime.isCheck}
                                        onChange={this.handleChangeClassTime.bind(
                                          this,
                                          'attendAll',
                                          'myClassTimes',
                                          'classTimesIdsForCI',
                                          classTime._id,
                                        )}
                                        value={classTime._id}
                                      />
)}
                                    label={`${result && result[0] && result[0].name}: ${cutString(
                                      classTime.name,
                                      12,
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
            {(type === 'both' || type === 'managing')
              && managedClassTimes
              && managedClassTimes.length > 0 && (
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <div style={styles.formControl}>
                      <div style={inputStyle}>
                        <StrongText>Class I am Managing</StrongText>
                      </div>
                    </div>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails style={expansionPanelStyle}>
                    {}
                    <Fragment>
                      <div style={inlineDivs}>
                        <div style={styles.formControl}>
                          <div style={inputStyle}>
                            {/* <FormControlLabel
                              control={
                                <Checkbox
                                  checked={this.state.manageAll}
                                  onChange={this.handleChangeAllClassTime.bind(
                                    this,
                                    "manageAll",
                                    "myClassTimes",
                                    "classTimesIdsForCI"
                                  )}
                                  value="classTimesIdsForCI"
                                />
                              }
                              classes={{ label: classes.label }}
                              label="All"
                            /> */}
                          </div>
                        </div>

                        {managedClassTypes.map((classType, index) => {
                          const classTime = ClassTimes.findOne({
                            classTypeId: classType._id,
                          });
                          if (classTime) {
                            return (
                              <div key={index} style={styles.formControl}>
                                <div style={inputStyle}>
                                  <FormControlLabel
                                    control={(
                                      <Checkbox
                                        checked={classType.isCheck}
                                        onChange={this.handleChangeClassType.bind(
                                          this,
                                          'managingTimePanel',
                                          classType._id,
                                          'managedClassTimes',
                                          'manageClassTimeIds',
                                        )}
                                        value={classType._id}
                                      />
)}
                                    label={classType.name}
                                    classes={{ label: classes.label }}
                                  />
                                </div>
                              </div>
                            );
                          }
                        })}
                      </div>
                      <ExpansionPanelDetails>
                        <Fragment>
                          <div
                            style={{
                              ...styles.formControlInline,
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: 10,
                              border: 'solid 1px #ddd',
                            }}
                          >
                            {managedClassTimes
                              && managedClassTimes.map((classTime, index) => {
                                const result = classTypeData.filter((item) => {
                                  if (item._id == classTime.classTypeId) {
                                    return item;
                                  }
                                });
                                return (
                                  <div key={index} style={styles.formControl}>
                                    <div style={inputStyle}>
                                      <FormControlLabel
                                        control={(
                                          <Checkbox
                                            checked={classTime.isCheck}
                                            onChange={this.handleChangeClassTime.bind(
                                              this,
                                              'manageAll',
                                              'managedClassTimes',
                                              'manageClassTimeIds',
                                              classTime._id,
                                            )}
                                            value={classTime._id}
                                          />
)}
                                        classes={{ label: classes.label }}
                                        label={this.idmatching(
                                          classTime.classTypeId,
                                          classTime.name,
                                          this.props.classTypeData,
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
                    </Fragment>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
            )}
            {(type === 'both' || type === 'school')
              && schoolClassTimes
              && schoolClassTimes.length > 0 && (
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <div style={styles.formControl}>
                      <div style={{ minWidth: 150, display: 'flex' }}>
                        <StrongText>School Class Times</StrongText>
                      </div>
                    </div>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails style={expansionPanelStyle}>
                    <Fragment>
                      <div style={inlineDivs}>
                        <div style={styles.formControl}>
                          <div style={inputStyle}>
                            {/* <FormControlLabel
                              control={
                                <Checkbox
                                  checked={this.state.schoolAll}
                                  onChange={this.handleChangeAllClassTime.bind(
                                    this,
                                    "schoolAll",
                                    "myClassTimes",
                                    "classTimesIdsForCI"
                                  )}
                                  value="classTimesIdsForCI"
                                />
                              }
                              classes={{ label: classes.label }}
                              label="All"
                            /> */}
                          </div>
                        </div>
                        {this.props.params
                          && !this.props.params.classTypeId
                          && schoolClassTypes
                          && schoolClassTypes.map((classType, index) => {
                            const classTime = ClassTimes.findOne({
                              classTypeId: classType._id,
                            });
                            if (classTime) {
                              return (
                                <div key={index} style={styles.formControl}>
                                  <div style={inputStyle}>
                                    <FormControlLabel
                                      control={(
                                        <Checkbox
                                          checked={classType.isCheck}
                                          onChange={this.handleChangeClassType.bind(
                                            this,
                                            'schoolTimePanel',
                                            classType._id,
                                            'schoolClassTimes',
                                            'schoolClassTimeId',
                                          )}
                                          value={classType._id}
                                        />
)}
                                      label={classType.name}
                                      classes={{ label: classes.label }}
                                    />
                                  </div>
                                </div>
                              );
                            }
                          })}
                      </div>
                    </Fragment>
                  </ExpansionPanelDetails>
                  <ExpansionPanelDetails>
                    <Typography>
                      <Fragment>
                        <div
                          style={{
                            ...styles.formControlInline,
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: 10,
                            border: 'solid 1px #ddd',
                          }}
                        >
                          {schoolClassTimes.map((classTime, index) => {
                            const result = classTypeData.filter((item) => {
                              if (item._id == classTime.classTypeId) {
                                return item;
                              }
                            });
                            return (
                              <div key={index} style={styles.formControl}>
                                <div style={inputStyle}>
                                  <FormControlLabel
                                    control={(
                                      <Checkbox
                                        checked={classTime.isCheck}
                                        onChange={this.handleChangeClassTime.bind(
                                          this,
                                          'schoolClassTime',
                                          'schoolClassTimes',
                                          'schoolClassTimeId',
                                          classTime._id,
                                        )}
                                        value={classTime._id}
                                      />
)}
                                    classes={{ label: classes.label }}
                                    label={`${result && result[0] && result[0].name}: ${cutString(
                                      classTime.name,
                                      12,
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
              routeName={this.props.route.name}
              manageMyCalendar={get(this, 'props.route.name', '') === 'MyCalendar'}
              manageMyCalendarFilter={filter}
              {...this.props}
              type={this.state.type}
            />
          </Card>
        </div>
      </DocumentTitle>
    );
  }
}

export default createContainer((props) => {
  const { currentUser = Meteor.user(), schoolId = null } = props;
  let classInterestSub;
  let classInterestData = [];
  let classTimesData = [];
  let classTypeData = [];
  let managedClassTimes = [];
  let schoolClassTimes = [];
  let schoolClassTypesData = [];
  let managedClassTypeData = [];
  let classTypeForInterests = [];
  let containerLoad = true;
  classInterestSub = Meteor.subscribe('classInterest.getClassInterest');
  if (classInterestSub && classInterestSub.ready()) {
    classInterestData = ClassInterest.find({}).fetch();
    const classInterestClassTypeIds = classInterestData.map(obj => obj.classTypeId);
    const schoolsIManage = get(currentUser, 'profile.schoolId', []);
    const filter = {
      $or: [{ schoolId: { $in: schoolsIManage } }, { _id: { $in: classInterestClassTypeIds } }],
    };
    const classTypesSub = Meteor.subscribe('classType.getClassTypesByFilter', filter);
    const classTimesSub = Meteor.subscribe('classTime.getClassTimesTypeByFilter', filter);
    if (classTypesSub && classTimesSub && classTypesSub.ready() && classTimesSub.ready()) {
      classTypeData = ClassType.find().fetch();
      classTimesData = ClassTimes.find().fetch();
      const mangedClassJson = { schoolId: { $in: schoolsIManage } };
      managedClassTimes = ClassTimes.find(mangedClassJson).fetch();
      managedClassTypeData = ClassType.find(mangedClassJson).fetch();
      schoolClassTimes = ClassTimes.find({ schoolId }).fetch();
      schoolClassTypesData = ClassType.find({ schoolId }).fetch();
      classTypeForInterests = ClassType.find({ _id: { $in: classInterestClassTypeIds } }).fetch();
      containerLoad = false;
    }
  }
  return {
    ...props,
    classTimesData,
    classInterestData,
    managedClassTimes,
    schoolClassTimes,
    classTypeData,
    schoolClassTypesData,
    managedClassTypeData,
    classTypeForInterests,
    containerLoad,
  };
}, withStyles(newStyles)(withPopUp(ManageMyCalendar)));
