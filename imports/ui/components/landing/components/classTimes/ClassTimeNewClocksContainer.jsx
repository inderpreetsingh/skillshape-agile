import React , {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import ClassTimeNewClock from './ClassTimeNewClock.jsx';

import * as helpers from '../jss/helpers.js';
import { DAYS_IN_WEEK } from '/imports/ui/components/landing/constants/daysInWeek.js';

const Container = styled.div`
  ${helpers.flexCenter}
  width: 100%;
  min-height: ${props => props.minHeight}px;
  position: relative;
  transition: .2s linear min-height;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

class ClassTimeNewClocksContainer extends Component {

  state = {
    minHeight: 160
  }

  updateContainerHeight = (height) => {
    // debugger;
    if(this.state.minHeight !== height)
      this.setState({ minHeight: height});
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

  render() {
    const {formattedClassTimes, scheduleType, scheduleStartDate, scheduleEndDate, currentIndex, clockProps} = this.props;
    // console.log(formattedClassTimes,"formattedClassTimes...........");
    return (<Container minHeight={this.state.minHeight}>
        {/*formattedClassTimes && DAYS_IN_WEEK.map((day,i) => {
          if(formattedClassTimes[day]) {
            return (<ClassTimeNewClock
              key={i}
              currentDay={day}
              scheduleType={scheduleType}
              scheduleStartDate={scheduleStartDate}
              scheduleEndDate={scheduleEndDate}
              scheduleData={formattedClassTimes[day]}
              visible={i === this.props.currentIndex}
              clockProps={clockProps}
              updateContainerHeight={this.updateContainerHeight}
              />)
          }
          return null;
        })*/}

        <ClassTimeNewClock
          scheduleType={scheduleType}
          scheduleStartDate={scheduleStartDate}
          scheduleEndDate={scheduleEndDate}
          formattedClassTimes={formattedClassTimes}
          totalClocks={this.getTotalNoOfClocks()}
          clockProps={clockProps}
          updateContainerHeight={this.updateContainerHeight}
        />

      </Container>)
  }
}

export default ClassTimeNewClocksContainer;
