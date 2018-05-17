import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import FullCalendarRender from './fullCalendarRender';
import ClassTimes from '/imports/api/classTimes/fields';
import ClassInterest from '/imports/api/classInterest/fields';
import moment from 'moment';
import ClassType from "/imports/api/classType/fields";


class FullCalendar extends React.Component {

    constructor(props) {
        super(props);
        this.options = {
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay,listWeek'
            },
            height: 1200, // Sets the height of the entire calendar, including header and footer.
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
                let sevents = this.buildCalander() || [];
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
                    case "OnGoing": {
                        if(moment(event.start).format("YYYY-MM-DD") >= moment(event.startDate).format("YYYY-MM-DD"))
                            return true;
                        return false;
                    }
                }

            },
            eventClick: (event) => {
                console.log("eventClick -->>",event)
                let clickedDate = moment(event.start).format("YYYY-MM-DD");
                if (event.classTimeId && event.classTypeId) {
                    this.props.showEventModal(true, event, clickedDate)
                }
            }
        }
    }

    buildCalander = () => {
        let { classTimesData, classInterestData, managedClassTimes, schoolClassTimes } = this.props;
        let { manageMyCalendarFilter } = this.props;
        let sevents = [];
        let myClassTimesIds = classInterestData.map(data => data.classTimeId);
        // Class Time Ids managed by current user
        // console.log("-----------------manageMyCalendarFilter------------------", manageMyCalendarFilter)
        let { manageClassTimeIds, schoolClassTimeId } = manageMyCalendarFilter;
        // let schoolClassTimesIds = schoolClassTimes.map(data => data._id);
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
                    name: classTime.name,
                    desc:classTime.desc,
                    endDate:classTime.endDate,
                    allDay:false// This property affects whether an event's time is shown.
                };
                let checkedClassTimes=false;
                // Three type of class times seperated into different colors.
                if(manageClassTimeIds.indexOf(classTime._id) > -1) {
                    sevent.className="event-rose";
                    sevent.attending = true;
                    checkedClassTimes=true;

                } else if (myClassTimesIds.indexOf(classTime._id) > -1) {
                    sevent.className = "event-green";
                    sevent.attending = true;
                    checkedClassTimes=true;
                } else if(schoolClassTimeId.indexOf(classTime._id) > -1) {
                    sevent.className = "event-azure";
                    sevent.attending = false;
                    checkedClassTimes=true;
                }
                // let classTypeData = ClassType.findOne({ _id: classTime.classTypeId});
                // console.log("classTypeData===>",classTypeData)
                if (classTime.scheduleType === "oneTime" && checkedClassTimes) {
                    let scheduleData = [...classTime.scheduleDetails.oneTime];
                    sevent.scheduleDetails = classTime.scheduleDetails;
                    for(let obj of scheduleData) {
                        sevent.start = obj.startDate;
                        sevent.roomId = obj.roomId;
                        sevent.eventStartTime = moment(obj.startTime).format("hh:mm");
                        sevent.eventEndTime = moment(new Date(obj.startTime)).add(obj.duration, obj.timeUnits && obj.timeUnits.toLowerCase() || "minutes").format("hh:mm");
                        sevent.title = classTime.name + " " + sevent.eventStartTime + " to " + sevent.eventEndTime;
                        // sevent.age = classTypeData && classTypeData.ageMin;
                        // sevent.gender = classTypeData && classTypeData.gender;
                        // sevent.experienceLevel = classTypeData && classTypeData.experienceLevel;
                        sevents.push(sevent);
                    }
                }

                if(checkedClassTimes && classTime.scheduleDetails && (classTime.scheduleType === "recurring" || classTime.scheduleType === "OnGoing")) {
                    let scheduleData = {...classTime.scheduleDetails};
                    sevent.scheduleDetails = classTime.scheduleDetails;
                    sevent.endDate = classTime.endDate && moment(classTime.endDate)
                    for (let key in scheduleData) {
                        // const dayData = scheduleData[key];
                        for(let obj of scheduleData[key]) {
                            let temp = {...sevent};
                            temp.dow = [obj.day];
                            // Keys `start` and ``end` are needed to show start and end time of an event on Calander.
                            temp.start = moment(obj.startTime).format("hh:mm");
                            temp.end = moment(new Date(obj.startTime)).add(obj.duration, "minutes").format("hh:mm");
                            temp.eventStartTime = moment(obj.startTime).format("hh:mm");
                            temp.eventEndTime = moment(new Date(obj.startTime)).add(obj.duration, obj.timeUnits && obj.timeUnits.toLowerCase() || "minutes").format("hh:mm");
                            temp.title = classTime.name + " " + temp.eventStartTime + " to " + temp.eventEndTime;
                            temp.roomId = obj.roomId;
                            // sevent.age = classTypeData && classTypeData.ageMin;
                            // sevent.gender = classTypeData && classTypeData.gender;
                            // sevent.experienceLevel = classTypeData && classTypeData.experienceLevel;
                            sevents.push(temp);
                        }
                    }
                }
                // console.warn("<<< dayData sevents>>>>",sevents);
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
    const { startDate, endDate, manageMyCalendar, isUserSubsReady, currentUser, manageMyCalendarFilter } = props;
    let view;
    console.log("props.route",props);
    if(props.route && props.route.name == "SchoolView" || props.route.name == "EmbedSchoolCalanderView" ) {
        view = "SchoolView";
    } else if (props.route && props.route.name == "ClassType") {
        view = "ClassType";
    } else if(props.route && props.route.name == "MyCalendar") {
        view = "MyCalendar";
    }
    // let view = manageMyCalendar ? "myCalendar" : "schoolCalendar"
    let { schoolId, slug, classTypeId } = props.params || {};
    let classTimesData = [];
    let classInterestData = [];

    if (!schoolId && !slug) {
        schoolId = currentUser && currentUser.profile && currentUser.profile.schoolId;
    }
    if(slug) {
        schoolId = props.schoolData._id;
    }
    if (startDate && endDate) {
        let subscription = Meteor.subscribe("classTimes.getclassTimesForCalendar", {schoolId: schoolId || slug, classTypeId: classTypeId, calendarStartDate: startDate, calendarEndDate: endDate, view})
        let classTimesFilter = {};
        let classInterestFilter = {};
        if(subscription.ready()) {
            if(manageMyCalendar) {
                let classTimesIds=[];
                for (var prop in manageMyCalendarFilter) {
                    classTimesIds.push(manageMyCalendarFilter[prop]);
                }
                classTimesIds= _.flatten(classTimesIds);
                classTimesFilter = { _id: { $in: classTimesIds } }
                classInterestFilter = { classTimeId: { $in: manageMyCalendarFilter.classTimesIdsForCI } }
            }
        }
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
