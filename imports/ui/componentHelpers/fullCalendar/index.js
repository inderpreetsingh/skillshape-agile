import React from "react";
import { createContainer } from "meteor/react-meteor-data";
import FullCalendarRender from "./fullCalendarRender";
import ClassTimes from "/imports/api/classTimes/fields";
import ClassInterest from "/imports/api/classInterest/fields";
import moment from "moment";
import tz from 'moment-timezone';
import ClassType from "/imports/api/classType/fields";
import { uniq } from "lodash";
import fullCalendarRender from "./fullCalendarRender";

class FullCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.options = {
      header: {
        left: "prev,next today",
        center: "title",
        right: "month,week,listWeek"
        // right: "month,agendaWeek,agendaDay,listWeek"
      },
      defaultView: $(window).width() < 500 ? "listWeek" : "week",
      views: {
        week: {
          type: "basic",
          duration: { weeks: 3 }
        }
      },
      //theme:false,
      firstDay: moment().day(),
      //columnFormat: 'ddd - D',
      // contentHeight: 'auto',
      height: "auto", // Sets the height of the entire calendar, including header and footer.
      defaultDate: new Date(),
      selectable: true,
      selectHelper: true,
      navLinks: false, // can click day/week names to navigate views
      editable: false,
      eventLimit: false,
      windowResize: view => {
        if ($(window).width() < 500) {
          $("#fullcalendar-container").fullCalendar("changeView", "listWeek");
        } else {
          $("#fullcalendar-container").fullCalendar("changeView", "week");
        }
      },
      // allow "more" link when too many events
      /*eventSources :[sevents],*/
      eventSources: (start, end, timezone, callback) => {
        let startDate = new Date(start);
        let endDate = new Date(end);
        if (!this.props.startDate && startDate) {
          this.props.setDate(startDate, endDate);
        }
        if (
          this.props.startDate &&
          startDate &&
          this.props.startDate.valueOf() !== startDate.valueOf()
        ) {
          this.props.setDate(startDate, endDate);
        }
        let sevents = this.buildCalander() || [];
        callback(sevents);
      },
      dayRender: function (date, cell) { },
      eventRender: function (event, element, view) {
        let renderEvent = true;
        event.deletedEvents &&
          event.deletedEvents.map(current => {
            if (current == moment(event.start).format("YYYY-MM-DD")) {
              renderEvent = false;
            }
          });

        if (!renderEvent) {
          return false;
        }
        switch (event.scheduleType) {
          case "oneTime": {
            return renderEventBox(event);
          }
          case "recurring": {
            if (
              moment(event.start).format("YYYY-MM-DD") >=
              moment(event.startDate).format("YYYY-MM-DD") &&
              moment(event.start).format("YYYY-MM-DD") <=
              moment(event.endDate).format("YYYY-MM-DD")
            )
              return renderEventBox(event);
            return false;
          }
          case "OnGoing": {
            if (
              moment(event.start).format("YYYY-MM-DD") >=
              moment(event.startDate).format("YYYY-MM-DD")
            )
              return renderEventBox(event);
            return false;
          }
        }
      },
      eventClick: (event, jsEvent) => {
        let clickedDate = moment(event.start).format("YYYY-MM-DD");
        if (event.classTimeId && event.classTypeId) {
          this.props.showEventModal(true, event, clickedDate, jsEvent);
        }
      }
    };
  }
  _getNormalizedDayValue = value => {
    if (value == 6) {
      return 0;
    } else {
      return value ;
    }
  };

  _createSEventForSeriesClasses = (sevent, scheduleDetailsObj) => {
    let temp = { ...sevent };
    // console.group("object for svent");
    // console.log(dateObj.value, "----");
    // console.groupEnd();

    temp.dow = [scheduleDetailsObj.day];

    // Keys `start` and ``end` are needed to show start and end time of an event on Calander.
    temp.start = moment(scheduleDetailsObj.startTime).format("HH:mm");
    temp.end = moment(new Date(scheduleDetailsObj.startTime))
      .add(scheduleDetailsObj.duration, "minutes")
      .format("hh:mm");
      
    temp.eventStartTime = moment(scheduleDetailsObj.startTime).tz(moment.tz.guess()).format('hh:mm A z');
    temp.eventEndTime = moment(new Date(scheduleDetailsObj.startTime))
      .add(
        scheduleDetailsObj.duration,
        (scheduleDetailsObj.timeUnits &&
          scheduleDetailsObj.timeUnits.toLowerCase()) ||
        "minutes"
      )
      .format("hh:mm");
    temp.title = scheduleDetailsObj.title;

    // +
    // " " +
    // temp.eventStartTime +
    // " to " +
    // temp.eventEndTime;
    temp.roomId = scheduleDetailsObj.roomId;
    temp.durationAndTimeunits = `${scheduleDetailsObj.duration} ${
      scheduleDetailsObj.timeUnits ? scheduleDetailsObj.timeUnits : "Minutes"
      }`;

    // sevent.age = classTypeData && classTypeData.ageMin;
    // sevent.gender = classTypeData && classTypeData.gender;
    // sevent.experienceLevel = classTypeData && classTypeData.experienceLevel;
    // if (classTime && classTime.deletedEvents) {
    //   classTime.deletedEvents.map(current => {
    //       "condition",
    //       current,
    //       moment(temp.start).format("YYYY-MM-DD")
    //     );
    //     if (current == moment(temp.start).format("YYYY-MM-DD")) {
    //     } else {
    //       sevents.push(temp);
    //       return;
    //     }
    //   });
    // } else {
    //   sevents.push(temp);
    // }

    return temp;
  };

  buildCalander = () => {
    let {
      classTimesData,
      classInterestData,
      managedClassTimes,
      schoolClassTimes
    } = this.props;
    let { manageMyCalendarFilter } = this.props;
    let sevents = [];
    let myClassTimesIds = classInterestData.map(data => data.classTimeId);
    // Class Time Ids managed by current user
    let { manageClassTimeIds, schoolClassTimeId } = manageMyCalendarFilter;
    // let schoolClassTimesIds = schoolClassTimes.map(data => data._id);
    // merging deletedEvents data from classInterestData to classTimesData for disabling  
    classInterestData.map(current1 => {
      classTimesData.map(current2 => {
        if (current1.classTimeId == current2._id) {
          current2 && current2.deletedEvents
            ? (current2.deletedEvents = uniq(
              current2.deletedEvents.concat(current1.deletedEvents)
            ))
            : (current2.deletedEvents = current1.deletedEvents);
        }
      });
    });
    for (var i = 0; i < classTimesData.length; i++) {
      let classTime = classTimesData[i];
      try {
        let sevent;

        sevent = {
          classTimeId: classTime._id,
          classTypeId: classTime.classTypeId,
          schoolId: classTime.schoolId,
          locationId: classTime.locationId,
          startDate: moment(classTime.startDate),
          scheduleType: classTime.scheduleType,
          name: classTime.name,
          desc: classTime.desc,
          endDate: classTime.endDate,
          allDay: false, // This property affects whether an event's time is shown.
          deletedEvents: classTime.deletedEvents
        };
        let checkedClassTimes = false;
        // Three type of class times seperated into different colors.
        if (manageClassTimeIds.indexOf(classTime._id) > -1) {
          sevent.className = "event-rose";
          sevent.attending = true;
          checkedClassTimes = true;
        } else if (myClassTimesIds.indexOf(classTime._id) > -1) {
          sevent.className = "event-green";
          sevent.attending = true;
          checkedClassTimes = true;
        } else if (schoolClassTimeId.indexOf(classTime._id) > -1) {
          sevent.className = "event-azure";
          sevent.attending = false;
          checkedClassTimes = true;
        }
        // let classTypeData = ClassType.findOne({ _id: classTime.classTypeId});
        if (classTime.scheduleType === "oneTime" && checkedClassTimes) {
          let scheduleData = classTime.scheduleDetails;
          sevent.scheduleDetails = classTime.scheduleDetails;
          scheduleData.map((obj, index) => {
            sevent.start = obj.startTime;
            sevent.roomId = obj.roomId;
            sevent.eventStartTime = moment(obj.startTime).tz(moment.tz.guess()).format('hh:mm A z');
            sevent.eventEndTime = moment(new Date(obj.startTime))
              .add(
                obj.duration,
                (obj.timeUnits && obj.timeUnits.toLowerCase()) || "minutes"
              )
              .format("hh:mm");
            sevent.title = classTime.classTypeName.name + ": " + classTime.name;
            sevent.classTypeName  = classTime.classTypeName.name;
            sevent.durationAndTimeunits = `${obj.duration} ${
              obj.timeUnits ? obj.timeUnits : "Minutes"
              }`;
            // +
            // " " +
            // sevent.eventStartTime +
            // " to " +
            // sevent.eventEndTime;
            // sevent.age = classTypeData && classTypeData.ageMin;
            // sevent.gender = classTypeData && classTypeData.gender;
            // sevent.experienceLevel = classTypeData && classTypeData.experienceLevel;
            // if (classTime && classTime.deletedEvents) {
            //   classTime.deletedEvents.map(current => {
            //       "condition",
            //       current,
            //       moment(sevent.start).format("YYYY-MM-DD")
            //     );
            //     if (current == moment(sevent.start).format("YYYY-MM-DD")) {
            //     } else {
            //       sevents.push(sevent);
            //       return;
            //     }
            //   });
            // } else {
            // }

            sevents.push(sevent);
          });
        }

        if (
          checkedClassTimes &&
          classTime.scheduleDetails &&
          (classTime.scheduleType === "recurring" ||
            classTime.scheduleType === "OnGoing")
        ) {
          let scheduleData = classTime.scheduleDetails;
          sevent.scheduleDetails = classTime.scheduleDetails;
          sevent.endDate = classTime.endDate && moment(classTime.endDate);

          // In older data we don't have scheduleData as array
          if (!scheduleData.length) {
            const daysOfWeek = Object.keys(scheduleData);
            scheduleData[daysOfWeek].forEach(dayDetails => {
              const scheduleDetailsObject = {
                ...dayDetails,
                startTime: classTime.startDate,
                title: classTime.classTypeName.name + ": " + classTime.name
              };

              const newCalendarEvent = this._createSEventForSeriesClasses(
                sevent,
                scheduleDetailsObject
              );
              newCalendarEvent.classTypeName = classTime.classTypeName.name;
              sevents.push(newCalendarEvent);
            });
          } else {
            scheduleData.map((obj, index) => {
              obj.key.forEach(dateObj => {
                const scheduleDetailsObject = {
                  ...obj,
                  day: dateObj.value,
                  title: classTime.classTypeName.name + ": " + classTime.name
                };
                const newCalendarEvent = this._createSEventForSeriesClasses(
                  sevent,
                  scheduleDetailsObject
                );
              newCalendarEvent.classTypeName = classTime.classTypeName.name;
                sevents.push(newCalendarEvent);
              });
            });
          }
        }
        // console.warn("<<< dayData sevents>>>>", sevents);
      } catch (err) { }
    }

    return sevents;
  };

  render() {
    return FullCalendarRender.call(this, this.props, this.state);
  }
}

export default createContainer(props => {
  const {
    startDate,
    endDate,
    manageMyCalendar,
    isUserSubsReady,
    currentUser,
    manageMyCalendarFilter
  } = props;
  let view;
  if (
    (props.route && props.route.name == "SchoolView") ||
    props.route.name == "EmbedSchoolCalanderView"
  ) {
    view = "SchoolView";
  } else if (props.route && props.route.name == "ClassType") {
    view = "ClassType";
  } else if (props.route && props.route.name == "MyCalendar") {
    view = "MyCalendar";
  }
  // let view = manageMyCalendar ? "myCalendar" : "schoolCalendar"
  let { schoolId, slug, classTypeId } = props.params || {};
  let classTimesData = [];
  let classInterestData = [];

  if (!schoolId && !slug) {
    schoolId =
      currentUser && currentUser.profile && currentUser.profile.schoolId;
  }
  if (slug) {
    schoolId = props.schoolData._id;
  }
  if (startDate && endDate) {
    let subscription = Meteor.subscribe("classTimes.getclassTimesForCalendar", {
      schoolId: schoolId || slug,
      classTypeId: classTypeId,
      calendarStartDate: startDate,
      calendarEndDate: endDate,
      view
    });
    let classTimesFilter = {};
    let classInterestFilter = {};
    if (subscription.ready()) {
      if (manageMyCalendar) {
        let classTimesIds = [];
        for (var prop in manageMyCalendarFilter) {
          classTimesIds.push(manageMyCalendarFilter[prop]);
        }
        classTimesIds = _.flatten(classTimesIds);
        classTimesFilter = { _id: { $in: classTimesIds } };
        classInterestFilter = {
          classTimeId: { $in: manageMyCalendarFilter.classTimesIdsForCI }
        };
      }
    }
    classTimesData = ClassTimes.find(classTimesFilter).fetch();
    classInterestData = ClassInterest.find(classInterestFilter).fetch();
  }

  return {
    ...props,
    classTimesData,
    classInterestData
  };
}, FullCalendar);

const renderEventBox = event => {
  return $(`<div class="fc-day-grid-event fc-h-event fc-event fc-start fc-end" style="
              position: relative;
              background: #f5f5f5;
              border-radius:  5px;
              font-family: &quot;Lato&quot;, &quot;Helvetica Neue&quot;, Helvetica, Roboto, Arial, sans-serif;
              font-weight: 400;
              line-height: 1.5;
              color: #0a0a0a;
              -webkit-font-smoothing: antialiased;
              margin:  5px;
            ">
            <div>
              <strong class="primary label hour fc-event ${event.className &&
    event
      .className[0]}" style="box-shadow: none;display:  block;border-radius:  5px 5px 0 0;color: #fff;text-align: left;padding: 5px;"> ${
        event.eventStartTime} </strong>
            </div>
            <div class="padded" style="
              padding: 5px;
              text-align:  left;
            ">
                <div class="past_class" style="
                  color:  #8a8a8a;
                  font-weight: 700;
                  font-size:  15px;
                ">
                  <small>${event.title}</small></br>
                  <small style="color: blueviolet;font-size: 12px;font-weight: normal">
                  ${event.durationAndTimeunits &&
    event.durationAndTimeunits}</small>
                </div>
              </div>
            </div>`);
};
