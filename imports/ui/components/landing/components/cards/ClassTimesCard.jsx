import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';

import {formatTime, formatAmPm, formatDateNoYear } from '/imports/util';
import {DAYS_IN_WEEK, CLASS_TIMES_CARD_WIDTH} from '/imports/ui/components/landing/constants/classTypeConstants.js';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const styles = {
  cardWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    overflowX: 'hidden',
    overflowY: 'auto',
    height: '100%',
    boxShadow: 'none',
    position: 'relative',
    zIndex: 0,
  },
  cardWrapperHidden: {
    overflowY: 'hidden'
  },
  cardItem: {
    backgroundColor: 'white',
    padding: `${helpers.rhythmDiv}px`,
    marginBottom: helpers.rhythmDiv,
    fontWeight: '300',
    width: '100%',
    fontSize: helpers.baseFontSize,
    fontFamily: helpers.specialFont
  },
  cardItemPopUp: {
    padding: helpers.rhythmDiv * 2,
    boxShadow: 'none',
    fontSize: 18
  },
  icon: {
    fontSize: helpers.baseFontSize,
    transform: `translateY(${helpers.rhythmDiv/2}px)`
  },
}

const OuterWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  padding-top: ${props => props.show ? helpers.rhythmDiv : 0}px;
`;

const Wrapper = styled.div`
  max-width: 100%;
  height: 100%;
  // padding: 0 ${helpers.rhythmDiv}px;
  padding-right: ${helpers.rhythmDiv}px;
  background: transparent;
  position: relative;
`;

const CardContent = styled.div`
  // padding-right: ${helpers.rhythmDiv}px;
`;

const Text = styled.p`
  font-size: ${helpers.baseFontSize}px;
  font-weight: 300;
  font-family: ${helpers.specialFont};
  margin: 0;
`;

const Description = Text.extend`
  line-height: 1;
  padding: ${props => props.inPopUp ? helpers.rhythmDiv * 2 : helpers.rhythmDiv}px;
  font-size: ${props => props.inPopUp ? 18 : helpers.baseFontSize}px;
`;

const Day = Text.extend`
  text-align: center;
  font-weight: 400;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const Heading = Day.extend`
  text-align: left;
`;

const Times = styled.ul`
  padding: 0;
  margin: 0;
`;

const Time = Text.withComponent('li').extend`
  list-style: none;
`;

const DateTime = Time.extend``;

const Bold = styled.span`
  font-weight: 500;
`;

const IconWithStyles = (props) => <Icon classes={{root: props.classes.icon}} >{props.iconName}</Icon>
const MyIcon = withStyles(styles)(IconWithStyles);

const ClassTimesCard = (props) =>  {
  const {classes} = props;

  const ScheduleDisplay = (props) => <Time> <MyIcon iconName={'access_time'} /> At <Bold>{props.time}</Bold> for <Bold>{props.duration}</Bold> mins</Time>;

  const SchedulePopUp = (props) => {
    if(props.scheduleType === 'recurring' || props.scheduleType === 'ongoing') {
      return <DateTime> {props.day} at <Bold>{props.time}</Bold> for <Bold>{props.duration}</Bold> mins </DateTime>;
    }else {
      return <DateTime> {props.day.substr(0,3)}, {formatDateNoYear(props.eventDate)} at <Bold>{props.time}</Bold> for <Bold>{props.duration}</Bold> mins </DateTime>
    }
  }

  const formatScheduleDisplay = (data, scheduleType, inPopUp) => {
    const {eventStartTime, time, timePeriod, duration} = data;

    let eventTime;

    if(scheduleType === 'recurring' || scheduleType === 'ongoing') {
      eventTime = `${formatTime(eventStartTime)} ${formatAmPm(eventStartTime)}`;
    }else {
      eventTime = `${time} ${timePeriod}`;
    }

    if(inPopUp) {
      return <SchedulePopUp
      time={eventTime}
      duration={duration}
      scheduleType={scheduleType}
      day={data.day}
      eventDate={data.eventDate}
      />
    }

    return <ScheduleDisplay time={eventTime} duration={duration} />
  }

  const getScheduleDetailsFromFormattedClassTimes = (formattedClassTimes, scheduleType, inPopUp) => {
    const eventScheduleType = scheduleType.toLowerCase();
    let cardItemClass = classes.cardItem;
    if(inPopUp) cardItemClass = cardItemClass + ' ' + classes.cardItemPopUp;

    return DAYS_IN_WEEK.map(day => {
      const scheduleData = formattedClassTimes[day]
      const currentDay = day;

      if(scheduleData) {
        const allDatesData = [];
        let eventData;
        scheduleData.forEach((schedule, i) => {
           const eventStartTime = new Date(schedule.startTime);
           eventDate = schedule.date;
           const data = {
             eventStartTime : eventStartTime,
             time : schedule.time,
             timePeriod : schedule.timePeriod,
             duration : schedule.duration,
             day: day,
             eventDate: eventDate
           }
          // console.info(eventStartTime,"===========================");
          allDatesData.push(formatScheduleDisplay(data, eventScheduleType, inPopUp));
        });

        if(eventScheduleType == 'recurring' || eventScheduleType == 'ongoing') {
          return (<Paper className={cardItemClass}>
                {!props.inPopUp && <Day>Every {day}</Day>}
                <Times>{allDatesData}</Times>
              </Paper>);
        }else {
          return (<Paper className={cardItemClass}>
            {!props.inPopUp && <Day>On {day}, {formatDateNoYear(eventDate)}</Day>}
            <Times>{allDatesData}</Times>
          </Paper>);
        }
      }
    })
  }


  let wrapperClassName = '';
  if(props.show) {
    wrapperClassName = classes.cardWrapper;
  }else {
    wrapperClassName = classes.cardWrapper + ' ' + classes.cardWrapperHidden;
  }


  return (<OuterWrapper show={props.show}>
      <Paper className={wrapperClassName} elevation={3}>
        <Wrapper show={props.show}>
          <CardContent>
            {getScheduleDetailsFromFormattedClassTimes(props.formattedClassTimes, props.scheduleType, props.inPopUp)}
            {props.description && <Description inPopUp={props.inPopUp}>
              {props.description}
            </Description>}
          </CardContent>
        </Wrapper>
      </Paper>
    </OuterWrapper>
  )}

  ClassTimesCard.propTypes = {
    inPopUp: PropTypes.bool,
    description: PropTypes.string,
    scheduleType: PropTypes.string,
    formattedClassTimes: PropTypes.shape,
    show: PropTypes.bool
  }

  ClassTimesCard.defaultProps = {
    inPopUp: false,
  }

export default withStyles(styles)(ClassTimesCard);
