import React , {Component,Fragment} from 'react';
import { findDOMNode } from 'react-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import * as helpers from '../jss/helpers.js';
import ClassTimeClocks from './ClassTimeClock.jsx';

const OuterWrapper = styled.div`
  width: ${props => props.width || 250}px;
  overflow: hidden;
`;
const InnerWrapper = styled.div`
  width: 100%;
  min-height: 140px;
  position: relative;
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
  margin-top: ${helpers.rhythmDiv}px;
  font-weight: 400;
  font-size: ${helpers.baseFontSize}px;
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
  font-weight: 400;
  width: 28px;
  height: 28px;
  text-transform: capitalize;
  cursor: pointer;
  border-radius: 50%;
  padding: ${helpers.rhythmDiv}px;
  background-color: ${props => props.active ? helpers.primaryColor : `rgba(${helpers.classTimeClockButtonColor},0.8)` };
  border: 1px solid ${props => props.active ? helpers.primaryColor : `rgba(${helpers.classTimeClockButtonColor},0.8)` };
  color: ${helpers.lightTextColor};

  &:last-of-type {
    margin-right: 0;
  }
`;

const Seperator = styled.span`
  font-weight: 400;
`;

class ClassTimeClockManager extends Component {
  state = {
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
  }

  render() {
    return (
      <Fragment>
        {/*Clock Times*/}
        <OuterWrapper width={this.props.outerWidth}>
          <InnerWrapper>
            <ClassTimeClocks data={this.state.sortedData} visible={this.state.currentIndex} {...this.props.clockProps}/>
          </InnerWrapper>
        </OuterWrapper>

        <ChangeSlide>
          <Days>
            {this.state.sortedData && this.state.sortedData.map((obj,i) => (
              <Day
                key={i}
                active={i === this.state.currentIndex}
                onClick={this.handleDayClick(i)}>
                {this._getDayInShortFormat(obj.day)}
              </Day>
            ))}
          </Days>
        </ChangeSlide>

        <Schedule>{this.props.schedule}</Schedule>
      </Fragment>
    )
  }
}

ClassTimeClockManager.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  schedule: PropTypes.string,
  automatic: PropTypes.bool,
  slideTime: PropTypes.number
}

ClassTimeClockManager.defaultProps = {
  automatic: true,
  slideTime: 4000
}

export default ClassTimeClockManager;
