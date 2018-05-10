import React , {Component , Fragment} from 'react';
import styled from 'styled-components';
import moment from 'moment';
import PropTypes from 'prop-types';

import SliderDots from '../helpers/SliderDots.jsx';

import * as helpers from '../jss/helpers.js';
import { DAYS_IN_WEEK } from '/imports/ui/components/landing/constants/daysInWeek.js';


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
  margin-left: ${props => (props.clockType === 'multiple') ? (props.currentClock === 0) ? '60px' : '10px' : '0px'};  // IF the currentClock is 0
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

class MyClock extends Component {
render() {
  const {props} = this;
  return (<MyClockWrapper
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
  }
}

const dateFontSize = 18;
const margin = 2 * helpers.rhythmDiv;

class ClassTimeNewClock extends Component {

  state = {
    currentClockIndex: this.props.currentSelectedIndex,
  }

  _getIndexForDay = (day) => {
    return DAYS_IN_WEEK.indexOf(day);
  }

  _getDayIndexFromCurrentClockIndex = (clockIndex) => {
    const {formattedClassTimes} = this.props;
    let clockCounter = 0;

    for(let i = 0; i < DAYS_IN_WEEK.length; ++i) {
      const day = DAYS_IN_WEEK[i];
      const scheduleData = formattedClassTimes[day];
      if(scheduleData && scheduleData.length) {
        for(let j = 0; j < scheduleData.length; ++j) {
          // const schedule = scheduleData[j];
          if(clockCounter === clockIndex) {
            return this._getIndexForDay(day);
          }
          ++clockCounter;
        }
      }
    }

    return 0;
  }

  handleClockClick = (currentClockIndex) => {
    const {updateClockAndDayIndex} = this.props;

    // if(this.state.currentClockIndex !== currentClockIndex) {
    //   this.setState({
    //     currentClockIndex : currentClockIndex
    //   });
    // }

    const dayIndex = this._getDayIndexFromCurrentClockIndex(currentClockIndex);
    console.info("updateing ......... currentClockIndex , dayIdex",currentClockIndex,dayIndex,"updateing ......... currentClockIndex , dayIdex")
    updateClockAndDayIndex(currentClockIndex, dayIndex);
  }

  formatScheduleDisplay = (currentDay, currentDate, eventStartTime, scheduleData) => {
    const { scheduleStartDate, scheduleEndDate} = this.props;
    const scheduleType = this.props.scheduleType.toLowerCase();
    const eventTime = `${this.formatTime(eventStartTime)} ${this.formatAmPm(eventStartTime)}`;

    if(scheduleType === 'ongoing') {
      return `Every ${currentDay} at ${eventTime}`;
    }else if(scheduleType === 'recurring') {
      return `Every ${currentDay} at ${eventTime} from ${this.formatDate(scheduleStartDate)} to ${this.formatDate(scheduleEndDate)}`;
    }else {
      // oneTime...
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
    // console.info(date, moment(date).format('DD-MM-YYYY'), ";;;;;;;;;;");
    return moment(date).format('DD-MM-YYYY');
  }

  computeContainerHeight = () => {
    const {scheduleType, totalClocks, updateContainerHeight} = this.props;
    const clocks = totalClocks > 1 ? 'multiple' : 'single';

    let computedHeight = 100 + (dateFontSize + margin); // 18 font size + 2 * margintop and bottom.
    if(clocks === 'multiple') {
      computedHeight += 20; // Adding 20 more for the slider dots..
    }

    if(scheduleType === 'recurring') {
      // We already have added fontsize for 1 line of date , now this is for another..
      // since in recurring we have multiple lines for dates..
      computedHeight += dateFontSize;
    }
    // console.info('----------------------- updating...')
    updateContainerHeight(computedHeight);
  }

  computeDateContainerHeight = () => {
    const {scheduleType} = this.props;
    let computedHeight = dateFontSize;

    if(scheduleType === 'recurring') {
      computedHeight += dateFontSize;
    }
    return computedHeight;
  }

  getDatesFromFormattedClassTimesData = () => {
    const {totalClocks,formattedClassTimes} = this.props;
    const type = totalClocks > 1 ? 'multiple' : 'single';
    const allDates = [];
    let clockCounter = 0;

    DAYS_IN_WEEK.forEach((day,i) => {
      const scheduleData = formattedClassTimes[day]
      const currentDay = day;
      if(scheduleData) {
        scheduleData.forEach((schedule) => {
          const eventStartTime = new Date(schedule.startTime);
          // console.info(eventStartTime,"===========================");
          allDates.push(<CurrentDate clockType={type} visible={clockCounter === this.state.currentClockIndex}>
            {this.formatScheduleDisplay(currentDay, this.formatDate(schedule.date || eventStartTime), eventStartTime, scheduleData) }
          </CurrentDate>);
          ++clockCounter;
        }
      )}
    });

    // console.info(allDates,"all Dates...")

    return allDates;
  }

  getClocksFromFormattedClassTimesData = () => {
    const {totalClocks,formattedClassTimes} = this.props;
    const type = totalClocks > 1 ? 'multiple' : 'single';
    const allClocks = [];
    let clockCounter = 0;

    DAYS_IN_WEEK.forEach((day,i) => {
      const scheduleData = formattedClassTimes[day]
      const currentDay = day;
      if(scheduleData) {
        scheduleData.forEach((schedule,i) => {
          const myClockValue = clockCounter;
          allClocks.push(<MyClock
            key={clockCounter}
            currentClock={clockCounter}
            active={clockCounter === this.state.currentClockIndex}
            clockType={type}
            schedule={schedule}
            day={this._getIndexForDay(currentDay)}
            formattedDate={this.formatDate(schedule.date || schedule.startTime)}
            onClockClick={() => this.handleClockClick(myClockValue)}
            eventStartTime={schedule && new Date(schedule.startTime)}
            formatTime={this.formatTime}
            formatAmPm={this.formatAmPm}
            formatScheduleDisplay={this.formatScheduleDisplay}
            {...this.props.clockProps}
          />);
          ++clockCounter;
        });
      }
    });

    return allClocks;
  }

  componentWillReceiveProps = (nextProps) => {
    if(this.props.currentSelectedIndex !== nextProps.currentSelectedIndex) {
      this.setState({ currentClockIndex: nextProps.currentSelectedIndex});
    }
  }

  componentDidUpdate = () => {
    this.computeContainerHeight();
  }

  componentDidMount = () => {
    this.computeContainerHeight();
  }

  render() {
    const { scheduleType, totalClocks, clockProps } = this.props;
    const type = totalClocks > 1 ? 'multiple' : 'single';
    console.info(type, totalClocks, "type .............");

    return (<ClockOuterWrapper
              visible={true}
              clockType={type}
              currentClockIndex={this.state.currentClockIndex}>
              <ClockInnerWrapper
                clockType={type}
                currentClockIndex={this.state.currentClockIndex}>
                {this.getClocksFromFormattedClassTimesData()}
              </ClockInnerWrapper>
              {(totalClocks > 1) && <DotsWrapper><SliderDots
                  currentIndex={this.state.currentClockIndex}
                  noOfDots={totalClocks}
                  dotColor={clockProps.dotColor}
                  onDotClick={this.handleClockClick} /></DotsWrapper> }
              {scheduleType
                &&
                <MutipleDatesContainer height={this.computeDateContainerHeight()}>
                {this.getDatesFromFormattedClassTimesData()}
                </MutipleDatesContainer>}
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
