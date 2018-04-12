import React, {Fragment} from 'react';
import styled from 'styled-components';
import DocumentTitle from 'react-document-title';
import { createContainer } from 'meteor/react-meteor-data';

import { formStyles, cutString } from '/imports/util';
import MyCalender from '/imports/ui/components/users/myCalender';
import ClassTimes from '/imports/api/classTimes/fields';
import ClassInterest from '/imports/api/classInterest/fields';

import { withStyles } from 'material-ui/styles';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Card  from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import { FormControlLabel, FormControl } from 'material-ui/Form';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

import newStyles from './styles.js';
const styles = formStyles();

const inputStyle = {
    minWidth: 150,
    display: 'flex',
}

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
            managedClassTimes:[],
            schoolClassTimes:[],
            filter: {
                classTimesIds: [],
                classTimesIdsForCI: [],
                manageClassTimeIds:[],
                schoolClassTimeId:[]
            },
        };
    }

    handleClassOnChange = (event, type) => {
        this.setState({type});
    }
    componentDidMount() {
        this.intitializeClassTimeFilterForCalander(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.intitializeClassTimeFilterForCalander(nextProps);
    }
    intitializeClassTimeFilterForCalander = (props) => {
        const { classTimesData, classInterestData, managedClassTimes, schoolClassTimes} = props;
        if(!_.isEmpty(classTimesData) || !_.isEmpty(classInterestData)) {
            let { classTimesIds, classTimesIdsForCI, manageClassTimeIds, schoolClassTimeId } = this.state.filter;
            let myClassTimes = [];
            let managedClassTime = [];
            let myClassTimesIds = classInterestData.map(data => data.classTimeId);
            let managedClassTimeIds = managedClassTimes.map(data => data._id);
            let schoolClassTimeIds = schoolClassTimes.map(data => data._id);
            let schoolClassTime =[];
            for (var i = 0; i < classTimesData.length; i++) {

                classTimesData[i].isCheck = true;
                classTimesIds.push(classTimesData[i]._id);

                if (myClassTimesIds.indexOf(classTimesData[i]._id) > -1) {
                    myClassTimes.push({...classTimesData[i]});
                    classTimesIdsForCI.push(classTimesData[i]._id);
                }
                if(managedClassTimeIds.indexOf(classTimesData[i]._id) > -1) {
                    managedClassTime.push({...classTimesData[i]})
                    manageClassTimeIds.push(classTimesData[i]._id);
                }
                if(schoolClassTimeIds.indexOf(classTimesData[i]._id) > -1) {
                    schoolClassTime.push({...classTimesData[i]})
                    schoolClassTimeId.push(classTimesData[i]._id);
                }
            }
            classTimesIds = _.union(classTimesIds,myClassTimesIds);
            this.setState({
                classTimesData,
                myClassTimes,
                managedClassTimes: managedClassTime,
                schoolClassTimes: schoolClassTime,
                filter: {
                    classTimesIds,
                    classTimesIdsForCI,
                    manageClassTimeIds,
                    schoolClassTimeId
                }
            })
        }
    }
    handleChangeClassTime = (parentKey, fieldName, childKey, classTimeId, event, isInputChecked) => {
        const data = this.state[fieldName];
        let oldFilter = {...this.state.filter}
        let ids = oldFilter[childKey] || [];
        let classTimesIds = [...oldFilter.classTimesIds];
        let manageClassTimeIds = [...oldFilter.manageClassTimeIds];
        let schoolClassTimeId = [...oldFilter.schoolClassTimeId];
        console.log("handleChangeClassTime data-->>",data);
        console.log("handleChangeClassTime ids-->>",ids);
        let bool = true
        for (let i = 0; i < data.length; i++) {

            if(data[i]._id === classTimeId) {
                data[i].isCheck = isInputChecked

                if(isInputChecked) {
                    ids.push(classTimeId);
                    oldFilter[childKey] = ids;
                    if(parentKey === "attendAll") {
                        classTimesIds.push(classTimeId)
                        oldFilter.classTimesIds = classTimesIds;
                    }
                    if(parentKey === "manageAll") {
                        manageClassTimeIds.push(classTimeId)
                        oldFilter.manageClassTimeIds = manageClassTimeIds;
                    }
                    if(parentKey === "schoolClassTime") {
                        schoolClassTimeId.push(classTimeId)
                        oldFilter.schoolClassTimeId = schoolClassTimeId;
                    }

                } else {

                    let index = classTimesIds.indexOf(classTimeId);
                    console.log("handleChangeClassTime classTimesIds-->>",index,classTimeId);
                    if(index > -1) {
                        classTimesIds.splice(index, 1);
                    }
                    oldFilter.classTimesIds = classTimesIds;
                    console.log("handleChangeClassTime oldFilter-->>",oldFilter);

                    if(parentKey === "attendAll") {
                        let index = ids.indexOf(classTimeId);
                        if(index > -1) {
                            ids.splice(index, 1);
                        }
                        oldFilter[childKey] = ids
                    }
                    if(parentKey === "manageAll") {
                        let index = ids.indexOf(classTimeId);
                        if(index > -1) {
                            ids.splice(index, 1);
                        }
                        oldFilter[childKey] = ids
                    }
                    if(parentKey === "schoolClassTime") {
                        let index = ids.indexOf(classTimeId);
                        if(index > -1) {
                            ids.splice(index, 1);
                        }
                        oldFilter[childKey] = ids
                    }
                }
            }

            if(!data[i].isCheck) {
                bool = false;
            }
        }

        this.setState({
            filter: oldFilter,
            [parentKey]: bool,
        })
    }
    // onChange={this.handleChangeAllClassTime.bind(this, "manageAll", "classTimesData", "classTimesIds")}
    // this, "schoolClassTimes", "myClassTimes", "classTimesIdsForCI"
    handleChangeAllClassTime = (parentKey, fieldName, childKey,event, isInputChecked) => {
        console.log("handleChangeAllClassTime -->>",parentKey, fieldName, childKey,event, isInputChecked)
        // manageAll classTimesData classTimesIds false
        const data = this.state[fieldName]
        console.log("data",data);
        let oldFilter = {...this.state.filter};
        console.log("oldFilter===>",oldFilter);
        let classTimesIds = [...oldFilter.classTimesIds];
        let manageClassTimeIds = [...oldFilter.manageClassTimeIds];
        let schoolClassTimeId = [...oldFilter.schoolClassTimeId];
        oldFilter[childKey] = [];
        for (let i = 0; i < data.length; i++) {
            data[i].isCheck = isInputChecked;

            if(isInputChecked) {

                oldFilter[childKey].push(data[i]._id)
                if(parentKey === "attendAll") {
                    oldFilter.classTimesIds.push(data[i]._id);
                }
                if(parentKey === "manageAll") {
                    oldFilter.manageClassTimeIds.push(data[i]._id);
                }
                if(parentKey === "schoolClassTime") {
                    oldFilter.schoolClassTimeId.push(data[i]._id);
                }

            } else {

                if(parentKey === "attendAll") {
                    let index = classTimesIds.indexOf(data[i]._id);
                    if(index > -1) {
                        classTimesIds.splice(index, 1);
                    }
                    oldFilter.classTimesIds = classTimesIds;
                }
                if(parentKey === "manageAll") {
                    let index = manageClassTimeIds.indexOf(data[i]._id);
                    if(index > -1) {
                        manageClassTimeIds.splice(index, 1);
                    }
                    oldFilter.manageClassTimeIds = manageClassTimeIds;
                }
                if(parentKey === "schoolClassTime") {
                    let index = schoolClassTimeId.indexOf(data[i]._id);
                    if(index > -1) {
                        schoolClassTimeId.splice(index, 1);
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
        // console.log("oldFilter -->>",oldFilter)
        this.setState({
            [parentKey]: isInputChecked,
            [fieldName]: data,
            filter: oldFilter,
        })
    }

    render() {
        console.log("ManageMyCalendar props--->>",this.props);
        console.log("ManageMyCalendar state--->>",this.state);
        // const { schoolClassTimes } = this.props;
        const { classes } = this.props;
        const { type, classTimesData, myClassTimes, filter, managedClassTimes, schoolClassTimes } = this.state;

        return  (
            <DocumentTitle title={this.props.route.name}>
            <div>
                {/*<Card style={{padding: 10, margin: 15}}> */}
                <Card style={{padding: 8}}>
                    <FormControl component="fieldset" required >
                      <RadioGroup
                          aria-label="classTimes"
                          value={this.state.type}
                          name="classTimes"
                          style={{width: '100%', padding: 15, display: 'inline', flexWrap: 'wrap'}}
                          onChange={this.handleClassOnChange}
                          defaultSelected="Select any one"
                      >
                       <FormControlLabel  value="both" control={<Radio />} label="Show All" classes={{label: classes.label}}/>
                       {(managedClassTimes && managedClassTimes.length > 0) &&
                          <FormControlLabel  value="managing" control={<Radio />} label="Class I am Managing" classes={{label: classes.label}}/>
                       }
                       {(myClassTimes && myClassTimes.length > 0) &&
                          <FormControlLabel  value="attending" control={<Radio />} label="Class I am Attending" classes={{label: classes.label}}/>
                       }
                       { (schoolClassTimes && schoolClassTimes.length > 0 ) &&
                          <FormControlLabel  value="school" control={<Radio />} label="School Class Times" classes={{label: classes.label}}/>
                       }
                      </RadioGroup>
                    </FormControl>
                    <Divider/>
                    {
                        ( (type === "both" || type === "managing") && managedClassTimes && managedClassTimes.length > 0) && (
                            <Fragment>
                                <div style={{...styles.formControlInline, display: 'inline-flex', alignItems: 'center', padding: 10}}>
                                    <div style={styles.formControl}>
                                        <div style={inputStyle}>
                                            <StrongText>Class I am Managing</StrongText>
                                        </div>
                                    </div>
                                    <div style={styles.formControl}>
                                        <div style={inputStyle}>
                                            <FormControlLabel
                                              control={
                                                <Checkbox
                                                  checked={this.state.manageAll}
                                                  onChange={this.handleChangeAllClassTime.bind(this, "manageAll", "managedClassTimes", "classTimesIds")}
                                                  value="classTimesIds"
                                                />
                                              }
                                              classes={{label: classes.label}}
                                              label="All"
                                            />

                                        </div>
                                    </div>
                                    {
                                        managedClassTimes && managedClassTimes.map((classTime, index) => {
                                            console.log("classTime",classTime)
                                            return (
                                                <div key={index} style={styles.formControl}>
                                                    <div style={inputStyle}>
                                                        <FormControlLabel
                                                          control={
                                                            <Checkbox
                                                              checked={classTime.isCheck}
                                                              onChange={this.handleChangeClassTime.bind(this, "manageAll", "managedClassTimes", "manageClassTimeIds", classTime._id)}
                                                              value={classTime._id}
                                                            />
                                                          }
                                                          classes={{label: classes.label}}
                                                          label={cutString(classTime.name, 12)}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <Divider/>
                            </Fragment>
                        )
                    }
                    {
                        ((type === "both" || type === "attending") && myClassTimes && myClassTimes.length > 0 ) && (
                            <Fragment>
                                <div style={{...styles.formControlInline,display: 'inline-flex', alignItems: 'center', padding: 10}}>
                                    <div style={styles.formControl}>
                                        <div style={{minWidth: 150, display: 'flex'}}>
                                            <StrongText>Class I am Attending</StrongText>
                                        </div>
                                    </div>
                                    <div style={styles.formControl}>
                                        <div style={inputStyle}>
                                            <FormControlLabel
                                              control={
                                                <Checkbox
                                                  checked={this.state.attendAll}
                                                  onChange={this.handleChangeAllClassTime.bind(this, "attendAll", "myClassTimes", "classTimesIdsForCI")}
                                                  value="classTimesIdsForCI"
                                                />
                                              }
                                              classes={{label: classes.label}}
                                              label="All"
                                            />
                                        </div>
                                    </div>
                                    {
                                        myClassTimes.map((classTime, index) => {
                                            return (
                                                <div key={index} style={styles.formControl}>
                                                    <div style={inputStyle}>
                                                        <FormControlLabel
                                                          control={
                                                            <Checkbox
                                                              checked={classTime.isCheck}
                                                              onChange={this.handleChangeClassTime.bind(this, "attendAll", "myClassTimes", "classTimesIdsForCI", classTime._id)}
                                                              value={classTime._id}
                                                            />
                                                          }
                                                          classes={{label: classes.label}}
                                                          label={cutString(classTime.name, 12)}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <Divider/>
                            </Fragment>
                        )
                    }
                    {
                        ( (type === "both" || type === "school") && schoolClassTimes && schoolClassTimes.length > 0) && (
                            <Fragment>
                                <div style={{...styles.formControlInline,display: 'inline-flex', alignItems: 'center', padding: 10}}>
                                    <div style={styles.formControl}>
                                        <div style={{minWidth: 150, display: 'flex'}}>
                                            <StrongText>School Class Times</StrongText>
                                        </div>
                                    </div>
                                    <div style={styles.formControl}>
                                        <div style={inputStyle}>
                                            <FormControlLabel
                                              control={
                                                <Checkbox
                                                  checked={this.state.schoolClassTime}
                                                  onChange={this.handleChangeAllClassTime.bind(this, "schoolClassTime", "schoolClassTimes", "schoolClassTimeId")}
                                                  value="schoolClassTimeId"
                                                />
                                              }
                                              classes={{label: classes.label}}
                                              label="All"
                                            />
                                        </div>
                                    </div>
                                    {
                                        schoolClassTimes.map((classTime, index) => {
                                            return (
                                                <div key={index} style={styles.formControl}>
                                                    <div style={inputStyle}>
                                                        <FormControlLabel
                                                          control={
                                                            <Checkbox
                                                              checked={classTime.isCheck}
                                                              onChange={this.handleChangeClassTime.bind(this, "schoolClassTime", "schoolClassTimes", "schoolClassTimeId", classTime._id)}
                                                              value={classTime._id}
                                                            />
                                                          }
                                                          classes={{label: classes.label}}
                                                          label={cutString(classTime.name, 12)}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </Fragment>
                        )
                    }
                    <MyCalender
                        manageMyCalendar={ this.props.route.name == "MyCalendar" }
                        manageMyCalendarFilter={filter}
                        {...this.props}
                    />
                </Card>
            </div>
            </DocumentTitle>
        )
   }
}

export default createContainer(props => {

    console.log("props in manageMyCalendar",props)
    const classTimesData = ClassTimes.find({}).fetch();
    console.log("classTimesData===>", classTimesData)
    let managedClassTimes = [];
    // Class Times that are managed by current user.
    if(props.currentUser) {
        let currentUser = props.currentUser;
        let adminUserSchoolIds = currentUser && currentUser.profile &&  currentUser.profile.schoolId
        if( adminUserSchoolIds ) {
           let mangedClassJson =  { schoolId : {$in : adminUserSchoolIds} };
           managedClassTimes = ClassTimes.find(mangedClassJson).fetch();
        }
    }
    // Class Times of current School.
    let schoolClassTimes = [];
    if(props.schoolId) {
        schoolClassTimes = ClassTimes.find({ schoolId:props.schoolId }).fetch();
    }
    const classInterestData = ClassInterest.find({}).fetch();
    console.log("managedClassTimes", managedClassTimes)
    return {
        ...props,
        classTimesData,
        classInterestData,
        managedClassTimes,
        schoolClassTimes
    };

}, withStyles(newStyles)(ManageMyCalendar));
