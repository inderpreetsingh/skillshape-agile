import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import FullCalendarRender from './fullCalendarRender';

class FullCalendar extends React.Component {

  render() {
    return FullCalendarRender.call(this, this.props, this.state);
  }
}

export default createContainer(props => {
	const { schoolId, date } = props;
  console.log("props FullCalendarContainer = ", props);
  if(schoolId) {
  	Metoer.subscribe("ClassSchedule",schoolId,date)
  }
  
  return { ...props};
}, FullCalendar);