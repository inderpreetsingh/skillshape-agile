import React from 'react';
import FullCalendarContainer from "/imports/ui/componentHelpers/fullCalendar"
import ClassDetailModal from "/imports/ui/modal/classDetailModal";

export default class MyCalender extends React.Component {

	constructor(props) {
    super(props);
    this.state = {};
  }

  setDate = (startDate, endDate) => this.setState({startDate,endDate})

  handleEventModal = (isOpen, eventData, clickedDate) => {
    console.log("isOpen, eventData, clickedDate",isOpen, eventData, clickedDate)
    this.setState({
      isOpen,
      eventData,
      clickedDate
    })
  }

  render() {
    console.log("<<<< MyCalender >>>>", this.state)
    let { isOpen, eventData, clickedDate } = this.state;
    return  (
        <div>
            <FullCalendarContainer
    			subscriptionName="ClassSchedule"
    			setDate={this.setDate}
          showEventModal={this.handleEventModal}
    			{...this.state}
    			{...this.props}
          manageMyCalendar={true}
    		/>
            {
                isOpen && <ClassDetailModal
                  eventData={eventData}
                  showModal={isOpen}
                  closeEventModal={this.handleEventModal}
									onJoinClassButtonClick={this.props.onJoinClassButtonClick}
                  clickedDate={clickedDate}
								/>
            }
        </div>
    )
  }
}
