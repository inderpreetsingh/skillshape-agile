import React, { Component } from "react";
import PropTypes from "prop-types";
import ActionButtons from "./presentational/ActionButtons";
import Description from "./presentational/Description";
import LocationDetails from "./presentational/LocationDetails";
import NameBar from "./presentational/NameBar";

import { classTimeData } from "/imports/ui/components/landing/constants/classDetails/classTimeData";

class ClassTimeInformation extends Component {
  render() {
    const { classTimeData, classTypeName, schoolName } = this.props;

    return (
      <div>
        <NameBar
          classTimeName={classTimeData.name}
          classTypeName={classTimeData.classTypeName || classTypeName}
          schoolName={classTimeData.schoolName || schoolName}
        />
        <Description description={classTimeData.description} />
        <LocationDetails
          time={classTimeData.time}
          date={classTimeData.date}
          address={classTimeData.address}
          locationData={classTimeData.locationData}
        />
        <ActionButtons onScheduleButtonClick={() => {}} />
      </div>
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
