import React , {Component,Fragment} from 'react';
import {isEqual,isEmpty} from 'lodash';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import * as helpers from '../jss/helpers.js';
import ClassTimeNewClock from './ClassTimeNewClock.jsx';
import ClassTimeNewClocksContainer from './ClassTimeNewClocksContainer.jsx';

import { DAYS_IN_WEEK } from '/imports/ui/components/landing/constants/daysInWeek.js';

const ONE_TIME = 'onetime';

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

const ClockWrapper = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const ChangeSlide = styled.div`
  width: 100%;
  font-family: ${helpers.specialFont};
  ${helpers.flexCenter}
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const Days = styled.p`
  ${helpers.flexCenter}
  margin: 0;
`;

const Day = styled.p`
  ${helpers.flexCenter}
  margin: 0;
  margin-right: ${helpers.rhythmDiv/2}px;
  font-size: 12px;
  line-height: 1;
  font-family: ${helpers.specialFont};
  font-weight: 500;
  width: 28px;
  height: 28px;
  text-transform: capitalize;
  cursor: pointer;
  border-radius: 50%;
  padding: ${helpers.rhythmDiv}px;
  border: 1px solid ${props => props.active ? helpers.primaryColor : `rgba(${helpers.classTimeClockButtonColor},0.8)` };
  color: ${props => props.active ? helpers.primaryColor : `rgba(${helpers.classTimeClockButtonColor},0.8)` };

  &:last-of-type {
    margin-right: 0;
  }
`;

const ScheduleSeperator = styled.span`
  font-weight: 600;
  margin: 0 ${helpers.rhythmDiv/2}px;
`;

const Schedule = styled.p`
  display: inline-block;
  width: 100%;
  text-align: center;
  margin: 0;
  font-weight: 400;
  font-size: ${helpers.baseFontSize}px;
  text-transform: capitalize;
`;


const Seperator = styled.span`
  font-weight: 400;
`;

class ClassTimeClockManager extends Component {
  state = {
    currentIndex: 0,
    lastIndex: 0
  }

  getDayInShortFormat = (dayDb) => {
    const day = dayDb.toLowerCase();
    return day.substr(0,2);
  }

  getDaysOfWeekFromFormattedClassTimesData = () => {
    const {formattedClassTimes} = this.props;
    return DAYS_IN_WEEK.map((day,i) => {
      // console.log(this.props,'this.props......')

      if(formattedClassTimes[day]){
        const scheduleData = formattedClassTimes[day];

        return(<Day
          key={i}
          active={i === this.state.currentIndex}
          onClick={this.handleDayClick(i)}>
          {this.getDayInShortFormat(day)}
        </Day>)
      }
      return null;
    });
  }

  startAutoMaticSlider = () => {
    this.sliderInterval = setInterval(() => {
      let newIndex = this.state.currentIndex + 1;
      // console.log(newIndex,this.state.lastIndex);

      if(newIndex === this.state.lastIndex) {
        newIndex = 0;
      }

      this.handleSliderState(newIndex);
    },this.state.slideTime);
  }

  handleDayClick = (index) => (e) => {
    e.preventDefault();
    // console.log('clicked',index,"=============");

    this.handleSliderState(index);
  }

  handleSliderState = (newIndex) => {
    this.setState({
      currentIndex: newIndex
    });
  }

  setCurrentSelectedDay = (formattedClassTimes) => {
    let selectedDay = 6;
    if(formattedClassTimes) {
      Object.keys(formattedClassTimes).forEach(day => {
        const currentDay = DAYS_IN_WEEK.indexOf(day);

        if(currentDay < selectedDay) selectedDay = currentDay;

      });

      if(this.state.currentIndex !== selectedDay)
        this.setState({ currentIndex: selectedDay});
    }
  }

  componentDidMount = () => {
    this.setCurrentSelectedDay(this.props.formattedClassTimes);
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
    const { formattedClassTimes } = this.props;
    // console.log('formattedClassTimes',formattedClassTimes);
    return (<Fragment>
        {/*Clock Times*/}
        <OuterWrapper width={this.props.outerWidth}>

            {/* NOTE : This is not to be used when we are using the ClassTimeNewClock */}
            {/* <ClassTimeClock data={this.props.data} visible={this.state.currentIndex} {...this.props.clockProps} /> */}

            <ClassTimeNewClocksContainer
              formattedClassTimes={formattedClassTimes}
              scheduleType={this.props.scheduleType}
              scheduleStartDate={this.props.scheduleStartDate}
              scheduleEndDate={this.props.scheduleEndDate}
              currentIndex={this.state.currentIndex}
              clockProps={this.props.clockProps}
             />

        </OuterWrapper>

        {formattedClassTimes && Object.keys(formattedClassTimes).length > 1 && <ChangeSlide>
          <Days> {this.getDaysOfWeekFromFormattedClassTimesData()} </Days>
        </ChangeSlide>}

        <Schedule>{ this.props.scheduleType.toLowerCase()}</Schedule>
      </Fragment>
    )
  }
}

ClassTimeClockManager.propTypes = {
  classTimes: PropTypes.arrayOf(PropTypes.object),
  scheduleType: PropTypes.string,
}

ClassTimeClockManager.defaultProps = {

}

export default ClassTimeClockManager;
