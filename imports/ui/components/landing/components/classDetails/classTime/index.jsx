import React, { Component } from "react";

import ActionButtons from "./ActionButtons";
import Description from "./Description";
import LocationDetails from "./LocationDetails";
import NameBar from "./NameBar";

class ClassTime extends Component {
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

export default ClassTime;
