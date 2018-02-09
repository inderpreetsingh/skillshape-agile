import React,{Component} from 'react';
import styled, {keyframes} from 'styled-components';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';

import TrendingIcon from '../icons/Trending.jsx';
import ShowMore from '../icons/ShowMore.jsx';

import withShowMoreText from '../../../../../util/withShowMoreText.js';

import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';
import ClassTimeButton from '../buttons/ClassTimeButton.jsx';

import * as helpers from '../jss/helpers.js';

const ON_GOING_SCHEDULE = 'Ongoing';

const ClassTimeContainer = styled.div`
  width: 250px;
  min-height: 350px;
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
    top: 0;
    bottom: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    max-width: 250px;
    width: 100%;
    margin: 0 auto;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
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
  border-radius: 50%;
  background: white;
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
  color: inherit;
`;

const TimePeriod = styled.span`
  display: inline-block;
  font-weight: 400;
  font-size: ${helpers.baseFontSize}px;
  transform: translateY(-10px);
  color: inherit;
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

  max-height: 140px;
  overflow-y: ${props => props.fullTextState ? 'scroll' : 'auto'};
`;

const TrendingWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  right: ${helpers.rhythmDiv * 2}px;
  left: auto;
`;

const ClassTimeClock = (props) => (
  <ClockOuterWrapper>
    <ClockWrapper className={`class-time-transition ${props.className}`}>
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

const Read = styled.span`
    font-style: italic;
    cursor: pointer;
`;

_isClassOnGoing = (scheduleType) => scheduleType == ON_GOING_SCHEDULE;

class ClassTime extends Component {

  state = {
    addToCalendar : this.props.addToCalendar,
    scheduleTypeOnGoing: _isClassOnGoing(this.props.scheduleType),
    fullTextState: this.props.fullTextState,
    showReadMore: this.props.showReadMore
  }

  componentDidMount = () => {
    // console.info('Show me state',this.state);
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

    this.setState({
      addToCalendar: true
    });

    if(this.props.onRemoveFromCalendarButtonClick) {
      this.props.onRemoveFromCalendarButtonClick();
    }
  }

  componentWillReceiveProps = (newProps) => {
    if(this.state.fullTextState !== newProps.fullTextState) {
      this.setState({
        fullTextState: newProps.fullTextState
      });
    }
  }

  _getWrapperClassName = (addToCalendar,scheduleTypeOnGoing) => (addToCalendar && scheduleTypeOnGoing) ? 'add-to-calendar' : 'remove-from-calendar';

  _getOuterClockClassName = (addToCalendar,scheduleTypeOnGoing) => (addToCalendar && scheduleTypeOnGoing) ? 'add-to-calendar-clock' : 'remove-from-calendar-clock';

  _getCalenderButton = (addToCalender,scheduleTypeOnGoing) => {
    if(scheduleTypeOnGoing && addToCalender) {
      return (<ClassTimeButton
        icon
        onClick={this.handleAddToMyCalendarButtonClick}
        iconName="perm_contact_calendar"
        label="Add to my Calendar"
      />);
    }else if(scheduleTypeOnGoing && !addToCalender) {
      return (<ClassTimeButton
        ghost
        icon
        onClick={this.handleRemoveFromCalendarButtonClick}
        iconName="delete"
        label="Remove from Calendar"
      />)
    }
    else if(!scheduleTypeOnGoing && !addToCalender) {
      return (
        <ClassTimeButton
          ghost
          icon
          onClick={this.handleRemoveFromCalendarButtonClick}
          iconName="delete"
          label="Remove from Calendar"
        />
      )
    }

    return (
      <div></div>
    )
  }

  render() {
    console.log(this.state.addToCalendar);
    return (<ClassTimeContainer className={`class-time-bg-transition ${this._getWrapperClassName(this.state.addToCalendar,this.state.scheduleTypeOnGoing)}`}
            key={this.props._id} >
            <div>
              <ClassTimeClock
                time={this.props.time}
                timePeriod={this.props.timePeriod}
                className={this._getOuterClockClassName(this.state.addToCalendar, this.state.scheduleTypeOnGoing)}
              />

              <ClassSchedule
                classDays={this.props.days}
                schedule={this.props.scheduleType}
                />

              {this.props.showReadMore ?
                <Description fullTextState={this.state.fullTextState}>
                  {this.props.getDescriptionText()}
                  {this.props.getShowMoreText()}
                </Description>
                :
                <Description>
                  {this.props.fullText}
                </Description>}
            </div>

            {this._getCalenderButton(this.state.addToCalendar, this.state.scheduleTypeOnGoing)}

            {this.props.isTrending && <Trending />}
        </ClassTimeContainer>)
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

export default withShowMoreText(ClassTime);
