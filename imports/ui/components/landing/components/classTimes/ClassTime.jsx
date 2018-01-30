import React,{Component} from 'react';
import styled, {keyframes} from 'styled-components';
import PropTypes from 'prop-types';
import { CSSTransitionGroup, TransitionGroup } from 'react-transition-group';

import TrendingIcon from '../icons/Trending.jsx';

import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';
import ClassTimeButton from '../buttons/ClassTimeButton.jsx';

import * as helpers from '../jss/helpers.js';

const ON_GOING_SCHEDULE = 'Ongoing';

const ClassContainer = styled.div`
  width: 250px;
  min-height: 350px;
  padding: ${helpers.rhythmDiv}px;
  padding: ${helpers.rhythmDiv * 2}px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: relative;
  transition: .8s all;
  animation: fade 1s linear;

  &:after {
    content: '';
    position: absolute;
    background-color: ${props => (props.addToCalendar && props.scheduleTypeOnGoing) ? helpers.primaryColor : helpers.panelColor};
    top: 0;
    bottom: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: ${props => (props.addToCalendar && props.scheduleTypeOnGoing) ? 0.2 : 1};
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
  border: 2px solid ${props => (props.addToCalendar && props.scheduleTypeOnGoing) ? helpers.primaryColor : helpers.cancel};
  border-radius: 50%;
  background: white;
  color: ${props => (props.addToCalendar && props.scheduleTypeOnGoing) ? helpers.primaryColor : helpers.cancel};
`;

const TimeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-top: 10px;
`;

const ClassScheduleWrapper = styled.div`
  ${helpers.flexCenter}
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const Time = styled.p`
  margin: 0;
  font-size: ${helpers.baseFontSize * 2}px;
`;

const TimePeriod = styled.span`
  display: inline-block;
  font-weight: 400;
  font-size: ${helpers.baseFontSize}px;
  transform: translateY(-10px);
`;

const Text = styled.p`
  margin: 0;
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.specialFont};
  font-weight: 600;
`;

const Seperator = styled.p`
  margin: 0 ${helpers.rhythmDiv/2}px;
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.specialFont};
  font-weight: 600;
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
  right: -${helpers.rhythmDiv * 2}px;
  left: auto;
`;

const TrendingText = styled.div`
  ${helpers.flexCenter}
  font-size: 14px;
  color: ${helpers.primaryColor};
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 1px solid ${helpers.primaryColor};
  border-radius: 20px;
`;

const ClassTimeClock = (props) => (
  <ClockOuterWrapper>
    <ClockWrapper addToCalendar={props.addToCalendar} scheduleTypeOnGoing={props.scheduleTypeOnGoing}>
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
    <Seperator> | </Seperator>
    <Text>{props.schedule}</Text>
  </ClassScheduleWrapper>
);

const Trending = () => {
  return (
    <TrendingWrapper>
      <TrendingIcon />
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


_isClassOnGoing = (scheduleType) => scheduleType == ON_GOING_SCHEDULE;

class ClassTime extends Component {

  state = {
    addToCalendar : this.props.addToCalendar,
    scheduleTypeOnGoing: _isClassOnGoing(this.props.scheduleType)
  }

  handleToggleAddToCalendar = () => {
    this.setState({
      addToCalendar: !this.state.addToCalendar
    });
  }

  handleAddToMyCalendarButtonClick = () => {

    this.setState({
      addToCalendar: false
    });


    if(this.props.onAddToMyCalendarButtonClick) {
      this.props.onAddToMyCalendarButtonClick();
    }
  }

  handleRemoveFromCalendarButtonClick = () => {

    if(this.state.scheduleTypeOnGoing) {
      this.setState({
        addToCalendar: true
      });
    }

    if(this.props.onRemoveFromCalendarButtonClick) {
      this.props.onRemoveFromCalendarButtonClick();
    }
  }

  render() {
    console.log(this.state.addToCalendar);
    return (<ClassContainer key={this.props._id} addToCalendar={this.state.addToCalendar} scheduleTypeOnGoing={this.state.scheduleTypeOnGoing}>
            <div>
              <ClassTimeClock
                time={this.props.time}
                timePeriod={this.props.timePeriod}
                addToCalendar={this.state.addToCalendar}
                scheduleTypeOnGoing={this.state.scheduleTypeOnGoing}
                />

              <ClassSchedule
                classDays={this.props.days}
                schedule={this.props.scheduleType}
                />

              <Description>
                {this.props.description}
              </Description>
            </div>

            {(this.state.addToCalendar && this.state.scheduleTypeOnGoing) ?
              (<ClassTimeButton
                icon
                onClick={this.handleAddToMyCalendarButtonClick}
                iconName="perm_contact_calendar"
                label="Add to my Calendar"
                />) :
                (<ClassTimeButton
                  ghost
                  icon
                  onClick={this.handleRemoveFromCalendarButtonClick}
                  iconName="delete"
                  label="Remove from Calendar"
                />)
              }
            {this.props.isTrending && <Trending />}
            </ClassContainer>
        );
    }
}

ClassTime.propTypes = {
  time: PropTypes.string.isRequired,
  timePeriod: PropTypes.string.isRequired,
  days: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  addToCalendar: PropTypes.bool.isRequired,
  scheduleType: PropTypes.string.isRequired,
  isTrending: PropTypes.bool
}

export default ClassTime;
