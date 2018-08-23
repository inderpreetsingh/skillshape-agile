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
    marginRight: rhythmDiv,
    fontSize: 18,
    width: 18,
    height: 18
  }
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 ${rhythmDiv * 2}px;
  margin-bottom: ${rhythmDiv * 4}px;
  min-height: 200px;
  height: auto;

  @media screen and (min-width: ${mobile + 1}px) {
    flex-direction: row;
  }

  @media screen and (min-width: ${mobile + 1}px) {
    height: 200px;
  }
`;

const Left = styled.div`
  max-width: 100%;
  padding: 0;
  margin-bottom: ${rhythmDiv}px;

  @media screen and (min-width: ${mobile + 1}px) {
    padding: ${rhythmDiv * 2}px;
    max-width: 50%;
    width: 100%;
  }
`;

const LeftInnerWrapper = styled.div`
  height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  max-width: 100%;
  margin: 0;

  @media screen and (min-width: ${mobile}px and max-width: ${tablet}px) {
    max-width: 250px;
  }

  @media screen and (min-width: ${tablet}px) {
      max-width: 400px;
      justify-content: space-between;
      margin: 0 auto;
  }
`;

const Right = styled.div`
  max-width: 100%;
  width: 100%;
  height: 300px;
  margin-bottom: ${rhythmDiv}px;

  @media screen and (min-width: ${mobile + 1}px) {
    height: 100%;
    max-width: 50%;
  }
`;

/* prettier-ignore */
const Time = Address = MyDate = Text.extend`
  display: flex;
  font-style: italic;
  font-weight: 400;
  font-size: 18px;
`;

const LocationDetails = props => {
  // console.group("Location Details");
  // console.log(props);
  // console.groupEnd();

  return (
    <Wrapper>
      <Left>
        <LeftInnerWrapper>
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
        </LeftInnerWrapper>
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
