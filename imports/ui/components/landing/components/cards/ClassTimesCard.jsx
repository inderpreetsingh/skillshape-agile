import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Clear from 'material-ui-icons/Clear';
import MoreVert from 'material-ui-icons/MoreVert';

import {formatTime, formatAmPm, formatDate } from '/imports/util';
import {DAYS_IN_WEEK} from '/imports/ui/components/landing/constants/classTypeConstants.js';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const styles = {
  cardWrapper: {
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer'
  },
  cardIconButton : {
    minWidth: '0',
    minHeight: '0',
    padding: `0 ${helpers.rhythmDiv}px`,
    height: helpers.rhythmDiv * 4,
    width: helpers.rhythmDiv * 4,
    backgroundColor: 'white',
    color: helpers.black
  }
}

const IconButtonWrapper = styled.div``;

const Wrapper = styled.div`
  padding: ${helpers.rhythmDiv}px;
  // transform: scaleY(${props => props.show ? 1 : 0});
  transition: transform .1s linear, opacity .2s ease-out ${props => props.show ? '.1s' : '0s'};
  // transform-origin: center bottom;
  height: 100%;
  position: relative;
  opacity: ${props => props.show ? 1 : 0};
  background: white;
  overflow-y: auto;
`;

const CardTopArea = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`;

const CardContent = styled.div`
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
  margin-bottom: 0;
`;

const DayDetails = styled.div`
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const Times = styled.ul`
  padding: 0;
  margin: 0;
`;

const Time = Text.withComponent('li').extend`
  list-style: none;
  margin-bottom: ${helpers.rhythmDiv/2}px;
`;

const Bold = styled.span`
  font-weight: 500;
`;

const ScheduleDisplay = (props) => {
  return <Time>At <Bold>{props.time}</Bold> for <Bold>{props.duration}</Bold> minutes</Time>;
}

const ClassTimesCard = (props) =>  {
  const {classes} = props;

  const formatScheduleDisplay = (data, scheduleType) => {
    const {eventStartTime, time, timePeriod, duration} = data;

    let eventTime;

    if(scheduleType === 'recurring' || scheduleType === 'ongoing') {
      eventTime = `${formatTime(eventStartTime)} ${formatAmPm(eventStartTime)}`;
    }else {
      eventTime = `${time} ${timePeriod}`;
    }

    return <ScheduleDisplay time={eventTime} duration={duration} />
  }

  const getScheduleDetailsFromFormattedClassTimes = (formattedClassTimes, scheduleType) => {
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
           }
          // console.info(eventStartTime,"===========================");
          allDatesData.push(formatScheduleDisplay(data, eventScheduleType));
        });

        if(eventScheduleType == 'recurring' || eventScheduleType == 'ongoing') {
          return (<DayDetails>
                <Day>Every {day}</Day>
                <Times>{allDatesData}</Times>
              </DayDetails>);
        }else {
          return (<DayDetails>
            <Day>on {day}, {formatDate(eventDate)}</Day>
            <Times>{allDatesData}</Times>
          </DayDetails>);
        }

      }
    })
  }

  return (<Wrapper show={props.show}>
      <CardTopArea>
        <IconButton className={props.classes.cardIconButton} aria-label="close" onClick={props.onClose}>
          <Icon>clear</Icon>
        </IconButton>
      </CardTopArea>

      <CardContent>
        {getScheduleDetailsFromFormattedClassTimes(props.formattedClassTimes, props.scheduleType)}

        <Text> {props.description} </Text>
      </CardContent>
    </Wrapper>
  )}

export default withStyles(styles)(ClassTimesCard);
