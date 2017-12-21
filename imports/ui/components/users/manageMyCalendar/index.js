import React, {Fragment} from 'react';
import { formStyles } from '/imports/util';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import MyCalender from '/imports/ui/components/users/myCalender';
import { Card, CardHeader, CardTitle, CardText } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import ClassTimes from '/imports/api/classTimes/fields';
import ClassInterest from '/imports/api/classInterest/fields';
import Checkbox from 'material-ui/Checkbox';

const styles = formStyles();

export default class ManageMyCalendar extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
            type: "both",
            classTimesData: [],
            myClassTimes: [],
        };
    }

    handleClassOnChange = (event, type) => {
        console.log("handleClassOnChange -->>",type)
        this.setState({type})
    }

    createClassTimeOption = () => {
        console.log("<< --- createClassTimeOption -->")
        let myClassTimes = []
        let classTimesData = ClassTimes.find({}).fetch()
        let classInterestData = ClassInterest.find({}).fetch();
        let myClassTimesIds = classInterestData.map(data => data.classTimeId);
        for (var i = 0; i < classTimesData.length; i++) {
            if (myClassTimesIds.indexOf(classTimesData[i]._id) > -1) {
                myClassTimes.push(classTimesData[i])
            }
        }
        console.log("<< --- createClassTimeOption myClassTimes-->", myClassTimes)
        this.setState({
            classTimesData,
            myClassTimes,
        })
    }

    handleChangeClassTimeSelect = (event, isInputChecked) => {
        console.log("handleChangeClassTimeSelect -->>",isInputChecked)
        alert("Implementation pending!!!!!!")
    }

    render() {
        
        const { type, classTimesData, myClassTimes } = this.state;

        return  (
            <div>
                <Card style={{padding: 10, margin: 15}}>
                    <div style={{...styles.formControlInline, padding: 10}}>
                        <div style={styles.formControlInput}>
                            <RadioButtonGroup 
                                name="classTimes"
                                style={{width: '100%', color: "blue", display: 'flex'}} 
                                onChange={this.handleClassOnChange} 
                                defaultSelected="both"
                            >
                                <RadioButton
                                    value="both"
                                    label="Both"
                                    style={{width: '15%'}}
                                />
                                <RadioButton
                                    value="managing"
                                    label="Class I am Managing"
                                    style={{width: '25%'}}
                                />
                                <RadioButton
                                    value="attending"
                                    label="Class I am Attending"
                                    style={{width: '30%'}}
                                />
                            </RadioButtonGroup>
                        </div>
                    </div>
                    <Divider/>
                    {
                        (type === "both" || type === "managing") && (
                            <Fragment>
                                <div style={{...styles.formControlInline, padding: 10}}>
                                    <div style={styles.formControl}>
                                        <div >
                                            <strong>Class I am Managing</strong>
                                        </div>
                                    </div>
                                    {
                                        classTimesData.map((classTime, index) => {
                                            return (
                                                <div key={index} style={styles.formControl}>
                                                    <div >
                                                        <Checkbox
                                                            label={classTime.name}
                                                            onCheck={this.handleChangeClassTimeSelect}
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
                                <div style={{...styles.formControlInline, padding: 10}}>
                                    <div style={styles.formControl}>
                                        <div >
                                            <strong>Class I am Attending</strong>
                                        </div>
                                    </div>
                                    {
                                        myClassTimes.map((classTime, index) => {
                                            return (
                                                <div key={index} style={styles.formControl}>
                                                    <div >
                                                        <Checkbox
                                                            label={classTime.name}
                                                            onCheck={this.handleChangeClassTimeSelect}
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
                </Card>
                <MyCalender
                    manageMyCalendar={true}
                    createClassTimeOption={this.createClassTimeOption} 
                    {...this.props}
                />
            </div>
        )
   }
}
