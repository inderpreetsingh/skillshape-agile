import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Icon from "material-ui/Icon";

import { formatDate } from "/imports/util";
import { Text } from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import SchoolLocationMap from "/imports/ui/components/landing/components/map/SchoolLocationMap.jsx";
import {
  rhythmDiv,
  tablet,
  mobile,
  baseFontSize
} from "/imports/ui/components/landing/components/jss/helpers.js";

const styles = {
  icon: {
    marginRight: rhythmDiv
  }
};

const Wrapper = styled.div`
  height: 300px;
  width: 100%;
  display: flex;
  padding: 0 ${rhythmDiv * 2}px;

  @media screen and (max-width: ${tablet}px) {
    height: 200px;
  }

  @media screen and (max-width: ${mobile}px) {
    flex-direction: column;
    min-height: 200px;
    height: auto;
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: ${rhythmDiv * 2}px;
  max-width: 50%;
  width: 100%;
  @media screen and (max-width: ${mobile}px) {
    max-width: 100%;
    padding: 0;
    margin-bottom: ${rhythmDiv}px;
  }
`;

const Right = styled.div`
  height: 100%;
  max-width: 50%;
  width: 100%;

  @media screen and (max-width: ${mobile}px) {
    max-width: 100%;
    height: 300px;
    margin-bottom: ${rhythmDiv}px;
  }
`;

/* prettier-ignore */
const Time = Address = MyDate = Text.extend`
  display: flex;
  font-style: italic;
  font-weight: 400;
  font-size: ${baseFontSize * 1.25}px;
`;

const LocationDetails = props => {
  // console.group("Location Details");
  // console.log(props);
  // console.groupEnd();

  return (
    <Wrapper>
      <Left>
        <MyDate>
          <Icon classes={{ root: props.classes.icon }}>calendar_today</Icon>
          {formatDate(props.startDate)}
        </MyDate>
        <Time>
          <Icon classes={{ root: props.classes.icon }}>timer</Icon>
          {props.time} {props.timePeriod}
        </Time>
        <Address>
          <Icon classes={{ root: props.classes.icon }}>my_location</Icon>
          {props.address}
        </Address>
      </Left>
      <Right>
        <SchoolLocationMap
          locationData={props.locationData}
          markerDraggable={false}
        />
      </Right>
    </Wrapper>
  );
};

LocationDetails.propTypes = {
  startDate: PropTypes.string,
  time: PropTypes.string,
  timePeriod: PropTypes.string,
  address: PropTypes.string,
  locationData: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number
  })
};

export default withStyles(styles)(LocationDetails);
