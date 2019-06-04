import React, { PureComponent } from 'react';
import styled from 'styled-components';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import { Text } from '/imports/ui/components/landing/components/jss/sharedStyledComponents';

const Wrapper = styled.div`
  height: ${props => props.length}%;

  @media screen and (min-width: ${helpers.tablet}px) {
    height: 100%;
    width: ${props => props.length}%;
  }
`;

const InnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100%;

  @media screen and (min-width: ${helpers.tablet}px) {
    height: ${props => (props.evenPosition ? '50%' : 'calc(50% - 5px)')};
    ${props => (props.evenPosition
    ? 'flex-direction: column-reverse;'
    : 'flex-direction: column; transform: translateY(100%);')} width: 100%;
    justify-content: flex-start;
  }
`;

const NodeDetails = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.25s linear, left 0.5s linear, right 0.5s linear;
  position: absolute;
  height: 100%;
  ${props => (props.show ? 'opacity: 1' : 'opacity: 0')};
  ${(props) => {
    if (props.show) {
      return props.evenPosition ? 'left: 50%' : 'right: 50%';
    }

    return props.evenPosition ? 'left: 500px;' : 'right: 500px';
  }};

  @media screen and (min-width: ${helpers.tablet}px) {
    position: static;
    flex-direction: column;
    align-items: center;
    justify-content: ${props => (props.evenPosition ? 'flex-end' : 'flex-start')};
    width: 100%;
  }
`;

const ActivityDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: ${props => (props.evenPosition ? 'flex-start' : 'flex-end')};
  padding: 0 ${helpers.rhythmDiv}px;

  @media screen and (min-width: ${helpers.tablet}px) {
    align-items: center;
  }
`;

const ActivityName = Text.extend`
  font-weight: 400;
  font-size: 18px;
  font-style: italic;
  text-transform: capitalize;

  @media screen and (min-width: ${helpers.tablet}px) {
    text-align: center;
    width: fit-content;
  }
`;

const ActivityType = ActivityName.extend`
  color: ${helpers.secondaryTextColor};
`;

const Time = Text.extend`
  transition: background 0.25s ease-in;
  color: ${props => props.color};
  font-weight: 500;
`;

const Attacher = styled.div`
  height: 2px;
  width: 30px;
  transition: background 0.25s ease-in;
  background: ${props => props.color};
  ${props => (props.show ? 'display: block' : 'display: none')};

  @media screen and (min-width: ${helpers.tablet}px) {
    height: 30px;
    width: 2px;
    flex-shrink: 1;
    ${props => (!props.show ? 'display: block' : 'display: none')};
  }
`;

const TimeLineNodeWrapper = styled.div`
  background: ${helpers.black};
  height: 100%;
  width: 5px;
  position: relative;

  @media screen and (min-width: ${helpers.tablet}px) {
    width: 100%;
    // height: ${props => (props.evenPosition ? '6px' : '5px')};
    height: 5px;
    flex-shrink: 0;
  }
`;

const TimeLineNode = styled.div`
  transition: height 0.25s ease-in;
  background: ${props => props.color};
  height: ${props => props.length}%;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;

  @media screen and (min-width: ${helpers.tablet}px) {
    width: ${props => props.length}%;
    height: 100%;
  }
`;

class Activity extends PureComponent {
  render() {
    const { props } = this;
    return (
      <Wrapper length={props.totalTimeLength}>
        <InnerWrapper evenPosition={props.evenPosition}>
          <TimeLineNodeWrapper evenPosition={props.evenPosition}>
            <TimeLineNode color={props.color} length={props.timeElapsedLength} />
          </TimeLineNodeWrapper>
          <NodeDetails evenPosition={props.evenPosition} show={props.timeElapsedLength > 0}>
            <Attacher
              show={props.evenPosition}
              color={props.timeElapsedLength ? props.color : helpers.black}
            />

            <ActivityDetails evenPosition={props.evenPosition}>
              <Time color={props.timeElapsedLength ? props.color : helpers.black}>
                {props.time}
                {' '}
mins
              </Time>
              <ActivityName>{props.name}</ActivityName>
              {props.type && (
              <ActivityType>
(
                {props.type}
                {' '}
)
              </ActivityType>
              )}
            </ActivityDetails>

            <Attacher
              show={!props.evenPosition}
              color={props.timeElapsedLength ? props.color : helpers.black}
            />
          </NodeDetails>
        </InnerWrapper>
      </Wrapper>
    );
  }
}
export default Activity;
