import React from "react";
import { Text } from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import SchoolLocationMap from "/imports/ui/components/landing/components/map/SchoolLocationMap.jsx";

const Wrapper = styled.div`
  max-height: 300px;
  width: 100vw;
  display: flex;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: space-between;
  padding: ${helpers.rhythmDiv * 2}px;
  text-align: center;
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
  font-style: italic;
`;

const LocationDetails = props => {
  return (
    <Wrapper>
      <Left>
        <Date>{props.date}</Date>
        <Time>{props.time}-</Time>
        <Address>{props.address}</Address>
      </Left>
      <Right>
        <SchoolLocationMap
          markerDraggable={false}
          myLocation={props.locationData}
        />
      </Right>
    </Wrapper>
  );
};

LocationDetails.propTypes = {};

export default LocationDetails;
