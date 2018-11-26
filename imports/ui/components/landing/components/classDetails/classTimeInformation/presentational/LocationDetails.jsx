import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Icon from "material-ui/Icon";
import { withStyles } from "material-ui/styles";

import { formatDate } from "/imports/util";
import { mobile, rhythmDiv, tablet } from "/imports/ui/components/landing/components/jss/helpers.js";
import { Text } from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import SchoolLocationMap from "/imports/ui/components/landing/components/map/SchoolLocationMap.jsx";
import ActionButtons from "/imports/ui/components/landing/components/classDetails/shared/ActionButtons";


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
  min-height: 200px;
  height: auto;
  padding-bottom: ${rhythmDiv * 2}px;

  @media screen and (min-width: ${mobile + 1}px) {
    flex-direction: row;
    height: 250px;
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

  @media screen and (min-width: ${mobile + 1}px) {
    height: 100%;
    max-width: 50%;
  }
`;

const HideOnLargeScreen = styled.div`
  @media screen and (min-width: ${tablet}px) {
    display: none;
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
  const {
    address,
    classes: { icon },
    time,
    timePeriod,
    startDate,
    locationData,
    website
  } = props;

  return (
    <Wrapper>
      <Left>
        <LeftInnerWrapper>
          <MyDate>
            <Icon classes={{ root: icon }}>calendar_today</Icon>
            {formatDate(startDate)}
          </MyDate>
          <Time>
            <Icon classes={{ root: icon }}>timer</Icon>
            {time} {timePeriod}
          </Time>
          <Address>
            <Icon classes={{ root: icon }}>my_location</Icon>
            {address}
          </Address>
          <HideOnLargeScreen>
            <ActionButtons website={website} />
          </HideOnLargeScreen>
        </LeftInnerWrapper>
      </Left>
      <Right>
        <SchoolLocationMap
          locationData={locationData}
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
