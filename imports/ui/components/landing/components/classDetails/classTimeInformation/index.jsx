import React, { Component, Fragment } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import ActionButtons from "/imports/ui/components/landing/components/classDetails/shared/ActionButtons";
import Description from "./presentational/Description";
import LocationDetails from "./presentational/LocationDetails";
import NameBar from "./presentational/NameBar";

import {
  tablet,
  rhythmDiv
} from "/imports/ui/components/landing/components/jss/helpers.js";
import { classTimeData } from "/imports/ui/components/landing/constants/classDetails/classTimeData";

const Wrapper = styled.div`
  @media screen and (min-width: ${tablet}px) {
    flex: 1;
    margin-right: ${rhythmDiv * 2}px;
    padding: ${rhythmDiv * 2}px 0 0 ${rhythmDiv * 2}px;
  }
`;

const HideOnLargeScreen = styled.div`
  @media screen and (min-width: ${tablet}px) {
    display: none;
  }
`;

class ClassTimeInformation extends Component {
  render() {
    const { classTimeData, classTypeName, schoolName } = this.props;

    return (
      <Wrapper>
        <NameBar
          classTimeName={classTimeData.name}
          classTypeName={classTimeData.classTypeName || classTypeName}
          schoolName={classTimeData.schoolName || schoolName}
        />
        <Description description={classTimeData.description} />
        <LocationDetails
          time={classTimeData.time}
          timePeriod={classTimeData.timePeriod}
          startDate={classTimeData.startDate}
          address={classTimeData.address}
          locationData={classTimeData.locationData}
        />
        <HideOnLargeScreen>
          <ActionButtons />
        </HideOnLargeScreen>
      </Wrapper>
    );
  }
}

ClassTimeInformation.defaultProps = {
  classTimeData: classTimeData
};

ClassTimeInformation.propTypes = {
  classTimeData: PropTypes.object
};

export default ClassTimeInformation;
