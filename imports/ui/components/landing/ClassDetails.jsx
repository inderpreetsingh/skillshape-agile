import React, { Component } from "react";
import ClassDetails from "/imports/ui/components/landing/components/classDetails/index.jsx";
// import PurchaseClassesDialogBox from '/imports/ui/components/landing/components/dialogs/'
import {
  classTimeData,
  classModulesData
} from "/imports/ui/components/landing/constants/classDetails/";

class ClassDetailsContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { currentUser, isUserSubsReady } = this.props;
    return (
      <ClassDetails
        topSearchBarProps={{
          currentUser,
          isUserSubsReady
        }}
        headerProps={{
          classTypeCoverSrc: "",
          schoolCoverSrc: ""
        }}
        timeLineProps={{
          startTime: classTimeData.startTime,
          totalEventTime: classTimeData.totalEventTime,
          classModulesData: classModulesData
        }}
        classTimeInformationProps={{ ...classTimeData }}
      />
    );
  }
}

export default ClassDetailsContainer;
