import React, { PureComponent, Component } from "react";
import styled from "styled-components";
import {
  Text,
  Italic
} from "/imports/ui/components/landing/components/jss/sharedStyledComponents";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const NodeDetails = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  transition: opacity 0.25s linear, left 0.5s linear, right 0.5s linear;
  ${props => (props.show ? "opacity: 1" : "opacity: 0")};
  ${props => {
    if (props.show) {
      return props.leftSide ? `left: 100%` : `right: 100%`;
    }

    return props.leftSide ? "left: 500px;" : "right: 500px";
  }};
`;

const ActivityDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const ActivityName = Text.extend`
  font-weight: 400;
  font-size: 18px;
  font-style: italic;
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
  width: 50px;
  transition: background 0.25s ease-in;
  background: ${props => props.color};
  ${props => (props.show ? "display: block" : "display: none")};
`;

const TimeLineNode = styled.div`
  transition: height 0.25s ease-in;
  background: ${props => props.color};
  height: ${props => props.length}px;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
`;

const TimeLineNodeWrapper = styled.div`
  background: ${helpers.black};
  height: ${props => props.length}px;
  width: 5px;
  position: relative;
`;

class Activity extends PureComponent {
  render() {
    const { props } = this;
    return (
      <Wrapper>
        <TimeLineNodeWrapper length={props.totalTimeLength}>
          <TimeLineNode color={props.color} length={props.timeElapsedLength} />

          <NodeDetails
            leftSide={props.leftSide}
            show={props.timeElapsedLength > 0}
          >
            <Attacher
              show={props.leftSide}
              color={props.timeElapsedLength ? props.color : helpers.black}
            />
            <ActivityDetails>
              <Time
                color={props.timeElapsedLength ? props.color : helpers.black}
              >
                {props.time} mins
              </Time>
              <ActivityName>{props.name}</ActivityName>
              {props.type && <ActivityType>( {props.type} )</ActivityType>}
            </ActivityDetails>
            <Attacher
              show={!props.leftSide}
              color={props.timeElapsedLength ? props.color : helpers.black}
            />
          </NodeDetails>
        </TimeLineNodeWrapper>
      </Wrapper>
    );
  }
}
export default Activity;
