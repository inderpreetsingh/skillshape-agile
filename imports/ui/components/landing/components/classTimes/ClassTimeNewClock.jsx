import React , {Component , Fragment} from 'react';
import styled from 'styled-components';
import moment from 'moment';
import PropTypes from 'prop-types';

import * as helpers from '../jss/helpers.js';
import SliderDots from '../helpers/SliderDots.jsx';

const ClockOuterWrapper = styled.div`
  ${helpers.flexCenter}
  justify-content: flex-start;
  flex-direction: column;
  max-width: 220px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  opacity: ${props => props.visible ? 1 : 0};
  pointer-events: ${props => props.visible ? 'all' : 'none'};
  position: absolute;
  margin-bottom: ${helpers.rhythmDiv}px;
  transition: opacity .2s ease-out;
`;

const ClockInnerWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: ${props => props.clockType === 'single' ? 'column' : 'row'};
  justify-content: ${props => props.clockType === 'single' ? 'center' : 'flex-start'};
  width: 100%;
  transition: transform .2s ease-in;
  transform: translateX(${props => props.currentClockIndex * -60}px);
`;

const ClockWrapper = styled.div`
  ${helpers.flexCenter}
  flex-direction: column;
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  font-family: ${helpers.specialFont};
  border-radius: 50%;
  background: white;
  margin-bottom: ${helpers.rhythmDiv}px;
  transition: .2s ease-in width, .2s ease-in height;
  ${props => !props.active ? `width: 50px;
    height: 50px;` : ''}
`;


const TimeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-top: ${props => props.active ? 10 : 5}px;
  transition: .2s ease-in padding-top, opacity .2s ease-out;
`;

const Time = styled.p`
  margin: 0;
  transition: .2s ease-in font-size;
  font-size: ${props => props.active ? helpers.baseFontSize * 2 : helpers.baseFontSize}px;
  color: inherit;
`;

const TimePeriod = styled.span`
  display: inline-block;
  font-weight: 400;
  font-size: ${props => props.active ? helpers.baseFontSize : 12}px;
  line-height: 1;
  color: inherit;
  transition: .2 ease-in transform;
  transform: translateY(${props => props.active ? -8 : -4}px);
  padding-right: ${helpers.rhythmDiv/2}px;
`;

const Duration = styled.span`
  text-align: left;
  display: inline-block;
  font-weight: 400;
  font-size: ${props => props.active ? helpers.baseFontSize : 12}px;
  color: inherit;
  width: 100%;
  text-align: left;
  transform: translateY(10px);
`;

const DayDateContainer = styled.div`
  width: 100%;
  min-width: 50px;
`;

const MutipleDatesContainer = DayDateContainer.extend`
  position: relative;
  ${helpers.flexCenter}
  margin: ${helpers.rhythmDiv}px 0;
  height: ${props => props.height}px;
`;

const DayDateInfo = styled.p`
  display: inline-block;
  font-style: italic;
  font-size: 14px;
  font-weight: 400;
  margin: 0;
  text-align: left;
  opacity: 1;
  line-height: 1.3; // With this line-height font-size is approx 18px.
  transition: opacity .2s ease-out;
`;

const CurrentDate = DayDateInfo.extend`
  position: absolute;
  opacity: ${props => props.visible ? 1 : 0};
`;


// Assuming the duration in mins
const convertDurationToHours = (duration) => {
  const hours = Math.floor(duration/60);
  const minsLeft = duration%60;
  return `${hours}.${minsLeft} hr`;
}

/*
  type --> Multiple clocks, or is it single clock shown
    If it's multiple kinda clock then it will have index to tell which clock we are at currently..

  scheduleType --> can be oneTime, recurring, ongoing

  currentDay ---> It is to be shown
*/

const MyClockWrapper = styled.div`
  ${helpers.flexCenter}
  flex-direction: column;
  justify-content: center;
  height: 110px;
  margin-left: ${props => (props.clockType === 'multiple') ? (props.currentClock === 0) ? '60px' : '10px' : '0px'}; // IF the currentClock is 0
  cursor: ${props => props.clockType === 'multiple' ? 'pointer' : 'initial'};
`;

const ScheduleLabel = styled.p`
  text-align: center;
  font-weight: 500;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv/2}px;
  font-style: normal;
`;

const Date = styled.p`
  text-align: center;
  margin: 0;
`;

const DotsWrapper = styled.div`
  width: 100%;
  ${helpers.flexCenter}
  margin: ${helpers.rhythmDiv}px 0;
`;

const MyClock = (props) => (<MyClockWrapper
  clockType={props.clockType}
  currentClock={props.currentClock}
  onClick={props.onClockClick} >

  <ClockWrapper active={props.active} className={`class-time-transition ${props.className}`}>
    <TimeContainer active={props.active}>
      {props.active && <Duration active={props.active}>{props.schedule.duration && props.schedule.duration + 'mins'}</Duration>}
      <Time active={props.active}>{props.schedule.time || props.eventStartTime && props.formatTime(props.eventStartTime)}</Time>
      <TimePeriod active={props.active}>{props.schedule.timePeriod  || props.eventStartTime && props.formatAmPm(props.eventStartTime)}</TimePeriod>
    </TimeContainer>
  </ClockWrapper>
</MyClockWrapper>);

const dateFontSize = 18;
const margin = 2 * helpers.rhythmDiv;

class ClassTimeNewClock extends Component {

  state = {
    currentClockIndex: 0,
  }

  handleClockClick = (currentClockIndex) => {
    if(this.state.currentClockIndex !== currentClockIndex) {
      this.setState({
        currentClockIndex : currentClockIndex
      });
    }
  }

  formatScheduleDisplay = (currentDay, currentDate, eventStartTime) => {
    const { scheduleData , scheduleStartDate, scheduleEndDate} = this.props;
    const scheduleType = this.props.scheduleType.toLowerCase();
    const eventTime = `${this.formatTime(eventStartTime)} ${this.formatAmPm(eventStartTime)}`;

    if(scheduleType === 'ongoing') {
      return `Every ${currentDay} at ${eventTime}`;
    }else if(scheduleType === 'recurring') {
      return `Every ${currentDay} at ${eventTime} from ${this.formatDate(scheduleStartDate)} to ${this.formatDate(scheduleEndDate)}`;
    }else {
      return `${currentDay}, ${currentDate} at ${scheduleData[0].time} ${scheduleData[0].timePeriod}`;
    }
  }

  formatTime = (startTime) => {
    if(startTime && startTime.props) {
      return `${moment(startTime.props).format("hh:mm")}`
    }
  }
  formatAmPm = (startTime) => {
    if(startTime && startTime.props) {
      let hours = startTime.props.getHours();
      let ampm = hours >= 12 ? 'pm' : 'am';
      return `${ampm}`
    }
  }

  formatDate = (date) => {
    console.info(date, moment(date).format('DD-MM-YYYY'), ";;;;;;;;;;");
    return moment(date).format('DD-MM-YYYY');
  }

  computeContainerHeight = (clocks,scheduleType) => {
    let computedHeight = 100 + (dateFontSize + margin); // 18 font size + 2 * margintop and bottom.
    if(clocks === 'multiple') {
      computedHeight += 20; // Adding 20 more for the slider dots..
    }

    if(scheduleType === 'recurring') {
      // We already have added fontsize for 1 line of date , now this is for another..
      // since in recurring we have multiple lines for dates..
      computedHeight += dateFontSize;
    }
    console.info('----------------------- updating...')
    this.props.updateContainerHeight(computedHeight);
  }

  computeDateContainerHeight = (scheduleType) => {
    let computedHeight = dateFontSize;

    if(scheduleType === 'recurring') {
      computedHeight += dateFontSize;
    }
    return computedHeight;
  }

  componentDidUpdate = () => {
    const type = this.props.scheduleData.length > 1 ? 'multiple' : 'single';
    const { visible, scheduleType, currentDay} = this.props;
    // debugger;
    if(visible) {
      this.computeContainerHeight(type,scheduleType);
    }
  }

  componentDidMount = () => {
    const type = this.props.scheduleData.length > 1 ? 'multiple' : 'single';
    const { visible, scheduleType, currentDay} = this.props;
    // debugger;
    if(visible) {
      this.computeContainerHeight(type,scheduleType);
    }
  }

  render() {
    // console.log("Clock Outer wrapper",this.props,"..............");
    const type = this.props.scheduleData.length > 1 ? 'multiple' : 'single';
    const { scheduleData, visible, scheduleType, currentDay, updateContainerHeight } = this.props;
    // console.info(" clock outer wrapper........",this.props);

    return (<ClockOuterWrapper
              visible={visible}
              clockType={type}
              currentClockIndex={this.state.currentClockIndex}>
              <ClockInnerWrapper
                clockType={type}
                currentClockIndex={this.state.currentClockIndex}>
                {scheduleData && scheduleData.map((schedule,i) => (<MyClock
                  key={i}
                  currentClock={i}
                  active={i === this.state.currentClockIndex}
                  clockType={type}
                  schedule={schedule}
                  day={currentDay}
                  scheduleType={scheduleType}
                  formattedDate={this.formatDate(schedule.date || schedule.startTime)}
                  onClockClick={() => this.handleClockClick(i)}
                  eventStartTime={schedule && new Date(schedule.startTime)}
                  formatTime={this.formatTime}
                  formatAmPm={this.formatAmPm}
                  formatScheduleDisplay={this.formatScheduleDisplay}
                  {...this.props.clockProps}
                />))}
              </ClockInnerWrapper>
              {(scheduleData.length > 1) && <DotsWrapper><SliderDots
                  currentIndex={this.state.currentClockIndex}
                  noOfDots={this.props.scheduleData.length}
                  dotColor={this.props.clockProps.dotColor}
                  onDotClick={this.handleClockClick} /></DotsWrapper> }
              {scheduleType && <MutipleDatesContainer height={this.computeDateContainerHeight(scheduleType)}>
                {scheduleData.map((schedule,i) => {
                  const eventStartTime = new Date(schedule.startTime);
                  // console.info(eventStartTime,"===========================");
                  return(<CurrentDate clockType={type} visible={i === this.state.currentClockIndex}>
                  {this.formatScheduleDisplay(currentDay, this.formatDate(schedule.date || eventStartTime), eventStartTime) }
                </CurrentDate>)
              })}</MutipleDatesContainer>}
        </ClockOuterWrapper>)
    }
}

ClassTimeNewClock.propTypes = {
  time: PropTypes.string,
  timePeriod: PropTypes.string,
  duration: PropTypes.number,
  day: PropTypes.string,
}

export default ClassTimeNewClock;
