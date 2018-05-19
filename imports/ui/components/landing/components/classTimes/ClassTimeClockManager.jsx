import React , {Component,Fragment} from 'react';
import {isEqual,isEmpty} from 'lodash';

import styled from 'styled-components';
import PropTypes from 'prop-types';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
import ClassTimeNewClock from '/imports/ui/components/landing/components/classTimes/ClassTimeNewClock.jsx';

import { DAYS_IN_WEEK } from '/imports/ui/components/landing/constants/classTypeConstants.js';

const ONE_TIME = 'onetime';

const Container = styled.div`
  ${helpers.flexCenter}
  width: 100%;
  min-height: ${props => props.minHeight}px;
  position: relative;
  transition: .2s linear min-height;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const Text = styled.p`
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv}px;
  line-height: 1;
  color: ${helpers.black};
  font-family: ${helpers.specialFont};
  font-weight: 400;
`;

const StartEndDate = Text.extend`
  font-size: ${helpers.baseFontSize}px;
  font-style: italic;
  text-align: center;
`;

const ClassTypeName = Text.extend`
  font-size: ${helpers.baseFontSize * 1.25}px;
  text-align: center;
  text-transform: capitalize;
`;

const OuterWrapper = styled.div`
  width: ${props => props.width || 250}px;
  overflow: hidden;
`;
const InnerWrapper = styled.div`
  ${helpers.flexCenter}
  width: 100%;
  min-height: 160px;
  position: relative;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

class ClassTimeClockManager extends Component {
  state = {
    currentClockIndex: 0,
    currentDayIndex: 0
  }

  _getIndexForDay = (day) => {
    return DAYS_IN_WEEK.indexOf(day);
  }

  getDayInShortFormat = (dayDb) => {
    const day = dayDb.toLowerCase();
    return day.substr(0,2);
  }

  getTotalNoOfClocks = () => {
    const {formattedClassTimes} = this.props;
    let clockCounter = 0;

    DAYS_IN_WEEK.map((day,i) => {
      const scheduleData = formattedClassTimes[day];
      if(scheduleData) {
        scheduleData.forEach((schedule,i) => {
          ++clockCounter;
        });
      }
    });

    return clockCounter;
  }

  handleDayClick = (clockIndex,dayIndex) => (e) => {
    e.preventDefault();
    console.log('clicked',clockIndex,dayIndex,"=============");

    this.handleSliderState(clockIndex,dayIndex);
  }

  handleSliderState = (newClockIndex,newDayIndex) => {
    if(this.state.currentClockIndex !== newClockIndex || this.state.currentDayIndex !== newDayIndex) {
      this.setState({
        currentClockIndex: newClockIndex,
        currentDayIndex: newDayIndex
      });
    }
  }

  setCurrentSelectedDay = () => {
    const {formattedClassTimes} = this.props;
    let selectedDay = 6;

    if(formattedClassTimes) {
      Object.keys(formattedClassTimes).forEach(day => {
        const currentDay = this._getIndexForDay(day);

        if(currentDay < selectedDay) selectedDay = currentDay;

      });

      if(this.state.currentDayIndex !== selectedDay)
        this.setState({ currentDayIndex: selectedDay});
    }
  }

  componentDidMount = () => {
    this.setCurrentSelectedDay();
  }

  componentWillReceiveProps = (nextProps) => {
    const currentClassTimesData = this.props.formattedClassTimes;
    const nextClassTimesData = nextProps.formattedClassTimes;
    if(!isEqual(Object.keys(currentClassTimesData),Object.keys(nextClassTimesData))) {
      this.setCurrentSelectedDay(nextProps.formattedClassTimes);
    }
  }

  render() {
    // console.log(' clock times clock manager -----> ',this.props.formattedClassTimes,".....");
    const { scheduleType, description, scheduleEndDate, scheduleStartDate, clockProps, formattedClassTimes, classTypeName } = this.props;
    // console.log('formattedClassTimes',formattedClassTimes);
    const scheduleTypeLowerCase = scheduleType.toLowerCase();
    return (<Fragment>
        {/*Clock Times*/}
        <OuterWrapper width={this.props.outerWidth}>

        {/* class type name */}
        {/*<ClassTypeName>{classTypeName}</ClassTypeName> */}

        {/* For recurring schedule only */}
        {scheduleTypeLowerCase === 'recurring' && <StartEndDate>{scheduleStartDate} - {scheduleEndDate} </StartEndDate>}

        {/* <ClassTimeClock data={this.props.data} visible={this.state.currentClockIndex} {...this.props.clockProps} /> */}
          <Container>
           <ClassTimeNewClock
             scheduleType={scheduleType}
             scheduleStartDate={scheduleStartDate}
             scheduleEndDate={scheduleEndDate}
             formattedClassTimes={formattedClassTimes}
             totalClocks={this.getTotalNoOfClocks()}
             clockProps={clockProps}
             updateClockAndDayIndex={this.handleSliderState}
             currentClockIndex={this.state.currentClockIndex}
             currentDayIndex={this.state.currentDayIndex}
           />
          </Container>
        </OuterWrapper>
    </Fragment>)
  }
}

ClassTimeClockManager.propTypes = {
  classTimes: PropTypes.arrayOf(PropTypes.object),
  scheduleType: PropTypes.string,
}

ClassTimeClockManager.defaultProps = {

}

export default ClassTimeClockManager;
