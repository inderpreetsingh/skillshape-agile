import React from 'react';
import FullCalendarContainer from "/imports/ui/componentHelpers/fullCalendar"

export default class MyCalender extends React.Component {

	constructor(props) {
    super(props);
    this.state = {};
  }

  setDate = (date) => {
  	console.log("setDate -->>",date)
  	this.setState({
  		startDate: date
  	})
  }

  render() {
    return  <FullCalendarContainer 
			subscriptionName="ClassSchedule"
			setDate={this.setDate}
			{...this.state}
			{...this.props} 
		/>
  }
}
