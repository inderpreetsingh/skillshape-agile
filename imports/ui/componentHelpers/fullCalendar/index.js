import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import FullCalendarRender from './fullCalendarRender';
import moment from 'moment';

class FullCalendar extends React.Component {

	constructor(props) {
    super(props);
  }

  buildCalander = () => {
    let schoolId;
    let sevents = [];
    if (Meteor.user()) {
      schoolId = Meteor.user().profile.schoolId
    } else {
      schoolId = School.findOne()._id
    }

    let skillClass = SkillClass.find({schoolId: schoolId}).fetch();
    
    let myClassIds = skillClass.map(function(a) {
     return a._id
    })

    let skillClassIds = SkillClass.find().fetch().map(function(i) {
      return i._id
    });

    if (skillClassIds && skillClassIds.length > 0 || skillClassIds && skillClassIds.length == 0) {
      skillClass = SkillClass.find({
        _id: {
          $in: skillClassIds
        }
      }).fetch()
    } else {
      skillClass = SkillClass.find({}).fetch()
    }
    console.log("skillClassIds 12-->>",skillClass)
    for (var i = 0; i < skillClass.length; i++) {
      let sclass = skillClass[i];
      try {
        console.log("sclass._id 122 -->>",sclass._id)
        let classSchedule = ClassSchedule.find({skillClassId:sclass._id}).fetch()
        console.log("classSchedule 122 -->>",classSchedule)
        for(var s = 0 ; s < classSchedule.length;s++){
          sevent = {};
          sevent.title = sclass.className;
          sevent.id = classSchedule[s]._id
          sevent.start = moment(classSchedule[s].eventDate).format("YYYY-MM-DD");
          sevent.classTypeId = sclass.classTypeId;
          sevent.eventStartTime = classSchedule[s].eventStartTime;
          sevent.locationId = classSchedule[s].locationId;
          sevent.eventEndTime = classSchedule[s].eventEndTime
          sevent.eventDay = classSchedule[s].eventDay
          sevent.title = sclass.className + " " + classSchedule[s].eventStartTime + " to " + classSchedule[s].eventEndTime;
          if (myClassIds.indexOf(sclass._id) > -1) {
            sevent.className = "event-green"
          } else {
            sevent.className = "event-azure"
          }
          sevent.classId = sclass._id
          sevents.push(sevent)
        }
      } catch (err) {
        console.log("Error");
        console.log(err);
        console.log(sclass);
      }
    }

    console.log("sevents 12-->>",sevents)
    let test = [{
      classId: "TPvJMShcGofJbHE3w",
      className: "event-green",
      classTypeId: "YXdAyLNiR45yqiDXs",
      eventDay: "Sunday",
      eventEndTime: "15:00",
      eventStartTime: "12:00",
      id: "FQhJ5WAL4yD4PWC3A",
      locationId: "dhee4Pf9fbqL3oSdE",
      start: "2017-11-26",
      title: "Test class 12:00 to 15:00"
    }]
    return test
  }

  render() {
    const { schoolId, startDate } = this.props;
    this.startDate = startDate;
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
        console.log("eventSources startDate-->>",this.startDate)
        if(!this.startDate && start) {
          this.props.setDate(new Date(start))
        }
        let sevents = this.buildCalander() || []
        console.log("sevents -->>",sevents);
        callback(sevents);
      },
      dayRender: function(date, cell) {
      },
      eventClick: function(event) {
        
      }
    }
    return FullCalendarRender.call(this, this.props, this.state);
  }
}

export default createContainer(props => {
  console.log("props FullCalendarContainer = ", props);
  const { startDate } = props;
  const schoolId = props.params.schoolId

  if(schoolId && startDate) {
    console.log("yes",schoolId,startDate)
  	Meteor.subscribe("ClassSchedule",schoolId,startDate,{ onReady: function () {
      console.log("ClassSchedule subscribe done !!")
    }});
  }
  
  return { ...props};
}, FullCalendar);