import React from 'react';
import FullCalendarContainer from "/imports/ui/componentHelpers/fullCalendar"
import ClassDetailModal from "/imports/ui/modal/classDetailModal";

export default class MyCalender extends React.Component {

	constructor(props) {
    super(props);
    this.state = {};
  }

  setDate = (date) => this.setState({startDate: date})
  
  handleEventModal = (isOpen, eventData) => {
    this.setState({
      isOpen,
      eventData 
    })
  }

  render() {
    let { isOpen, eventData } = this.state;
    return  (<div>
      <FullCalendarContainer 
			  subscriptionName="ClassSchedule"
			  setDate={this.setDate}
        showEventModal={this.handleEventModal}
			  {...this.state}
			 {...this.props} 
		  />
      {
        isOpen && <ClassDetailModal
          eventData={eventData}
          closeEventModal={this.handleEventModal}
        />
      }
    </div>)
  }
}
