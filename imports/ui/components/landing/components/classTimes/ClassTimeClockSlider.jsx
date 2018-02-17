import React , {Component,Fragment} from 'react';
import { findDOMNode } from 'react-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import * as helpers from '../jss/helpers.js';
import ClassTimeClock from './ClassTimeClock.jsx';

const InnerWrapper = styled.div`
  width: 100%;
  display: flex;
  margin-left: ${helpers.rhythmDiv}px;
  transition: transform .5s linear;
  transform: translateX(-${props => props.transform}px);
`;

const OuterWrapper = styled.div`
  width: ${props => props.width || 200}px;
  overflow: hidden;
`;

const ClockWrapper = styled.div`
  flex-basis: 100%;
  flex-shrink: 0;
`;

const ChangeSlide = styled.div`
  width: 100%;
  font-family: ${helpers.specialFont};
  ${helpers.flexCenter}
`;

const ScheduleSeperator = styled.span`
  font-weight: 600;
  margin: 0 ${helpers.rhythmDiv/2}px;
`;

const Schedule = styled.span`
  font-weight: 600;
  font-size: ${helpers.baseFontSize}px;
`;

const Days = styled.p`
  ${helpers.flexCenter}
  margin: 0;
`;

const Day = styled.span`
  font-size: ${helpers.baseFontSize}px;
  font-weight: 400;
  text-transform: capitalize;
  cursor: pointer;
  transition: all .1s linear;
  text-shadow: ${props => props.active ? `0 0 .8px #333` : 'none'};
`;

const Seperator = styled.span`
  font-weight: 400;
`;

class ClockTimesClockSlider extends Component {
  state = {
    automatic: this.props.automatic,
    slideTime: 4000,
    daysInWeek: ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'],
    originalData: this.props.data,
    sortedData: this.props.data,
    currentIndex: 0,
    lastIndex: 0
  }

  componentWillMount = () => {
    const sortedData = this._sortDataBasedOnDay(this.state.originalData);
    this.setState({
      sortedData: sortedData,
      lastIndex: sortedData.length
    });
  }

  _getDayInShortFormat = (dayDb) => {
    const day = dayDb.toLowerCase();
    return day.substr(0,2);
  }

  _sortDataBasedOnDay = (sliderData) => {
    const sortedData = [];

    let dayCounter = 0;
    while(dayCounter < 7) {
      const currentDay = this.state.daysInWeek[dayCounter];

      // get the data for current day of the week.
      for(let i = 0; i < sliderData.length; ++i) {
        if(sliderData[i].day.toLowerCase() == currentDay) {
          sortedData.push(sliderData[i]);

          // Remove that day's data from the list.
          sliderData.splice[i,1];

          break;
        }
      }

      // increment the day counter.
      ++dayCounter;
    }
    // console.info(sortedData,"----------------------------------------sorted data");
    return sortedData;
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

  componentDidMount = () => {
    console.log(this.sliderContainer,"slider container");

    if(this.state.automatic) {
      this.startAutoMaticSlider();
    }
  }

  render() {
    return (
      <Fragment>
        <OuterWrapper width={this.props.outerWidth}>
          <InnerWrapper transform={this.state.currentIndex * (this.props.outerWidth || 200)} ref={(container) => {this.sliderContainer = container}}>
            {this.state.sortedData && this.state.sortedData.map((obj,i) => (
              <ClockWrapper key={i}>
                <ClassTimeClock {...obj} {...this.props.clockProps}/>
              </ClockWrapper>
            ))}
          </InnerWrapper>
        </OuterWrapper>
        <ChangeSlide>
          <Days>
            {this.state.sortedData && this.state.sortedData.map((obj,i) => (
              <Day active={i === this.state.currentIndex} onClick={this.handleDayClick(i)} key={i}>
                {this._getDayInShortFormat(obj.day)}
                <Seperator>{i === (this.props.data.length - 1) ? '' : '-'}</Seperator>
              </Day>
            ))}
          </Days>
          <ScheduleSeperator> | </ScheduleSeperator>
          <Schedule>{this.props.schedule}</Schedule>
        </ChangeSlide>
      </Fragment>
    )
  }
}

ClockTimesClockSlider.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  schedule: PropTypes.string,
  automatic: PropTypes.bool,
  slideTime: PropTypes.number
}

ClockTimesClockSlider.defaultProps = {
  automatic: true,
  slideTime: 4000
}

export default ClockTimesClockSlider;
