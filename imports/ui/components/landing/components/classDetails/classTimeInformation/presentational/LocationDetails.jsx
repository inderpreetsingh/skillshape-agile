import React from "react";
import styled from "styled-components";
import Icon from "material-ui/Icon";

import { Text } from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import SchoolLocationMap from "/imports/ui/components/landing/components/map/SchoolLocationMap.jsx";
import {
  rhythmDiv,
  baseFontSize
} from "/imports/ui/components/landing/components/jss/helpers.js";

const Wrapper = styled.div`
  height: 300px;
  width: 100vw;
  display: flex;
  padding: 0 ${rhythmDiv * 2}px;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: ${rhythmDiv * 2}px;
  max-width: 50%;
  width: 100%;
`;

const Right = styled.div`
  height: 100%;
  max-width: 50%;
  width: 100%;
`;

/* prettier-ignore */
const Time = Address = Date = Text.extend`
  display: flex;
  font-style: italic;
  font-weight: 400;
  font-size: ${baseFontSize * 1.5}px;
`;

const LocationDetails = props => {
  return (
    <Wrapper>
      <Left>
        <Date>
          <Icon>calendar_today</Icon>
          {props.startDate}
        </Date>
        <Time>
          <Icon>timer</Icon>
          {props.time} {props.timePeriod}
        </Time>
        <Address>
          <Icon>my_location</Icon>
          {props.address}
        </Address>
      </Left>
      <Right>
        <SchoolLocationMap locationData={locationData} markerDraggable={false} />
      </Right>
    </Wrapper>
  );
};

LocationDetails.propTypes = {
  startDate: PropTypes.string,
  time: PropTypes.string,
  timePeriod: PropTypes.string,
  address: PropTypes.string
};

export default LocationDetails;
