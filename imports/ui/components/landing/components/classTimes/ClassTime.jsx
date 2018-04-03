import React,{Component} from 'react';
import styled, {keyframes} from 'styled-components';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';

import TrendingIcon from '../icons/Trending.jsx';
import ShowMore from '../icons/ShowMore.jsx';
import withShowMoreText from '../../../../../util/withShowMoreText.js';

import ClassTimeClock from './ClassTimeClock.jsx';
import ClassTimeClockManager from './ClassTimeClockManager.jsx';

import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';
import ClassTimeButton from '../buttons/ClassTimeButton.jsx';

import * as helpers from '../jss/helpers.js';

const ON_GOING_SCHEDULE = 'ongoing';

const ClassTimeContainer = styled.div`
  width: 250px;
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

const ClassScheduleWrapper = styled.div`
  ${helpers.flexCenter}
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const Text = styled.p`
  margin: 0;
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.specialFont};
  font-weight: 600;
  text-transform: capitalize;
`;

const Description = styled.p`
  margin: ${helpers.rhythmDiv}px 0;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  font-weight: 400;
  padding: ${helpers.rhythmDiv * 2}px;
  padding-top: 0;
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

// This can be changed according to the data
_isClassOnGoing = (scheduleType) => scheduleType && scheduleType.toLowerCase().replace(/\-/) === ON_GOING_SCHEDULE;

class ClassTime extends Component {

  state = {
    addedToCalendar : this.props.addedToCalendar,
    scheduleTypeOnGoing: _isClassOnGoing(this.props.scheduleType),
    fullTextState: this.props.fullTextState,
    showReadMore: this.props.showReadMore
  }

  componentDidMount = () => {
    // console.info('Show me state',this.state);
  }

  handleToggleAddToCalendar = () => {
    this.setState({
      addedToCalendar: !this.state.addedToCalendar
    });
  }

  handleAddToMyCalendarButtonClick = () => {

    this.setState({
      addedToCalendar: false
    });


    if(this.props.onAddToMyCalendarButtonClick) {
      this.props.onAddToMyCalendarButtonClick();
    }
  }

  handleRemoveFromCalendarButtonClick = () => {

    this.setState({
      addedToCalendar: true
    });

    if(this.props.onRemoveFromCalendarButtonClick) {
      this.props.onRemoveFromCalendarButtonClick();
    }
  }

  componentWillReceiveProps = (newProps) => {
    if(this.state.fullTextState !== newProps.fullTextState) {
      this.setState({
        fullTextState: newProps.fullTextState,
        scheduleTypeOnGoing: _isClassOnGoing(newProps.scheduleTypeOnGoing)
      });
    }
  }

  _getWrapperClassName = (addedToCalendar,scheduleTypeOnGoing) => (addedToCalendar && scheduleTypeOnGoing) ? 'add-to-calendar' : 'remove-from-calendar';

  _getOuterClockClassName = (addedToCalendar,scheduleTypeOnGoing) => (addedToCalendar && scheduleTypeOnGoing) ? 'add-to-calendar-clock' : 'remove-from-calendar-clock';

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
    console.log("ClassTime props -->>",this.props);
    return (<ClassTimeContainer className={`class-time-bg-transition ${this._getWrapperClassName(this.state.addedToCalendar,this.state.scheduleTypeOnGoing)}`}
            key={this.props._id} >
            <div>
              <ClassTimeClockManager
                data={this.props}
                schedule={this.props.scheduleType}
                clockProps={
                  {
                    className: this._getOuterClockClassName(this.state.addedToCalendar, this.state.scheduleTypeOnGoing)
                  }
                }
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

            {this._getCalenderButton(this.state.addedToCalendar, this.state.scheduleTypeOnGoing)}

            {this.props.isTrending && <Trending />}
        </ClassTimeContainer>)
    }
}

ClassTime.propTypes = {
  classTimes: PropTypes.arrayOf({
    time: PropTypes.string.isRequired,
    timePeriod: PropTypes.string.isRequired,
    day: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired
  }),
  description: PropTypes.string.isRequired,
  addedToCalendar: PropTypes.bool.isRequired,
  scheduleType: PropTypes.string.isRequired,
  isTrending: PropTypes.bool
}


export default withShowMoreText(ClassTime, { description: "desc"});
