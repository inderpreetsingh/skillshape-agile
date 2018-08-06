import React, { Component } from "react";

import ActionButtons from "./presentational/ActionButtons";
import Description from "./presentational/Description";
import LocationDetails from "./presentational/LocationDetails";
import NameBar from "./presentational/NameBar";

class ClassTimeInformation extends Component {
  render() {
    const { classTimeData, classTypeName, schoolName } = this.props;

    return (
      <div>
        <NameBar
          classTimeName={classTimeData.name}
          classTypeName={classTypeName}
          schoolName={schoolName}
        />
        <Description description={classTimeData.description} />
        <LocationDetails
          time={classTimeData.time}
          date={classTimeData.date}
          address={classTimeData.address}
          locationData={classTimeData.loc}
        />
        <ActionButtons onScheduleButtonClick={() => {}} />
      </div>
    );
  }
}

ClassTimeInformation.defaultProps = {
  classTimeData
}

export default ClassTimeInformation;
