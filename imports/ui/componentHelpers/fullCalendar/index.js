import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import FullCalendarRender from './fullCalendarRender';
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
        if(!this.props.startDate && startDate) {
          this.props.setDate(startDate)
        }
        if(this.props.startDate && startDate && (this.props.startDate.valueOf() !== startDate.valueOf())) {
          // console.log("eventSources startDate changed-->>")
          this.props.setDate(startDate)
        }
        let sevents = this.buildCalander() || []
        // console.log("sevents -->>",sevents);
        callback(sevents);
      },
      dayRender: function(date, cell) {
      },
      eventClick: (event) => {
        // console.log("eventClick -->>",event)
        if (event.classId && event.classTypeId) {
          this.props.showEventModal(true,event)
        }
      }
    }
  }

  buildCalander = () => {
    // console.log("buildCalander props -->>",this.props);
    let { skillClass, myClassIds } = this.props;
    let sevents = [];
    
    for (var i = 0; i < skillClass.length; i++) {
      let sclass = skillClass[i];
      try {
        // console.log("sclass._id 122 -->>",sclass._id)
        let classSchedule = ClassSchedule.find({skillClassId:sclass._id}).fetch()
        // console.log("classSchedule 122 -->>",classSchedule)
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
        console.error("Error -->>",err);
      }
    }

    // console.log("sevent/s 12-->>",sevents)
    return sevents
  }

  render() {
  
    return FullCalendarRender.call(this, this.props, this.state);
  }
}

export default createContainer(props => {
  // console.log("props FullCalendarContainer = ", props);
  const { startDate } = props;
  let schoolId;
  let classSchedule;
  
  if (Meteor.user()) {
    schoolId = Meteor.user().profile.schoolId
  } else {
    schoolId = School.findOne()._id
  }
 
  let skillClass = SkillClass.find({}).fetch();
  let myClassIds = SkillClass.find({schoolId: schoolId}).fetch().map((a) => {
   return a._id
  })

  if(startDate) {
    const { schoolId, slug } = props.params;
  	Meteor.subscribe("ClassSchedule", (schoolId || slug), startDate)
    classSchedule = ClassSchedule.find().fetch()
  }

  // console.log("FullCalendar createContainer classSchedule-->>",classSchedule)
  // console.log("FullCalendar createContainer skillClass-->>",skillClass)
  // console.log("FullCalendar createContainer myClassIds-->>",myClassIds)
  return { 
    ...props, 
    classSchedule,
    skillClass,
    myClassIds,
  };
}, FullCalendar);