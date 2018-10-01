import React from "react";
import PanelWithTable from "/imports/ui/componentHelpers/panelWithTable";
import classTypeSettings from "./classTypeSettings";
import isEmpty from "lodash/isEmpty";

import ClassTypeExpansion from "./classTypeExpansion.jsx";

export default function() {
  let {
    classTypeData,
    classTimesData,
    showFormBuilderModal,
    moveTab,
    schoolId,
    locationData,
    isLoading
  } = this.props;

  return (
    <div style={{ paddingTop: "20px" }}>
      <ClassTypeExpansion
        schoolId={schoolId}
        locationData={locationData}
        isLoading={isLoading}
        completeClassTimesData={classTimesData}
        classTypeData={this.modifySelectSubjectsInClassTypeData()}
      />
      {/*<PanelWithTable
        schoolId={schoolId}
        className="class-type-details"
        settings={classTypeSettings}
        mainTableData={this.modifySelectSubjectsInClassTypeData()}
        getChildTableData={this.getChildTableData}
        showFormBuilderModal={showFormBuilderModal}
        locationData={locationData}
        handleImageChange={this.handleImageChange}
        handleImageSave={this.handleImageSave}
        showClassTypeModal={isEmpty(classTypeData)}
        moveToNextTab={this.moveToNextTab}
        moveToPreviousTab={this.moveToPreviousTab}
      />*/}
    </div>
  );
}
