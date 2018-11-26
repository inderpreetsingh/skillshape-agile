import get from 'lodash/get';
import PropTypes from "prop-types";
import React, { Component } from "react";
import styled from "styled-components";
import Description from "./presentational/Description";
import LocationDetails from "./presentational/LocationDetails";
import NameBar from "./presentational/NameBar";
import { rhythmDiv, tablet } from "/imports/ui/components/landing/components/jss/helpers.js";
import { classTimeData } from "/imports/ui/components/landing/constants/classDetails/classTimeData";


const Wrapper = styled.div`
  padding: 0;

  @media screen and (min-width: ${tablet}px) {
    flex: 1;
    margin-right: ${rhythmDiv * 2}px;
    border-radius: 5px;
  }
`;

class ClassTimeInformation extends Component {

  getTitle = () => {
    const { classType } = this.props;
    return get(classType, 'name', '');
  }
  getTime = () => {
    const { classTimeData } = this.props;
    return get(classTimeData, 'time', '');
  }
  getTimePeriod = () => {
    const { classTimeData } = this.props;
    return get(classTimeData, 'timePeriod', '');
  }

  render() {
    const {
      classTimeData,
      classTypeName,
      schoolName,
      schoolCoverSrc,
      title, desc, locationData, eventStartTime,
      website, start
    } = this.props;
    locationName = () => {
      return `${get(locationData, 'city', '')}, ${get(locationData, 'state', '')}, ${get(locationData, 'country', '')}, ${get(locationData, 'zip', '')}`
    }

    return (
      <Wrapper>
        <NameBar
          title={this.getTitle()}
          schoolName={schoolName}
        />
        <Description description={desc} />
        <LocationDetails
          website={website}
          time={this.getTime()}
          timePeriod={this.getTimePeriod()}
          startDate={start}
          address={locationName()}
          locationData={{ lat: get(locationData, 'loc[1]', ''), lng: get(locationData, "loc[0]", '') }}
        />

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
