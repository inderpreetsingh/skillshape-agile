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
    padding: `${helpers.rhythmDiv}px ${helpers.rhythmDiv * 2}px`,
    marginBottom: helpers.rhythmDiv,
    fontWeight: '300',
    width: '100%',
    fontSize: helpers.baseFontSize,
    fontFamily: helpers.specialFont
  },
  icon: {
    fontSize: helpers.baseFontSize,
    transform: 'translateY(2px)'
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
  transition: transform .1s linear, opacity .2s ease-out ${props => props.show ? '.1s' : '0s'};
  opacity: ${props => props.show ? 1 : 0};
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
  line-height: 1;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv}px;
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
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const DateTime = Time.extend``;

const Bold = styled.span`
  font-weight: 500;
`;

const ScheduleDisplay = (props) => <Time> <MyIcon iconName={'av_timer'} /> At <Bold>{props.time}</Bold> for <Bold>{props.duration}</Bold> mins</Time>;

const IconWithStyles = (props) => <Icon classes={{root: props.classes.icon}} >{props.iconName}</Icon>
const MyIcon = withStyles(styles)(IconWithStyles);

const ScheduleDisplaySingleLine = (props) => {
  if(props.scheduleType === 'recurring' || props.scheduleType === 'ongoing') {
    return <DateTime> {props.day} at <Bold>{props.time}</Bold> for <Bold>{props.duration}</Bold> mins </DateTime>;
  }else {
    return <DateTime> {props.day.substr(0,3)}, {formatDateNoYear(props.eventDate)} at <Bold>{props.time}</Bold> for <Bold>{props.duration}</Bold> mins </DateTime>
  }
}

const ClassTimesCard = (props) =>  {
  const {classes} = props;

  const formatScheduleDisplay = (data, scheduleType, displayScheduleSingleLine) => {
    const {eventStartTime, time, timePeriod, duration} = data;

    let eventTime;

    if(scheduleType === 'recurring' || scheduleType === 'ongoing') {
      eventTime = `${formatTime(eventStartTime)} ${formatAmPm(eventStartTime)}`;
    }else {
      eventTime = `${time} ${timePeriod}`;
    }

    if(displayScheduleSingleLine) {
      return <ScheduleDisplaySingleLine
      time={eventTime}
      duration={duration}
      scheduleType={scheduleType}
      day={data.day}
      eventDate={data.eventDate}
      />
    }

    return <ScheduleDisplay time={eventTime} duration={duration} />
  }

  const getScheduleDetailsFromFormattedClassTimes = (formattedClassTimes, scheduleType, displayScheduleSingleLine) => {
    const eventScheduleType = scheduleType.toLowerCase();
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
          allDatesData.push(formatScheduleDisplay(data, eventScheduleType, displayScheduleSingleLine, classes));
        });

        if(eventScheduleType == 'recurring' || eventScheduleType == 'ongoing') {
          return (<Paper className={props.classes.cardItem}>
                {!props.displayScheduleSingleLine && <Day>Every {day}</Day>}
                <Times>{allDatesData}</Times>
              </Paper>);
        }else {
          return (<Paper className={props.classes.cardItem}>
            {!props.displayScheduleSingleLine && <Day>On {day}, {formatDateNoYear(eventDate)}</Day>}
            <Times>{allDatesData}</Times>
          </Paper>);
        }
      }
    })
  }
  let wrapperClassName = '';
  if(props.show) {
    wrapperClassName = props.classes.cardWrapper;
  }else {
    wrapperClassName = props.classes.cardWrapper + ' ' + props.classes.cardWrapperHidden;
  }

  return (<OuterWrapper show={props.show}>
    {/*<Paper className={props.classes.cardTop}>
      <Button variant="raised" color='secondary' className={props.classes.cardIconButton} aria-label="close" onClick={props.onClose}>
        <Icon className={props.classes.icon}>keyboard_arrow_down</Icon>
      </Button>
    </Paper>*/}
      <Paper className={wrapperClassName} elevation={3}>
        <Wrapper show={props.show}>
          <CardContent>
            {getScheduleDetailsFromFormattedClassTimes(props.formattedClassTimes, props.scheduleType, props.displayScheduleSingleLine)}
            {props.description && <Paper className={props.classes.cardItem}>
              {/*<Heading>Description</Heading> */}
              {props.description}
            </Paper>}
          </CardContent>
        </Wrapper>
      </Paper>
    </OuterWrapper>
  )}

  ClassTimesCard.propTypes = {
    displayScheduleSingleLine: PropTypes.bool,
    description: PropTypes.string,
    scheduleType: PropTypes.string,
    formattedClassTimes: PropTypes.shape,
    show: PropTypes.bool
  }

  ClassTimesCard.defaultProps = {
    displayScheduleSingleLine: false,
  }

export default withStyles(styles)(ClassTimesCard);
