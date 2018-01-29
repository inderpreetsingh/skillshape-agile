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
                let endDate = new Date(end)
                // console.log("eventSources old startDate-->>",this.props.startDate)
                // console.log("eventSources new startDate-->>",startDate)
                if (!this.props.startDate && startDate) {
                    this.props.setDate(startDate, endDate)
                }
                if (this.props.startDate && startDate && (this.props.startDate.valueOf() !== startDate.valueOf())) {
                    // console.log("eventSources startDate changed-->>")
                    this.props.setDate(startDate, endDate)
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
                if (event.classTimeId && event.classTypeId) {
                    this.props.showEventModal(true, event)
                }
            }
        }
    }

    buildCalander = () => {
        // console.log("buildCalander props -->>",this.props);
        let { classTimesData, classInterestData } = this.props;
        let sevents = [];
        let myClassTimesIds = classInterestData.map(data => data.classTimeId);
        for (var i = 0; i < classTimesData.length; i++) {
            let classTime = classTimesData[i];

            try {

                let sevent = {
                    classTimeId: classTime._id,
                    classTypeId: classTime.classTypeId,
                    schoolId: classTime.schoolId,
                    locationId: classTime.locationId,
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
                    let scheduleData = [...classTime.scheduleDetails.oneTime];
                    for(let obj of scheduleData) {
                        sevent.start = obj.startDate;
                        sevent.roomId = obj.roomId;
                        sevent.eventStartTime = moment(obj.startTime).format("hh:mm");
                        sevent.eventEndTime = moment(new Date(obj.startTime)).add(obj.duration, "minutes").format("hh:mm");
                        sevent.title = classTime.name + " " + sevent.eventStartTime + " to " + sevent.eventEndTime;
                        sevents.push(sevent)
                    }
                }

                if(classTime.scheduleDetails && (classTime.scheduleType === "recurring" || classTime.scheduleType === "onGoing")) {
                    let scheduleData = {...classTime.scheduleDetails};
                    sevent.scheduleDetails = classTime.scheduleDetails;
                    sevent.endDate = classTime.endDate && moment(classTime.endDate)
                    for (let key in scheduleData) {
                        // const dayData = scheduleData[key];
                        for(let obj of scheduleData[key]) {
                            let temp = {...sevent};
                            temp.dow = [obj.day];
                            temp.eventStartTime = moment(obj.startTime).format("hh:mm");
                            temp.eventEndTime = moment(new Date(obj.startTime)).add(obj.duration, "minutes").format("hh:mm");
                            temp.title = classTime.name + " " + temp.eventStartTime + " to " + temp.eventEndTime;
                            temp.roomId = obj.roomId;
                            sevents.push(temp);
                        }
                    }
                }
                // console.warn("<<< dayData sevents>>>>",sevents);
            } catch (err) {
                console.error("Error -->>", err);
            }
        }

        // console.warn("Final sevent/s 12-->>",sevents)
        return sevents
    }

    render() {

        return FullCalendarRender.call(this, this.props, this.state);
    }
}

export default createContainer(props => {
    console.log("props FullCalendarContainer = ", props);
    const { startDate, endDate, manageMyCalendar, isUserSubsReady, currentUser, manageMyCalendarFilter } = props;
    let view = manageMyCalendar ? "myCalendar" : "schoolCalendar"
    let { schoolId, slug } = props.params;
    let classTimesData = [];
    let classInterestData = [];

    if (!schoolId && !slug) {
        schoolId = currentUser && currentUser.profile && currentUser.profile.schoolId;
    }

    if (startDate && endDate) {
        let subscription = Meteor.subscribe("classTimes.getclassTimesForCalendar", {schoolId: schoolId || slug, calendarStartDate: startDate, calendarEndDate: endDate, view})
        let classTimesFilter = {};
        let classInterestFilter = {};
        if(subscription.ready()) {
            if(manageMyCalendar) {
                classTimesFilter = { _id: { $in: manageMyCalendarFilter.classTimesIds } }
                classInterestFilter = { classTimeId: { $in: manageMyCalendarFilter.classTimesIdsForCI } }
            }
        }
        // console.log("classTimesFilter -->>",classTimesFilter)
        // console.log("classInterestFilter -->>",classInterestFilter)
        classTimesData = ClassTimes.find(classTimesFilter).fetch();
        classInterestData = ClassInterest.find(classInterestFilter).fetch();
    }



    // console.log("FullCalendar createContainer classTimesData-->>", classTimesData)
    // console.log("FullCalendar createContainer classInterestData-->>",classInterestData)
    // console.log("FullCalendar createContainer myClassIds-->>",myClassIds)
    // console.log("FullCalendar createContainer classSchedule-->>",classSchedule)
    return {
        ...props,
        classTimesData,
        classInterestData,
    };
}, FullCalendar);