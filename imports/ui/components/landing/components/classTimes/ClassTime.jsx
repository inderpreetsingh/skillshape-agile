import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Badge from '../icons/Badge.jsx';

import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';

import * as helpers from '../jss/helpers.js';

const ClassContainer = styled.div`
  min-height: 400px;
  padding: ${helpers.rhythmDiv}px;
  padding: ${helpers.rhythmDiv * 2}px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    background-color: ${props => props.onGoing ? helpers.primaryColor : helpers.panelColor};
    top: 0;
    bottom: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: ${props => props.onGoing ? 0.1 : 0.5};
  }
`;

const ClockOuterWrapper = styled.div`
  ${helpers.flexCenter}
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const ClockWrapper = styled.div`
  ${helpers.flexCenter}
  flex-direction: column;
  width: 100px;
  height: 100px;
  font-family: ${helpers.specialFont};
  border: 2px solid ${props => props.onGoing ? helpers.primaryColor : helpers.cancel};
  border-radius: 50%;
  color: ${helpers.primaryColor};
  opacity: ${props => props.onGoing ? 1 : 0.8};
`;

const TimeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-top: 10px;
`;

const ClassScheduleWrapper = styled.div`
  ${helpers.flexCenter}
  margin-bottom: ${helpers.marginBottom}px;
`;

const Time = styled.p`
  margin: 0;
  font-size: ${helpers.baseFontSize * 2}px;
`;

const TimePeriod = styled.span`
  display: inline-block;
  font-family: ${helpers.commonFont};
  font-size: ${helpers.baseFontSize}px;
  transform: translateY(-10px);
`;

const Text = styled.p`
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv}px;
  font-weight: 600;
`;

const Seperator = styled.p`
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const Description = styled.p`
  margin: 0;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  font-weight: 400;
`;

const TrendingWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  right: -16px;
  left: auto;
`;

const TrendingText = styled.div`
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  font-weight: 600;
  font-style: italic;
  color: ${helpers.primaryColor};
  margin-top: 2px;
`;

const isClassOnGoing = (scheduleType) => scheduleType == 'on-going';

const ClassTimeClock = (props) => (
  <ClockOuterWrapper>
    <ClockWrapper onGoing={props.onGoing}>
      <TimeContainer>
        <Time>{props.time}</Time>
        <TimePeriod>{props.timePeriod}</TimePeriod>
      </TimeContainer>
    </ClockWrapper>
  </ClockOuterWrapper>
);

const ClassSchedule = (props) => (
  <ClassScheduleWrapper>
    <Text>{props.classDays}</Text>
    <Text>|</Text>
    <Text>{props.schedule}</Text>
  </ClassScheduleWrapper>
);

const Trending = () => {
  return (
    <TrendingWrapper>
      <TrendingText>#Trending</TrendingText>
      <Badge />
    </TrendingWrapper>
  )
}

const getCalenderButton = (props) => {
  if(isClassOnGoing(props.scheduleType) && props.addToCalender) {
    return (
      <PrimaryButton
      icon
      onClick={props.onAddToMyCalenderButtonClick}
      iconName="perm_contact_calendar"
      label="Add to my Calender"
    />);
  }else if(isClassOnGoing(props.scheduleType) && !props.addToCalender) {
    return (<PrimaryButton
        icon
        onClick={props.onRemoveFromCalenderButtonClick}
        iconName="delete"
        label="Remove from Calender"
      />)
  }
  else if(props.addToCalender) {
    return (
      <SecondaryButton
          icon
          onClick={props.onAddToMyCalenderButtonClick}
          iconName="perm_contact_calendar"
          label="Add to my Calender"
        />
    )
  }

  return (
    <SecondaryButton
        icon
        onClick={props.onRemoveFromCalenderButtonClick}
        iconName="delete"
        label="Remove from Calender"
      />
  )
}

const ClassTime = (props) => {
  console.log(" classtime props ------------> ",props);
  return (<ClassContainer onGoing={isClassOnGoing(props.scheduleType)}>
    <div>
      <ClassTimeClock time={props.time} timePeriod={props.timePeriod} onGoing={isClassOnGoing(props.scheduleType)}/>

      <ClassSchedule classDays={props.days} schedule={props.scheduleType} />

      <Description>
        {props.description}
      </Description>
    </div>

    {getCalenderButton(props)}

    {props.isTrending && <Trending />}
  </ClassContainer>);
}

export default ClassTime;
