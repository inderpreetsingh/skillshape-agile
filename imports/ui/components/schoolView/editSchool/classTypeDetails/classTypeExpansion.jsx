import React, { Component } from "react";
import ClassTimes from "/imports/api/classTimes/fields";
import ClassTypeExpansionRender from "./classTypeExpansionRender.js";

class ClassTypeExpansion extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getClassTimesData(classTypeId) {
    return ClassTimes.find({ classTypeId }).fetch();
  }

  render() {
    const { classTypeData } = this.props;

    // console.group("CLASS TYPE DATA");
    // console.info(classTypeData, "----------");
    // console.groupEnd();
    return (
      <ClassTypeExpansionRender
        classTypeData={classTypeData}
        getClassTimeData={this.getClassTimeData}
      />
    );
  }
}

export default ClassTypeExpansion;
