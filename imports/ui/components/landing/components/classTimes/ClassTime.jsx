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
import { isEmpty, get } from 'lodash';
import Events from '/imports/util/events';


import * as helpers from '../jss/helpers.js';

const ON_GOING_SCHEDULE = 'ongoing';
const DAYS_IN_WEEK = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

const ClassTimeContainer = styled.div`
  width: 250px;
  min-height: 430px;
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
  padding: 0 ${props => props.fullTextState ? helpers.rhythmDiv * 2 : helpers.rhythmDiv * 2}px;
  max-height: 120px;
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
    addToCalendar : this.props.addToCalendar,
    scheduleTypeOnGoing: _isClassOnGoing(this.props.scheduleType),
    fullTextState: this.props.fullTextState,
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
    console.log("this.props.handleAddToMyCalendarButtonClick",this.props);
    this.addToMyCalender(this.props.classTimeData);
  }

  handleRemoveFromCalendarButtonClick = () => {

    this.setState({
      addToCalendar: true
    });
    console.log("this.props",this.props);
    this.removeFromMyCalender(this.props.classTimeData);
  }

  componentWillReceiveProps = (newProps) => {
    if(this.state.fullTextState !== newProps.fullTextState) {
      this.setState({
        fullTextState: newProps.fullTextState,
        scheduleTypeOnGoing: _isClassOnGoing(newProps.scheduleTypeOnGoing)
      });
    }
  }

  formatDataBasedOnScheduleType = (data) => {
    const classTimesData = {...data};
    // console.log("formatDataBasedOnScheduleType________", data);
      let classTimes;
      if(data && data.scheduleDetails && data.scheduleDetails.oneTime) {
        classTimes = {};
        let schoolDetails = data.scheduleDetails.oneTime;
        let startDate, dayOfTheWeek, day, startTime, formattedTime, timePeriod, currentJsonData;
        schoolDetails.forEach((item) => {
          startDate = new Date(item.startDate);
          dayOfTheWeek = startDate.getDay(); // day of the week (from 0 to 6)
          day = DAYS_IN_WEEK[dayOfTheWeek - 1];
          startTime = new Date(item.startTime); // Get Time from date time
          formattedTime = this.formatTime(startTime);
          timePeriod = this.formatAMPM(startTime);
          currentJsonData = {
            time: formattedTime,
            timePeriod: timePeriod,
            duration: item.duration,
            date: `${startDate}`
          };
          if(classTimes && classTimes[day]) {
            let existingTimes = classTimes[day];
            existingTimes.push(currentJsonData);
            classTimes[day] = existingTimes;
          } else {
            classTimes[day] = [];
            classTimes[day].push(currentJsonData);
          }
          // this.handleSliderState(dayOfTheWeek - 1);
        })
        return classTimes;
      } else {
        return data.scheduleDetails;
      }
  }

  formatAMPM = (startTime) => {
      let hours = startTime.getHours();
      let ampm = hours >= 12 ? 'pm' : 'am';
      return ampm;
  }
  formatTime = (startTime) => {
    const hours = startTime.getHours();
    let hour  = hours > 12 ? hours - 12 : hours;
    hour = hour < 10 ? '0' + hour : hour;
    let minutes = startTime.getMinutes() === 0 ? "00" : startTime.getMinutes();
    return `${hour}:${minutes}`;
  }

  _getWrapperClassName = (addToCalendar,scheduleTypeOnGoing) => (addToCalendar && scheduleTypeOnGoing) ? 'add-to-calendar' : 'remove-from-calendar';

  removeFromMyCalender = (classTimeRec) => {
    console.log("this.props",this.props,classTimeRec);
    const result = this.props.classInterestData.filter(data => data.classTimeId  == classTimeRec._id);
    console.log("result==>",result);
    // check for user login or not
    const userId = Meteor.userId()
    if(!isEmpty(userId)) {
        const doc = {
            _id: result[0]._id,
             userId,
        }
        this.handleClassInterest({
            methodName:"classInterest.removeClassInterest",
            data: {doc}
        })
    } else {
        alert("Please login !!!!")
    }
  }
  addToMyCalender = (data) => {
    // check for user login or not
    console.log("addToMyCalender",data);
    const userId = Meteor.userId();
    if(!isEmpty(userId)) {
        const doc = {
            classTimeId: data._id,
            classTypeId: data.classTypeId,
            schoolId: data.schoolId,
            userId,
        }
        this.handleClassInterest({
            methodName:"classInterest.addClassInterest",
            data: {doc}
        })
    } else {
        // alert("Please login !!!!")
        Events.trigger("loginAsUser");
    }
  }
    handleClassInterest = ({methodName, data}) => {
      console.log("handleClassInterest",methodName,data);
      Meteor.call(methodName, data, (err, res) => {
          console.log(res,err);
      })
    }


  _getWrapperClassName = (addToCalendar,scheduleTypeOnGoing) => (addToCalendar && scheduleTypeOnGoing) ? 'add-to-calendar' : 'remove-from-calendar';

  _getOuterClockClassName = (addToCalendar,scheduleTypeOnGoing) => (addToCalendar && scheduleTypeOnGoing) ? 'add-to-calendar-clock' : 'remove-from-calendar-clock';

  _getDotColor = (addToCalendar, scheduleTypeOnGoing) => (addToCalendar && scheduleTypeOnGoing) ? helpers.primaryColor : helpers.cancel;

  _getCalenderButton = (addToCalender,scheduleTypeOnGoing) => {
    const addToMyCalender = this.props.addToCalender;
    const iconName = addToMyCalender ? "add_circle_outline": "delete";
    // const label = addToMyCalender ? "Remove from Calender" :  "Add to my Calendar";
    if(addToMyCalender) {
      return (
         <ClassTimeButton
              icon
              onClick={this.handleAddToMyCalendarButtonClick}
              label="Add to my Calender"
              iconName={iconName}
          />
      )
      } else {
        return (
           <ClassTimeButton
              icon
              onClick={this.handleRemoveFromCalendarButtonClick}
              label="Remove from calendar"
              iconName={iconName}
          />
        )
      }
    return (
      <div></div>
    )
  }

  render() {
    console.log("ClassTime props -->>",this.props);
    const classNameForClock = this._getOuterClockClassName(this.state.addToCalendar, this.state.scheduleTypeOnGoing);
    const dotColor = this._getDotColor(this.state.addToCalendar, this.state.scheduleTypeOnGoing);
    return (<ClassTimeContainer className={`class-time-bg-transition ${this._getWrapperClassName(this.state.addToCalendar,this.state.scheduleTypeOnGoing)}`}
            key={this.props._id} >
            <div>
              <ClassTimeClockManager
                formattedClassTimes={this.formatDataBasedOnScheduleType(this.props)}
                scheduleType={this.props.scheduleType}
                classTimes={this.props.classTimes}
                clockProps={{ className: classNameForClock, dotColor: dotColor }}
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

            {this._getCalenderButton(this.state.addToCalendar, this.state.scheduleTypeOnGoing, this.props)}

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
  addToCalendar: PropTypes.bool.isRequired,
  scheduleType: PropTypes.string.isRequired,
  isTrending: PropTypes.bool
}


export default withShowMoreText(ClassTime, { description: "desc"});
