import React,{Component,Fragment} from 'react';
import moment from 'moment';
import styled, {keyframes} from 'styled-components';
import PropTypes from 'prop-types';
import { isEmpty, get } from 'lodash';

import ClassTimeClockManager from '/imports/ui/components/landing/components/classTimes/ClassTimeClockManager.jsx';
import ClassTimesCard from '/imports/ui/components/landing/components/cards/ClassTimesCard.jsx';
import TrendingIcon from '/imports/ui/components/landing/components/icons/Trending.jsx';

import PrimaryButton from '/imports/ui/components/landing/components/buttons/PrimaryButton';
import SecondaryButton from '/imports/ui/components/landing/components/buttons/SecondaryButton';
import ClassTimeButton from '/imports/ui/components/landing/components/buttons/ClassTimeButton.jsx';

import Events from '/imports/util/events';
import {toastrModal, formatDate, formatTime} from '/imports/util';
import { ContainerLoader } from '/imports/ui/loading/container.js';

import { DAYS_IN_WEEK, CLASS_TIMES_CARD_WIDTH } from '/imports/ui/components/landing/constants/classTypeConstants.js';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const ClassTimeContainer = styled.div`
  width: ${CLASS_TIMES_CARD_WIDTH}px;
  height: 420px;
  padding: ${helpers.rhythmDiv}px;
  padding: ${helpers.rhythmDiv * 2}px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 0;
  // overflow-y: auto;

  // ${props => props.showCard ? 'filter: blur(2px)' : ''};

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
    margin: 0 auto;
  }

`;

const ClassTimeContainerOuterWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
`;

const ClassScheduleWrapper = styled.div`
  ${helpers.flexCenter}
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const ScheduleAndDescriptionWrapper = styled.div`
  max-height: 330px; // This is the computed max-height for the container.
  display: flex;
  flex-direction: column;
  ${props => props.showCard ? 'filter : blur(2px)' : ''};
`;

const ScheduleWrapper = styled.div`
  flex-shrink: 0;
`;

const DescriptionWrapper = styled.div`
  flex-grow: 1;
  display: flex;
`;

const ClassTypeName = styled.h4`
  width: 100%;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv}px;
  line-height: 1;
  color: ${helpers.black};
  font-family: ${helpers.specialFont};
  font-weight: 400;
  font-size: ${helpers.baseFontSize * 1.25}px;
  text-align: center;
  text-transform: capitalize;
  // ${props => props.showCard ? 'opacity: 0' : 'opacity: 1'};
`;

const ScheduleType = ClassTypeName.withComponent('p').extend`
  font-weight: 300;
`;

// const ClassTypeNameNoBlurred = ClassTypeName.extend`
//   ${props => !props.showCard ? 'opacity: 0' : 'opacity: 1'};
//   display : ${props => props.showCard ? 'flex' : 'none'};
//   justify-content: center;
//   position: absolute;
//   top: 16px;
// `;

const Description = styled.p`
  margin: ${helpers.rhythmDiv}px 0;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  font-weight: 400;
  padding: 0 ${helpers.rhythmDiv * 2}px;
  overflow-y: auto;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: ${helpers.rhythmDiv}px;
  transition: 0.1s ease-in opacity;
  ${props => props.showCard ? 'opacity: 0' : 'opacity: 1'};
`;

const TrendingWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  right: ${helpers.rhythmDiv * 2}px;
  left: auto;
`;

const ClassTimesCardWrapper = styled.div`
  position: absolute;
  padding: 0 ${helpers.rhythmDiv}px;
  display: flex;
  flex-direction: column;
  max-height: 296px;
  top: 64px;
`;

const Trending = () => {
  return (
    <TrendingWrapper>
      <TrendingIcon />
    </TrendingWrapper>
  )
}

class ClassTime extends Component {

  state = {
    isLoading: false,
    // fullTextState: this.props.fullTextState,
  }

  handleAddToMyCalendarButtonClick = () => {
    // console.log("this.props.handleAddToMyCalendarButtonClick",this.props);
    const classTimeData = {...this.props};
    this.addToMyCalender(classTimeData);
  }

  handleRemoveFromCalendarButtonClick = () => {

    // this.setState({ addToCalendar: true });
    // console.log("this.props",this.props)
    const classTimeData = {...this.props};
    this.removeFromMyCalender(classTimeData);
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
          formattedTime = formatTime(startTime);
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

  // formatTime = (startTime) => {
  //   const hours = startTime.getHours();
  //   const mins = startTime.getMinutes();
  //   let hour  = hours > 12 ? hours - 12 : hours;
  //   hour = hour < 10 ? '0' + hour : hour;
  //   let minutes = mins < 10 ? "0"+ mins : mins;
  //   console.log(startTime,moment(startTime).format("hh:mm"),`${hour}:${minutes}`,"------------");
  //   return `${hour}:${minutes}`;
  // }

  // formatTime = (startTime) => {
  //   console.log(startTime,moment(startTime).format("hh:mm"),`ajsdkjflasjdflj`,"------------");
  //   return `${moment(startTime).format("hh:mm")}`;
  // }
  //
  // formatDate = (date) => {
  //   // console.info(date, moment(date).format('DD-MM-YYYY'), ";;;;;;;;;;");
  //   return moment(date).format('MMMM DD, YYYY');
  // }

  // showDescription = (formattedClassTimes) => {
  //   dataCounter = 0;
  //   for (day in formattedClassTimes) {
  //     if(formattedClassTimes.hasOwnProperty(day)) {
  //       dataCounter += formattedClassTimes[day].length;
  //     }
  //
  //     if(dataCounter > 1) {
  //       return false;
  //     }
  //   }
  //
  //   return true;
  // }

  removeFromMyCalender = (classTimeRec) => {
    const {toastr} = this.props;
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
        toastr.error("Please login !","Error");
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
    this.setState({isLoading: true});
    Meteor.call(methodName, data, (err, res) => {
      const {toastr} = this.props;
      this.setState({isLoading: false});
      if(err) {
        toastr.error(err.message,"Error");
      }else {
        if(methodName.indexOf('remove') !== -1)
          toastr.success("Class removed successfully","Success");
        else
          toastr.success("Class added to your calendar","Success");
      }
    })
  }

  handleShowCard = (state) => () => {
    this.setState({
      showCard: state
    })
  }

  _getWrapperClassName = (addToCalendar) => (addToCalendar) ? 'add-to-calendar' : 'remove-from-calendar';

  _getOuterClockClassName = (addToCalendar) => (addToCalendar) ? 'add-to-calendar-clock' : 'remove-from-calendar-clock';

  _getDotColor = (addToCalendar) => (addToCalendar) ? helpers.primaryColor : helpers.cancel;

  _getCalenderButton = (addToCalender) => {
    const iconName = addToCalender ? "add_circle_outline": "delete";
    // const label = addToCalender ? "Remove from Calender" :  "Add to my Calendar";
    if(addToCalender || !Meteor.userId()) {
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
              ghost
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
    // console.log("ClassTime props -->>",this.props);
    const { desc , startDate, endDate, scheduleType, name } = this.props;
    const formattedClassTimes = this.formatDataBasedOnScheduleType(this.props);
    // const showDescription = this.showDescription(formattedClassTimes);
    const classNameForClock = this._getOuterClockClassName(this.props.addToCalendar);
    const dotColor = this._getDotColor(this.props.addToCalendar);
    return (<ClassTimeContainerOuterWrapper>
      {this.state.isLoading && <ContainerLoader />}
      {/*<ClassTypeNameNoBlurred showCard={this.state.showCard}>{name}</ClassTypeNameNoBlurred> */}

      <ClassTimeContainer
        className={`class-time-bg-transition ${this._getWrapperClassName(this.props.addToCalendar)}`}
        key={this.props._id} >
          {/* class type name */}
          <div>
            <ClassTypeName>{name}</ClassTypeName>
            <ScheduleType>{scheduleType}</ScheduleType>
          </div>

          {/* View All times button */}
          <ButtonsWrapper>
            {this._getCalenderButton(this.props.addToCalendar)}
          </ButtonsWrapper>

          {this.props.isTrending && <Trending />}
      </ClassTimeContainer>

      <ClassTimesCardWrapper>
        <ClassTimesCard
          show={true}
          formattedClassTimes={formattedClassTimes}
          scheduleType={scheduleType}
          description={desc}
          onClose={this.handleShowCard(false)} />
      </ClassTimesCardWrapper>
      </ClassTimeContainerOuterWrapper>)
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


// export default toastrModal(withShowMoreText(ClassTime, { description: "desc"}));
export default toastrModal(ClassTime);
