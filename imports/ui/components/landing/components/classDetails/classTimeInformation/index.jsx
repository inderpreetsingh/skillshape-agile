import PropTypes from "prop-types";
import React, { Component } from "react";
import styled from "styled-components";
import Description from "./presentational/Description";
import LocationDetails from "./presentational/LocationDetails";
import NameBar from "./presentational/NameBar";
import { rhythmDiv, tablet } from "/imports/ui/components/landing/components/jss/helpers.js";
import { classTimeData } from "/imports/ui/components/landing/constants/classDetails/classTimeData";
import ThinkingAboutAttending from "/imports/ui/components/landing/components/dialogs/ThinkingAboutAttending";
import { getUserFullName, } from "/imports/util";
import { isEmpty, get } from "lodash";
import {  formatTime } from "/imports/util";

const Wrapper = styled.div`
  padding: 0;

  @media screen and (min-width: ${tablet}px) {
    flex: 1;
    margin-right: ${rhythmDiv * 2}px;
    border-radius: 5px;
  }
`;

class ClassTimeInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      schoolName,
      schoolCoverSrc,
       desc, address, 
      website, start, schoolId, classType, params, classData,selectedLocation,popUp
    } = this.props;
    const {scheduled_date,eventData:{timeZone,title,startTime},classTimeId} = classData || {};
    const eventStartTime = formatTime(startTime,timeZone)
    const { thinkingAboutAttending } = this.state;
    locationName = () => {
      return `${get(selectedLocation,'address','')}, ${get(selectedLocation, 'city', '')}, ${get(selectedLocation, 'state', '')}, ${get(selectedLocation, 'country', '')}, ${get(selectedLocation, 'zip', '')}`
    }

    return (
      <Wrapper bgImg={schoolCoverSrc}>
        {thinkingAboutAttending && (
          <ThinkingAboutAttending
            schoolId={schoolId}
            open={thinkingAboutAttending}
            onModalClose={() => {
              this.setState({ thinkingAboutAttending: false });
            }}
            name={title}
            params={params}
            classTypeId={classType._id}
            popUp = {popUp}
            classTimeId = {classTimeId}
          />)}

        <NameBar
          title={title}
          schoolName={schoolName}
          onJoinClassButtonClick={() => { this.setState({ thinkingAboutAttending: true }) }}
        />
        <Description description={desc} />
        <LocationDetails
          website={website}
          time={eventStartTime}
          startDate={scheduled_date}
          address={locationName()}
          locationData={{ lat: get(selectedLocation, 'loc[1]', ''), lng: get(selectedLocation, "loc[0]", '') }}
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
