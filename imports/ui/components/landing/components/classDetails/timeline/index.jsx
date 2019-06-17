import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Activity from './Activity';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import {
  Heading,
  Italic,
  Text,
} from '/imports/ui/components/landing/components/jss/sharedStyledComponents';

const calculateElapsedTime = (startTime) => {
  // startTime is expected to be a date Obj with proper Time information stored in it
  if (startTime) {
    const startTimeMoment = moment(new Date()).add(75, 'm');
    const currentTimeMoment = moment(new Date());
    return startTimeMoment.diff(currentTimeMoment, 'minutes');
  }

  return -1;
};
const Wrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv * 8}px;
`;

const OuterActivitesWrapper = styled.div`
  background: ${helpers.panelColor};
`;

const ActivitiesWrapper = styled.div`
  padding: 0 ${helpers.rhythmDiv * 2}px;
  height: ${props => props.length}px;

  @media screen and (min-width: ${helpers.tablet}px) {
    width: 100%;
    height: 300px;
    display: flex;
  }
`;

const Title = styled.div`
  /* prettier-ignore */
  ${helpers.flexHorizontalSpaceBetween}
  padding: 0 ${helpers.rhythmDiv * 2}px;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const TotalTime = styled.div`
  @media screen and (min-width: ${helpers.tablet}px) {
    ${helpers.flexCenter};
  }
`;

const TotalTimeText = Text.extend`
  font-size: ${helpers.baseFontSize * 1.25}px;

  @media screen and (min-width: ${helpers.mobile}px) {
    font-size: ${helpers.baseFontSize * 1.5}px;
  }

  @media screen and (min-width: ${helpers.tablet}px) {
    margin-right: ${helpers.rhythmDiv}px;
  }
`;

const TotalTimeInMins = TotalTimeText.extend`
  font-weight: 600;
`;

// elapsedTime is -ve in case the class (event) hasn't started and is +ve
// depending upon how much time we are ahead of the class.
class TimeLineContainer extends PureComponent {
  constructor(props) {
    super(props);
    const { startTime, totalEventTime } = this.props;
    const elapsedTime = calculateElapsedTime(startTime);

    this.state = {
      elapsedTime,
      eventCompleted: elapsedTime > totalEventTime,
    };
  }

  _startTimeLineCounter = () => {
    const { startTime, totalEventTime } = this.props;
    const eventElapsedTime = calculateElapsedTime(startTime);

    this.timeLineCounter = Meteor.setInterval(() => {
      const elapsedTime = (this.state.elapsedTime || eventElapsedTime) + 1;
      const eventCompleted = elapsedTime > totalEventTime;

      this.setState(state => ({
        ...state,
        elapsedTime,
        eventCompleted,
      }));
    }, 1000);
  };

  componentDidMount = () => {
    if (this.props.startTime) this._startTimeLineCounter();
  };

  componentDidUpdate = () => {
    if (!this.timeLineCounter && this.props.startTime) {
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
    let { elapsedTime } = this.state;
    if (classModulesData) {
      return classModulesData.map((moduleData, index) => {
        let currentActivityTimeElapsed = 0;
        if (elapsedTime >= totalEventTime) {
          currentActivityTimeElapsed = moduleData.time;
          // elapsedTime = moduleData.time;
        } else if (elapsedTime < 0) {
          currentActivityTimeElapsed = 0;
          elapsedTime = -1;
        } else if (elapsedTime > moduleData.time && elapsedTime < totalEventTime) {
          currentActivityTimeElapsed = moduleData.time;
          elapsedTime -= moduleData.time;
        } else {
          currentActivityTimeElapsed = elapsedTime;
          elapsedTime = 0;
        }

        // Getting the sizes in percent;
        const totalActivityLength = (moduleData.time / totalEventTime) * 100;
        const currentActivityNodeLength = (currentActivityTimeElapsed / moduleData.time) * 100;
        const even = index % 2 == 0;

        return (
          <Activity
            {...moduleData}
            key={index}
            color={even ? helpers.primaryColor : helpers.information}
            evenPosition={even}
            timeElapsedLength={currentActivityNodeLength}
            totalTimeLength={totalActivityLength}
          />
        );
      });
    }
  };

  render() {
    const { totalEventTime, durationAndTimeunits } = this.props;
    return (
      <Wrapper>
        <Title>
          <Heading>
            <Italic>Class Modules</Italic>
          </Heading>
          <TotalTime>
            <TotalTimeText>Total Time:</TotalTimeText>
            <TotalTimeInMins>{durationAndTimeunits}</TotalTimeInMins>
          </TotalTime>
        </Title>
        <OuterActivitesWrapper>
          <ActivitiesWrapper length={totalEventTime * 10}>
            {this.getClassModulesActivites()}
          </ActivitiesWrapper>
        </OuterActivitesWrapper>
      </Wrapper>
    );
  }
}

export default TimeLineContainer;
