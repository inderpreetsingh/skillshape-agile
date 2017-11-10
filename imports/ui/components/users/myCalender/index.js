import React from 'react';
import FullCalendarContainer from "/imports/ui/componentHelpers/fullCalendar"

export default class MyCalender extends React.Component {

  render() {
    return  <FullCalendarContainer 
			{...this.state} 
			subscriptionName="ClassSchedule"
		/>
  }
}
