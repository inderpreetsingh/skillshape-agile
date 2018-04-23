import React , {Component , Fragment} from 'react';
import styled from 'styled-components';

import moment from 'moment';
import PropTypes from 'prop-types';

import SliderDots from '../helpers/SliderDots.jsx';
import * as helpers from '../jss/helpers.js';

const ONE_TIME = 'onetime';

const ClockOuterWrapper = styled.div`
  ${helpers.flexCenter}
  flex-direction: column;
  max-width: ${helpers.rhythmDiv * 20}px;
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
  transform: translateX(${props => props.currentClockIndex * -110}px);
`;

const ClockWrapper = styled.div`
  ${helpers.flexCenter}
  flex-direction: column;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  font-family: ${helpers.specialFont};
  border-radius: 50%;
  background: white;
  margin-bottom: ${helpers.rhythmDiv}px;
`;


const TimeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-top: 10px;
  transition: opacity .2s ease-out;
`;

const Time = styled.p`
  margin: 0;
  font-size: ${helpers.baseFontSize * 2}px;
  color: inherit;
`;

const TimePeriod = styled.span`
  display: inline-block;
  font-weight: 400;
  font-size: ${helpers.baseFontSize}px;
  transform: translateY(-10px);
  color: inherit;
`;

const Duration = styled.span`
  text-align: left;
  display: inline-block;
  font-weight: 400;
  font-size: ${helpers.baseFontSize}px;
  color: inherit;
  width: 100%;
  text-align: left;
  transform: translateY(10px);
`;

const DayDateContainer = styled.div`
  width: 100%;
  min-width: 50px;
`;

const DayDateInfo = styled.p`
  display: inline-block;
  font-style: italic;
  font-size: ${helpers.baseFontSize}px;
  font-weight: 300;
  margin: 0;
  width: 100%;
  text-align: center;
  opacity: 1;
  transition: opacity .2s ease-out;
  text-transform: capitalize;
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
  margin-left: ${props => (props.clockType === 'multiple') ? (props.currentClock === 0) ? '30px' : '10px' : '0px'};
  cursor: ${props => props.clockType === 'multiple' ? 'pointer' : 'initial'};
`;

const ScheduleLabel = styled.p`
  text-align: center;
  font-weight: 500;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv/2}px;
  text-transform: capitalize;
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
  {props.scheduleType && <DayDateContainer>
    <DayDateInfo clockType={props.clockType}>
      <Date>({props.formattedDate})</Date>
    </DayDateInfo>
  </DayDateContainer>}

  <ClockWrapper className={`class-time-transition ${props.className}`}>
    <TimeContainer>
      <Duration>{props.schedule.duration}</Duration>
      <Time>{props.schedule.time || props.eventStartTime && props.formatTime(props.eventStartTime)}</Time>
      <TimePeriod>{props.schedule.timePeriod}</TimePeriod>
    </TimeContainer>
  </ClockWrapper>
</MyClockWrapper>);

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

  formatTime = (startTime) => {
    if(startTime && startTime.props) {
      let hours = startTime.props.getHours();
      let ampm = hours >= 12 ? 'pm' : 'am';
      return `${moment(startTime.props).format("hh:mm")}${ampm}`
    }
  }

  formatDate = (date) => {
    console.info(date, moment(date).format('DD-MM-YYYY'), ";;;;;;;;;;");
    return moment(date).format('DD-MM-YYYY');
  }

  render() {
    // console.log("Clock Outer wrapper",this.props,"..............");
    const type = this.props.scheduleData.length > 1 ? 'multiple' : 'single';
    const { scheduleData, scheduleType, currentDay } = this.props;
    console.info(" clock outer wrapper........",this.props);
    return (<ClockOuterWrapper
              visible={this.props.visible}
              clockType={type}
              currentClockIndex={this.state.currentClockIndex}>
              <ClockInnerWrapper
                clockType={type}
                currentClockIndex={this.state.currentClockIndex}>
                {scheduleData && scheduleData.map((schedule,i) => (<MyClock
                  key={i}
                  currentClock={i}
                  clockType={type}
                  schedule={schedule}
                  day={currentDay}
                  scheduleType={scheduleType}
                  formattedDate={this.formatDate(schedule.date || schedule.startTime)}
                  onClockClick={() => this.handleClockClick(i)}
                  {...this.props.clockProps}
                  eventStartTime={schedule && new Date(schedule.startTime)}
                  formatTime={this.formatTime}
                />))}
              </ClockInnerWrapper>
              {(scheduleData.length > 1) && <DotsWrapper><SliderDots
                  currentIndex={this.state.currentClockIndex}
                  noOfDots={this.props.scheduleData.length}
                  dotColor={this.props.clockProps.dotColor}
                  onDotClick={this.handleClockClick} /></DotsWrapper> }
              {scheduleType && scheduleType.toLowerCase() !== ONE_TIME && <DayDateContainer>
                <DayDateInfo clockType={type} visible>
                  {currentDay}
                </DayDateInfo>
              </DayDateContainer>}
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
