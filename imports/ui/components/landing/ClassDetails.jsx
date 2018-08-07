import React, { Component } from "react";
import ClassDetails from "/imports/ui/components/landing/components/classDetails/index.jsx";
// import PurchaseClassesDialogBox from '/imports/ui/components/landing/components/dialogs/'
import { classTimeData } from "/imports/ui/components/landing/constants/classDetails/";

class ClassDetailsContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ClassDetails
        headerProps={{
          classTypeCoverSrc: "",
          schoolCoverSrc: ""
        }}
        classTimeInformationProps={{ ...classTimeData }}
      />
    );
  }
}

export default ClassDetailsContainer;
