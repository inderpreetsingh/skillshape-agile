import React , {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import * as helpers from '../jss/helpers.js';

const ClockOuterWrapper = styled.div`
  ${helpers.flexCenter}
  flex-direction: column;
  margin-bottom: ${helpers.rhythmDiv}px;
  position: relative;
`;

const ClockWrapper = styled.div`
  ${helpers.flexCenter}
  flex-direction: column;
  width: 100px;
  height: 100px;
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
  position: absolute;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity .2s ease-out;
`;

const Time = styled.p`
  margin: 0;
  font-size: ${helpers.baseFontSize * 2}px;
  color: inherit;
`;

const DayOfWeek = styled.p`
  display: inline-block;
  font-style: italic;
  font-size: ${helpers.baseFontSize}px;
  font-weight: 300;
  margin: 0;
  position: absolute;
  width: 100%;
  text-align: center;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity .2s ease-out;
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

const DayOfWeekContainer = styled.div`
  position: relative;
  width: 100%;
  min-width: 50px;
`;

// Assuming the duration in mins
const convertDurationToHours = (duration) => {
  const hours = Math.floor(duration/60);
  const minsLeft = duration%60;
  return `${hours}.${minsLeft} hr`;
}

const ClassTimeClocks = (props) => (
  <ClockOuterWrapper>
    <ClockWrapper className={`class-time-transition ${props.className}`}>
      {props.data.map((obj, i) => (
        <TimeContainer visible={props.visible === i}>
          <Duration>{obj.duration}mins</Duration>
          <Time>{obj.time}</Time>
          <TimePeriod>{obj.timePeriod}</TimePeriod>
        </TimeContainer>
      ))}
    </ClockWrapper>
    <DayOfWeekContainer>
    {props.data.map((obj, i) => (
      <DayOfWeek visible={props.visible === i}>{obj.day}</DayOfWeek>
    ))}
    </DayOfWeekContainer>
  </ClockOuterWrapper>
);

ClassTimeClocks.propTypes = {
  time: PropTypes.string,
  timePeriod: PropTypes.string,
  duration: PropTypes.number,
  day: PropTypes.string,
}

export default ClassTimeClocks;
