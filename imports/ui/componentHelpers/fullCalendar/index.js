import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import FullCalendarRender from './fullCalendarRender';
import ClassTimes from '/imports/api/classTimes/fields';
import ClassInterest from '/imports/api/classInterest/fields';
import moment from 'moment';

class FullCalendar extends React.Component {

    constructor(props) {
        super(props);
        this.options = {
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay,listWeek'
            },
            defaultDate: new Date(),
            selectable: true,
            selectHelper: true,
            navLinks: false, // can click day/week names to navigate views
            editable: false,
            eventLimit: true, // allow "more" link when too many events
            /*eventSources :[sevents],*/
            eventSources: (start, end, timezone, callback) => {
                let startDate = new Date(start)
                // console.log("eventSources old startDate-->>",this.props.startDate)
                // console.log("eventSources new startDate-->>",startDate)
                if (!this.props.startDate && startDate) {
                    this.props.setDate(startDate)
                }
                if (this.props.startDate && startDate && (this.props.startDate.valueOf() !== startDate.valueOf())) {
                    // console.log("eventSources startDate changed-->>")
                    this.props.setDate(startDate)
                }
                let sevents = this.buildCalander() || []
                // console.log("sevents -->>",sevents);
                callback(sevents);
            },
            dayRender: function(date, cell) {},
            eventRender: function(event, element, view){
                // console.log("event -->>",event);
                switch(event.scheduleType) {
                    case "oneTime": {
                        return true
                    }
                    case "recurring": {
                        if((moment(event.start).format("YYYY-MM-DD") >= moment(event.startDate).format("YYYY-MM-DD")) && (moment(event.start).format("YYYY-MM-DD") <= moment(event.endDate).format("YYYY-MM-DD"))) 
                            return true;
                        return false;
                    }
                    case "onGoing": {
                        if(moment(event.start).format("YYYY-MM-DD") >= moment(event.startDate).format("YYYY-MM-DD")) 
                            return true;
                        return false;
                    }
                }
              
            },
            eventClick: (event) => {
                // console.log("eventClick -->>",event)
                if (event.classId && event.classTypeId) {
                    this.props.showEventModal(true, event)
                }
            }
        }
    }

    buildCalander = () => {
        console.log("buildCalander props -->>",this.props);
        let { classTimesData, classInterestData } = this.props;
        let sevents = [];
        let myClassTimesIds = classInterestData.map(data => data.classTimeId);
        for (var i = 0; i < classTimesData.length; i++) {
            let classTime = classTimesData[i];

            try {
             
                let sevent = {
                    classTypeId: classTime.classTypeId,
                    locationId: classTime.locationId,
                    classTimeId: classTime._id,
                    startDate: moment(classTime.startDate),
                    scheduleType: classTime.scheduleType,
                };
                if (myClassTimesIds.indexOf(classTime._id) > -1) {
                    sevent.className = "event-green";
                    sevent.attending = true;
                } else {
                    sevent.className = "event-azure";
                    sevent.attending = false;
                } 
                if (classTime.scheduleType === "oneTime") {
                    sevent.roomId = classTime.roomId;
                    sevent.eventStartTime = moment(classTime.startTime).format("hh:mm");
                    sevent.eventEndTime = moment(new Date(classTime.startTime)).add(classTime.duration, "minutes").format("hh:mm");
                    sevent.title = classTime.name + " " + sevent.eventStartTime + " to " + sevent.eventEndTime;
                    sevents.push(sevent)
                }

                if((classTime.scheduleType === "recurring" || classTime.scheduleType === "onGoing") && classTime.scheduleDetails) {
                    let scheduleData = {...classTime.scheduleDetails};
                    sevent.endDate = classTime.endDate && moment(classTime.endDate)
                    for (let key in scheduleData) {
                        let temp = {...sevent};
                        temp.dow = [scheduleData[key].day];
                        temp.eventStartTime = moment(scheduleData[key].startTime).format("hh:mm");
                        temp.eventEndTime = moment(new Date(scheduleData[key].startTime)).add(scheduleData[key].duration, "minutes").format("hh:mm");
                        temp.title = classTime.name + " " + temp.eventStartTime + " to " + temp.eventEndTime;
                        temp.roomId = scheduleData[key].roomId;
                        sevents.push(temp);
                    }
                }

            } catch (err) {
                console.error("Error -->>", err);
            }
        }

        console.warn("Final sevent/s 12-->>",sevents)
        return sevents
    }

    render() {

        return FullCalendarRender.call(this, this.props, this.state);
    }
}

export default createContainer(props => {
    console.log("props FullCalendarContainer = ", props);
    const { startDate, manageMyCalendar, isUserSubsReady, currentUser } = props;
    let view = manageMyCalendar ? "myCalendar" : "schoolCalendar"
    let { schoolId, slug } = props.params;
    if (!schoolId && !slug) {
        schoolId = currentUser && currentUser.profile && currentUser.profile.schoolId;
    }

    if (startDate) {
        console.log("startDate = ", startDate);
        Meteor.subscribe("classTimes.getclassTimesForCalendar", {schoolId: schoolId || slug, current_date: startDate, view})
    }

    classTimesData = ClassTimes.find({}).fetch();
    classInterestData = ClassInterest.find({}).fetch();
    

    console.log("FullCalendar createContainer classTimesData-->>", classTimesData)
    console.log("FullCalendar createContainer classInterestData-->>",classInterestData)
    // console.log("FullCalendar createContainer myClassIds-->>",myClassIds)
    // console.log("FullCalendar createContainer classSchedule-->>",classSchedule)
    return {
        ...props,
        classTimesData,
        classInterestData,
    };
}, FullCalendar);