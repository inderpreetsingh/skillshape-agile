import React, {Fragment} from 'react';
import DocumentTitle from 'react-document-title';
import { createContainer } from 'meteor/react-meteor-data';
import { formStyles, cutString } from '/imports/util';
import MyCalender from '/imports/ui/components/users/myCalender';
import ClassTimes from '/imports/api/classTimes/fields';
import ClassInterest from '/imports/api/classInterest/fields';

import Radio, { RadioGroup } from 'material-ui/Radio';
import Card  from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import { FormControlLabel, FormControl } from 'material-ui/Form';
const styles = formStyles();

const inputStyle = {
    minWidth: 150,
    display: 'flex',
}

class ManageMyCalendar extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
            type: "both",
            classTimesData: [],
            myClassTimes: [],
            manageAll: true,
            attendAll: true,
            filter: {
                classTimesIds: [],
                classTimesIdsForCI: [],
            },
        };
    }

    handleClassOnChange = (event, type) => this.setState({type})

    componentWillReceiveProps(nextProps) {
        console.log("ManageMyCalendar componentWillReceiveProps called",nextProps)
        const { classTimesData, classInterestData} = nextProps;
        if(!_.isEmpty(classTimesData) || !_.isEmpty(classInterestData)) {
            let { classTimesIds, classTimesIdsForCI } = this.state.filter;
            let myClassTimes = []
            let myClassTimesIds = classInterestData.map(data => data.classTimeId);
            for (var i = 0; i < classTimesData.length; i++) {

                classTimesData[i].isCheck = true;
                classTimesIds.push(classTimesData[i]._id);

                if (myClassTimesIds.indexOf(classTimesData[i]._id) > -1) {
                    myClassTimes.push({...classTimesData[i]});
                    classTimesIdsForCI.push(classTimesData[i]._id);
                }
            }
            classTimesIds = _.union(classTimesIds,myClassTimesIds)
            this.setState({
                classTimesData,
                myClassTimes,
                filter: {
                    classTimesIds,
                    classTimesIdsForCI,
                }
            })
        }
    }

    handleChangeClassTime = (parentKey, fieldName, childKey, classTimeId, event, isInputChecked) => {
        const data = this.state[fieldName];
        let oldFilter = {...this.state.filter}
        let ids = oldFilter[childKey] || [];
        let classTimesIds = [...oldFilter.classTimesIds];
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

    handleChangeAllClassTime = (parentKey, fieldName, childKey,event, isInputChecked) => {
        // console.log("handleChangeAllClassTime -->>",parentKey,fieldName, childKey, isInputChecked)
        const data = this.state[fieldName]
        let oldFilter = {...this.state.filter}
        let classTimesIds = [...oldFilter.classTimesIds];
        oldFilter[childKey] = [];
        for (let i = 0; i < data.length; i++) {
            data[i].isCheck = isInputChecked;

            if(isInputChecked) {

                oldFilter[childKey].push(data[i]._id)
                if(parentKey === "attendAll") {
                    oldFilter.classTimesIds.push(data[i]._id)
                }

            } else {

                if(parentKey === "attendAll") {
                    let index = classTimesIds.indexOf(data[i]._id);
                    if(index > -1) {
                        classTimesIds.splice(index, 1);
                    }
                    oldFilter.classTimesIds = classTimesIds;
                }

            }
        }
        // console.log("oldFilter -->>",oldFilter)
        this.setState({
            [parentKey]: isInputChecked,
            [fieldName]: data,
            filter: oldFilter,
        })
    }

    render() {
        console.log("ManageMyCalendar state--->>",this.state);
        const { type, classTimesData, myClassTimes, filter } = this.state;

        return  (
            <DocumentTitle title={this.props.route.name}>
            <div>
                <Card style={{padding: 10, margin: 15}}>
                     <FormControl component="fieldset" required >
                    <RadioGroup
                        aria-label="classTimes"
                        value={this.state.type}
                        name="classTimes"
                        style={{width: '100%', padding: 15, display: 'inline', flexWrap: 'wrap'}}
                        onChange={this.handleClassOnChange}
                        defaultSelected="both"
                    >
                     <FormControlLabel  value="both" control={<Radio />} label="Both" />
                     <FormControlLabel  value="managing" control={<Radio />} label="Class I am Managing" />
                     <FormControlLabel  value="attending" control={<Radio />} label="Class I am Attending" />
                    </RadioGroup>
                    </FormControl>
                    <Divider/>
                    {
                        (type === "both" || type === "managing") && (
                            <Fragment>
                                <div style={{...styles.formControlInline, display: 'inline-flex', alignItems: 'center', padding: 10}}>
                                    <div style={styles.formControl}>
                                        <div style={inputStyle}>
                                            <strong>Class I am Managing</strong>
                                        </div>
                                    </div>
                                    <div style={styles.formControl}>
                                        <div style={inputStyle}>
                                            <FormControlLabel
                                              control={
                                                <Checkbox
                                                  checked={this.state.manageAll}
                                                  onChange={this.handleChangeAllClassTime.bind(this, "manageAll", "classTimesData", "classTimesIds")}
                                                  value="classTimesIds"
                                                />
                                              }
                                              label="All"
                                            />

                                        </div>
                                    </div>
                                    {
                                        classTimesData.map((classTime, index) => {
                                            return (
                                                <div key={index} style={styles.formControl}>
                                                    <div style={inputStyle}>
                                                        <FormControlLabel
                                                          control={
                                                            <Checkbox
                                                              checked={classTime.isCheck}
                                                              onChange={this.handleChangeClassTime.bind(this, "manageAll", "classTimesData", "classTimesIds", classTime._id)}
                                                              value={classTime._id}
                                                            />
                                                          }
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
                        (type === "both" || type === "attending") && (
                            <Fragment>
                                <div style={{...styles.formControlInline,display: 'inline-flex', alignItems: 'center', padding: 10}}>
                                    <div style={styles.formControl}>
                                        <div style={{minWidth: 150, display: 'flex'}}>
                                            <strong>Class I am Attending</strong>
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
                        manageMyCalendar={true}
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

    const classTimesData = ClassTimes.find({}).fetch();
    const classInterestData = ClassInterest.find({}).fetch();
    return {
        ...props,
        classTimesData,
        classInterestData
    };

}, ManageMyCalendar);