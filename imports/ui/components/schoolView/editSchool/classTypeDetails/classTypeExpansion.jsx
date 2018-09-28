import React, { Component } from "react";

import { formatClassTimesData } from "/imports/util";
import { ContainerLoader } from "/imports/ui/loading/container.js";
import ClassTimes from "/imports/api/classTimes/fields";
import ClassTypeExpansionRender from "./classTypeExpansionRender.js";

class ClassTypeExpansion extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getClassTimesData(classTypeId) {
    const classTimesData = ClassTimes.find({ classTypeId }).fetch();
    return formatClassTimesData(classTimesData, false);
  }

  render() {
    const { classTypeData, isLoading } = this.props;
    debugger;
    if (isLoading) {
      return <ContainerLoader />;
    }

    return (
      <ClassTypeExpansionRender
        classTypeData={classTypeData}
        getClassTimesData={this.getClassTimesData}
      />
    );
  }
}

export default ClassTypeExpansion;
