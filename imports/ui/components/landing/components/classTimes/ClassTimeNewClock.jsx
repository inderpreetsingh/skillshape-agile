import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import SliderDots from '/imports/ui/components/landing/components/helpers/SliderDots';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import { DAYS_IN_WEEK } from '/imports/ui/components/landing/constants/classTypeConstants';
import { formatDate, formatTime } from '/imports/util';


const ClockOuterWrapper = styled.div`
  ${helpers.flexCenter} justify-content: flex-start;
  flex-direction: column;
  max-width: 230px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  opacity: ${props => (props.visible ? 1 : 0)};
  pointer-events: ${props => (props.visible ? 'all' : 'none')};
  margin-bottom: ${helpers.rhythmDiv}px;
  transition: opacity 0.2s ease-out;
`;

const Container = styled.div`
  ${helpers.flexCenter} flex-direction: column;
`;

const ClockInnerWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: ${props => (props.clockType === 'single' ? 'column' : 'row')};
  justify-content: ${props => (props.clockType === 'single' ? 'center' : 'flex-start')};
  width: 100%;
  transition: transform 0.2s ease-in;
  transform: translateX(${props => props.currentClockIndex * -65}px);
`;

const ClockWrapper = styled.div`
  ${helpers.flexCenter} flex-direction: column;
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  font-family: ${helpers.specialFont};
  border-radius: 50%;
  background: white;
  transition: 0.2s ease-in width, 0.2s ease-in height;
  ${props => (!props.active
    ? `width: 50px;
    height: 50px;`
    : '')};
`;

const Bold = styled.span`
  font-weight: 500;
`;

const TimeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-top: ${props => (props.active ? 10 : 5)}px;
  transition: 0.2s ease-in padding-top, opacity 0.2s ease-out;
`;

const Time = styled.p`
  margin: 0;
  transition: 0.2s ease-in font-size;
  font-size: ${props => (props.active ? helpers.baseFontSize * 2 : helpers.baseFontSize)}px;
  color: inherit;
`;

const TimePeriod = styled.span`
  display: inline-block;
  font-weight: 400;
  font-size: ${props => (props.active ? helpers.baseFontSize : 12)}px;
  line-height: 1;
  color: inherit;
  transition: 0.2 ease-in transform;
  transform: translateY(${props => (props.active ? -8 : -4)}px);
  padding-right: ${helpers.rhythmDiv / 2}px;
`;

const Duration = styled.span`
  text-align: left;
  display: inline-block;
  font-weight: 400;
  font-size: ${props => (props.active ? helpers.baseFontSize : 12)}px;
  color: inherit;
  width: 100%;
  text-align: left;
  transform: translateY(10px);
`;

const DayDateContainer = styled.div`
  width: 100%;
  min-width: 220px;
`;

const MutipleDatesContainer = DayDateContainer.extend`
  position: relative;
  ${helpers.flexCenter} height: 38px; // This is the height computed from the font size of the date with 1.2 line height.
`;

const DayDateInfo = styled.p`
  display: inline-block;
  font-size: ${helpers.baseFontSize}px;
  font-weight: 300;
  font-family: ${helpers.specialFont};
  margin: 0;
  text-align: left;
  opacity: 1;
  line-height: 1.2; // With this line-height font-size is approx 19px.
  transition: opacity 0.2s ease-out;
`;

const CurrentDate = DayDateInfo.extend`
  position: absolute;
  width: 100%;
  opacity: ${props => (props.visible ? 1 : 0)};
`;

const Schedule = styled.p`
  display: inline-block;
  width: 100%;
  text-align: center;
  font-weight: 300;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv}px;
  font-size: ${helpers.baseFontSize}px;
  text-transform: capitalize;
`;

// Assuming the duration in mins
const convertDurationToHours = (duration) => {
  const hours = Math.floor(duration / 60);
  const minsLeft = duration % 60;
  return `${hours}.${minsLeft} hr`;
};

/*
  type --> Multiple clocks, or is it single clock shown
    If it's multiple kinda clock then it will have index to tell which clock we are at currently..

  scheduleType --> can be oneTime, recurring, ongoing

  currentDay ---> It is to be shown
*/

const MyClockWrapper = styled.div`
  ${helpers.flexCenter} flex-direction: column;
  justify-content: center;
  height: 108px;
  margin-left: ${props => (props.clockType === 'multiple'
    ? props.currentClock === 0
      ? '65px'
      : '15px'
    : '0px')}; // IF the currentClock is 0
  cursor: ${props => (props.clockType === 'multiple' ? 'pointer' : 'initial')};
`;

// const Date = styled.p`
//   text-align: center;
//   margin: 0;
// `;

const DotsWrapper = styled.div`
  width: 100%;
  ${helpers.flexCenter}
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const ChangeSlide = styled.div`
  width: 100%;
  font-family: ${helpers.specialFont};
  ${helpers.flexCenter}
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const Days = styled.p`
  ${helpers.flexCenter} margin: 0;
`;

const Day = styled.p`
  ${helpers.flexCenter} margin: 0;
  margin-right: ${helpers.rhythmDiv / 2}px;
  font-size: 12px;
  line-height: 1;
  font-family: ${helpers.specialFont};
  font-weight: 500;
  width: 28px;
  height: 28px;
  text-transform: capitalize;
  cursor: pointer;
  border-radius: 50%;
  padding: ${helpers.rhythmDiv}px;
  border: 1px solid
    ${props => (props.active
    ? helpers.primaryColor
    : `rgba(${helpers.classTimeClockButtonColor},0.8)`)};
  color: ${props => (props.active
    ? helpers.primaryColor
    : `rgba(${helpers.classTimeClockButtonColor},0.8)`)};

  &:last-of-type {
    margin-right: 0;
  }
`;

const MyClock = props => (
  <MyClockWrapper
    clockType={props.clockType}
    currentClock={props.currentClock}
    onClick={props.onClockClick}
  >
    <ClockWrapper
      active={props.active}
      className={`class-time-transition ${props.className}`}
    >
      <TimeContainer active={props.active}>
        {props.active && (
        <Duration active={props.active}>
          {props.schedule.duration && `${props.schedule.duration}mins`}
        </Duration>
        )}
        <Time active={props.active}>
          {props.schedule.time
              || (props.eventStartTime && formatTime(props.eventStartTime))}
        </Time>
        <TimePeriod active={props.active}>
          {props.schedule.timePeriod
              || (props.eventStartTime && props.formatAmPm(props.eventStartTime))}
        </TimePeriod>
      </TimeContainer>
    </ClockWrapper>
  </MyClockWrapper>
);

const OneTimeScheduleDisplay = props => (
  <Fragment>
    On
    {' '}
    <Bold>
      {props.eventDayDate}
      {' '}
    </Bold>
    at
    {' '}
    <Bold>
      {props.eventTime}
      {' '}
    </Bold>
    for
    {' '}
    <Bold>
      {props.duration}
      {' '}
    </Bold>
    minutes
    {' '}
  </Fragment>
);

const RecurringScheduleDisplay = props => (
  <Fragment>
    Every
    {' '}
    <Bold>
      {props.eventDay}
      {' '}
    </Bold>
    at
    {' '}
    <Bold>
      {props.eventTime}
      {' '}
    </Bold>
    for
    {' '}
    <Bold>
      {props.duration}
      {' '}
    </Bold>
    minutes
    {' '}
  </Fragment>
);

class ClassTimeNewClock extends Component {
  _getIndexForDay = day => DAYS_IN_WEEK.indexOf(day);

  _getDayInShortFormat = (dayDb) => {
    const day = dayDb.toLowerCase();
    return day.substr(0, 2);
  };

  _getDayIndexFromCurrentClockIndex = (clockIndex) => {
    const { formattedClassTimes } = this.props;
    let clockCounter = 0;

    for (let i = 0; i < DAYS_IN_WEEK.length; ++i) {
      const day = DAYS_IN_WEEK[i];
      const scheduleData = formattedClassTimes[day];
      if (scheduleData && scheduleData.length) {
        for (let j = 0; j < scheduleData.length; ++j) {
          // const schedule = scheduleData[j];
          if (clockCounter === clockIndex) {
            return this._getIndexForDay(day);
          }
          ++clockCounter;
        }
      }
    }

    return 0;
  };

  handleDayClick = (clockIndex, dayIndex) => (e) => {
    const { updateClockAndDayIndex } = this.props;
    e.preventDefault();
    // console.log('clicked',clockIndex,dayIndex,"=============");

    updateClockAndDayIndex(clockIndex, dayIndex);
  };

  handleClockClick = (currentClockIndex) => {
    const { updateClockAndDayIndex } = this.props;
    const dayIndex = this._getDayIndexFromCurrentClockIndex(currentClockIndex);

    updateClockAndDayIndex(currentClockIndex, dayIndex);
  };

  formatScheduleDisplay = (data) => {
    const { scheduleType } = this.props;
    const {
      currentDay,
      currentDate,
      eventStartTime,
      time,
      timePeriod,
      duration,
    } = data;
    const eventScheduleType = scheduleType.toLowerCase();
    const eventTime = `${formatTime(eventStartTime)} ${this.formatAmPm(
      eventStartTime,
    )}`;

    if (eventScheduleType === 'recurring' || eventScheduleType === 'ongoing') {
      return (
        <RecurringScheduleDisplay
          eventDay={currentDay}
          eventTime={eventTime}
          duration={duration}
        />
      );
    }
    // oneTime...
    const thisEventDayDate = `${currentDay} (${currentDate})`;
    const thisEventTime = `${time} ${timePeriod}`;
    // debugger;
    return (
      <OneTimeScheduleDisplay
        eventDayDate={thisEventDayDate}
        eventTime={thisEventTime}
        duration={duration}
      />
    );
  };

  // formatTime = (startTime) => {
  //   if(startTime && startTime.props) {
  //     return `${moment(startTime.props).format("hh:mm")}`
  //   }
  // }

  formatAmPm = (startTime) => {
    if (startTime && startTime.props) {
      const hours = startTime.props.getHours();
      const ampm = hours >= 12 ? 'pm' : 'am';
      return `${ampm}`;
    }
  };
  //
  // formatDate = (date) => {
  //   // console.info(date, moment(date).format('DD-MM-YYYY'), ";;;;;;;;;;");
  //   return moment(date).format('MMMM DD, YYYY');
  // }

  // computeContainerHeight = () => {
  //   const {scheduleType, totalClocks, updateContainerHeight} = this.props;
  //   const clocks = totalClocks > 1 ? 'multiple' : 'single';
  //
  //   // scheduleType + 18 datefont size + (2 * 8) margintop and bottom.
  //   let computedHeight = 100 + 16 + (DATE_FONT_SIZE + 2 * helpers.rhythmDiv);
  //
  //   if(clocks === 'multiple') {
  //     computedHeight += 20; // Adding 20 more for the slider dots..
  //   }
  //
  //   if(scheduleType === 'recurring' || scheduleType === 'oneTime') {
  //     // We already have added fontsize for 1 line of date , now this is for another..
  //     // since in recurring/oneTime we have multiple lines for dates..
  //     computedHeight += DATE_FONT_SIZE;
  //   }
  //   // console.info('----------------------- updating...')
  //   updateContainerHeight(computedHeight);
  // }

  // computeDateContainerHeight = () => {
  //   const {scheduleType} = this.props;
  //   let computedHeight = DATE_FONT_SIZE;
  //
  //   if(scheduleType === 'recurring') {
  //     computedHeight += DATE_FONT_SIZE;
  //   }
  //   return computedHeight;
  // }

  getDatesFromFormattedClassTimesData = () => {
    const { totalClocks, formattedClassTimes, currentClockIndex } = this.props;
    const type = totalClocks > 1 ? 'multiple' : 'single';
    const allDates = [];
    let clockCounter = 0;

    DAYS_IN_WEEK.forEach((day, i) => {
      const scheduleData = formattedClassTimes[day];
      const currentDay = day;
      if (scheduleData) {
        scheduleData.forEach((schedule, i) => {
          const eventStartTime = new Date(schedule.startTime);

          const data = {
            currentDay: day,
            eventStartTime,
            time: schedule.time,
            timePeriod: schedule.timePeriod,
            duration: schedule.duration,
            currentDate: formatDate(schedule.date || eventStartTime),
          };
          // console.info(eventStartTime,"===========================");
          allDates.push(
            <CurrentDate
              clockType={type}
              visible={clockCounter === currentClockIndex}
            >
              {this.formatScheduleDisplay(data)}
            </CurrentDate>,
          );
          ++clockCounter;
        });
      }
    });

    // console.info(allDates,"all Dates...")

    return allDates;
  };

  getClocksFromFormattedClassTimesData = () => {
    const { totalClocks, formattedClassTimes, currentClockIndex } = this.props;
    const type = totalClocks > 1 ? 'multiple' : 'single';
    const allClocks = [];
    let clockCounter = 0;

    DAYS_IN_WEEK.forEach((day, i) => {
      const scheduleData = formattedClassTimes[day];
      const currentDay = day;
      if (scheduleData) {
        scheduleData.forEach((schedule, i) => {
          const myClockValue = clockCounter;
          allClocks.push(
            <MyClock
              key={clockCounter}
              currentClock={clockCounter}
              active={clockCounter === currentClockIndex}
              clockType={type}
              schedule={schedule}
              day={this._getIndexForDay(currentDay)}
              formattedDate={formatDate(schedule.date || schedule.startTime)}
              onClockClick={() => this.handleClockClick(myClockValue)}
              eventStartTime={new Date(schedule.startTime)}
              formatAmPm={this.formatAmPm}
              formatScheduleDisplay={this.formatScheduleDisplay}
              {...this.props.clockProps}
            />,
          );
          ++clockCounter;
        });
      }
    });

    return allClocks;
  };

  getDaysOfWeekFromFormattedClassTimesData = () => {
    const { formattedClassTimes } = this.props;
    const daysInWeek = [];
    let clockCounter = 0;

    DAYS_IN_WEEK.forEach((day, i) => {
      if (formattedClassTimes[day]) {
        const scheduleData = formattedClassTimes[day];
        const myStartingClockCount = clockCounter;
        // console.log(scheduleData.length,myStartingClockCount,clockCounter,'this.props......')

        daysInWeek.push(
          <Day
            key={myStartingClockCount}
            active={this.props.currentDayIndex === this._getIndexForDay(day)}
            onClick={this.handleDayClick(
              myStartingClockCount,
              this._getIndexForDay(day),
            )}
          >
            {this._getDayInShortFormat(day)}
          </Day>,
        );

        clockCounter += scheduleData.length;
      }

      return null;
    });

    return daysInWeek;
  };

  componentDidUpdate = () => {
    // this.computeContainerHeight();
  };

  componentDidMount = () => {
    // this.computeContainerHeight();
  };

  render() {
    const {
      scheduleType,
      totalClocks,
      currentClockIndex,
      clockProps,
      formattedClassTimes,
    } = this.props;
    const type = totalClocks > 1 ? 'multiple' : 'single';
    const schduleTypeLowerCase = scheduleType.toLowerCase();

    return (
      <Container>
        {/* Days of week in circle format */}
        {formattedClassTimes
          && Object.keys(formattedClassTimes).length > 1 && (
            <ChangeSlide>
              <Days>
                {' '}
                {this.getDaysOfWeekFromFormattedClassTimesData()}
                {' '}
              </Days>
            </ChangeSlide>
        )}

        <ClockOuterWrapper
          visible
          clockType={type}
          currentClockIndex={currentClockIndex}
        >
          <ClockInnerWrapper
            clockType={type}
            currentClockIndex={currentClockIndex}
          >
            {this.getClocksFromFormattedClassTimesData()}
          </ClockInnerWrapper>
        </ClockOuterWrapper>

        {/* Slider Dots */}
        {totalClocks > 1 && (
          <DotsWrapper>
            <SliderDots
              currentIndex={currentClockIndex}
              noOfDots={totalClocks}
              dotColor={clockProps.dotColor}
              onDotClick={this.handleClockClick}
            />
          </DotsWrapper>
        )}

        {/* schedule Type */}

        <Schedule>
          {this.props.scheduleType == 'oneTime' && 'One Time'}
          {this.props.scheduleType == 'OnGoing' && 'Ongoing'}
          {this.props.scheduleType == 'recurring' && 'Recurring'}
        </Schedule>

        {/* All the schedule dates.. */}
        {scheduleType && (
          <MutipleDatesContainer>
            {this.getDatesFromFormattedClassTimesData()}
          </MutipleDatesContainer>
        )}
      </Container>
    );
  }
}

ClassTimeNewClock.propTypes = {
  time: PropTypes.string,
  timePeriod: PropTypes.string,
  duration: PropTypes.number,
  day: PropTypes.string,
};

export default ClassTimeNewClock;
