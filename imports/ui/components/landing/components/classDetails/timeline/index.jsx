import React, { PureComponent } from "react";
import { Meteor } from "meteor/meteor";
import styled from "styled-components";
import Activity from "./Activity.jsx";
import moment from "moment";

import {
  Heading,
  Italic,
  SubHeading,
  Text
} from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const calculateElapsedTime = startTime => {
  // startTime is expected to be a date Obj with proper Time information stored in it
  if (startTime) {
    const startTimeMoment = moment(new Date());
    const currentTimeMoment = moment(new Date());
    return startTimeMoment.diff(currentTimeMoment, "minutes");
  }

  return -1;
};

const Wrapper = styled.div`
  padding: 0 ${helpers.rhythmDiv * 2}px;
  margin-bottom: ${helpers.rhythmDiv * 4}px;
`;

const ActivitiesWrapper = styled.div`
  height: ${props => props.length}px;

  @media screen and (min-width: ${helpers.tablet}px) {
    width: calc(100vw - 48px);
    height: 300px;
    display: flex;
  }
`;

const Title = styled.div`
  /* prettier-ignore */
  ${helpers.flexHorizontalSpaceBetween}
`;

const TotalTime = styled.div``;

const TotalTimeText = Text.extend`
  font-size: ${helpers.baseFontSize * 1.25}px;

  @media screen and (min-width: ${helpers.mobile}px) {
    font-size: ${helpers.baseFontSize * 1.5}px;
  }
`;

const TotalTimeInMins = TotalTimeText.extend`
  font-weight: 600;
`;

class TimeLineContainer extends PureComponent {
  constructor(props) {
    super(props);
    // const memoizeCalculateElapsedTime = memoizeOne(this._calculateElapsedTime);

    this.state = {
      startTime: this.props.startTime,
      totalEventTime: this.props.totalEventTime || -1,
      elapsedTime: -1,
      eventCompleted: false
    };
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    const { totalEventTime, startTime } = nextProps;
    console.group("getDerivedStateFromProps");
    console.log(nextProps, prevState);
    console.groupEnd();
    if (
      startTime !== prevState.startTime ||
      totalEventTime !== prevState.totalEventTime
    ) {
      const elapsedTime = calculateElapsedTime(startTime);
      return {
        startTime: startTime,
        elapsedTime: elapsedTime,
        eventCompleted: elapsedTime > totalEventTime ? true : false
      };
    }
    return null;
  };

  componentDidMount = () => {
    this._startTimeLineCounter();
  };

  _startTimeLineCounter = () => {
    const { startTime, totalEventTime } = this.props;
    const eventElapsedTime = calculateElapsedTime(startTime);
    this.timeLineCounter = Meteor.setInterval(() => {
      const elapsedTime = (this.state.elapsedTime || eventElapsedTime) + 1;
      const eventCompleted = elapsedTime > totalEventTime ? true : false;
      // console.group("set interval , not running");
      // console.log("elapsedTime, eventCompleted, ", elapsedTime, eventCompleted);
      // console.groupEnd();
      this.setState(state => {
        return {
          ...state,
          elapsedTime,
          eventCompleted
        };
      });
    }, 1000);
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (!this.timeLineCounter && !this.state.eventCompleted) {
      this._startTimeLineCounter();
    } else if (this.timeLineCounter && this.state.eventCompleted) {
      Meteor.clearInterval(this.timeLineCounter);
    }
  };

  componentWillUnMount = () => {
    Meteor.clearInterval(this.timeLineCounter);
  };

  getClassModulesActivites = () => {
    const { totalEventTime, classModulesData } = this.props;
    let { elapsedTime, eventCompleted } = this.state;

    return classModulesData.map((moduleData, index) => {
      let currentActivityTimeElapsed = 0;
      console.group("total time elapsed");
      console.log(elapsedTime, currentActivityTimeElapsed, moduleData.time);
      console.groupEnd();
      if (elapsedTime >= totalEventTime) {
        currentActivityTimeElapsed = moduleData.time;
        // elapsedTime = moduleData.time;
      } else if (elapsedTime < 0) {
        currentActivityTimeElapsed = 0;
        elapsedTime = -1;
      } else if (
        elapsedTime > moduleData.time &&
        elapsedTime < totalEventTime
      ) {
        currentActivityTimeElapsed = moduleData.time;
        elapsedTime -= moduleData.time;
      } else {
        currentActivityTimeElapsed = elapsedTime;
        elapsedTime = 0;
      }

      // Getting the sizes in percent;
      const totalActivityLength = (moduleData.time / totalEventTime) * 100;
      const currentActivityNodeLength =
        (currentActivityTimeElapsed / moduleData.time) * 100;
      const even = index % 2 == 0;

      return (
        <Activity
          {...moduleData}
          key={index}
          color={even ? helpers.primaryColor : helpers.information}
          leftSide={even}
          timeElapsedLength={currentActivityNodeLength}
          totalTimeLength={totalActivityLength}
        />
      );
    });
  };

  render() {
    const { totalEventTime, startTime } = this.props;
    return (
      <Wrapper>
        <Title>
          <Heading>
            <Italic>Class Modules</Italic>
          </Heading>
          <TotalTime>
            <TotalTimeText>Total Time</TotalTimeText>
            <TotalTimeInMins>{totalEventTime} mins</TotalTimeInMins>
          </TotalTime>
        </Title>
        <ActivitiesWrapper length={totalEventTime * 10}>
          {this.getClassModulesActivites()}
        </ActivitiesWrapper>
      </Wrapper>
    );
  }
}

export default TimeLineContainer;
