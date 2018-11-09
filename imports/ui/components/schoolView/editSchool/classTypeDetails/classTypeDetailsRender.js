import React from "react";

import ClassTimeForm from "/imports/ui/components/schoolView/editSchool/classTypeDetails/classTimeForm.js";
import ClassTypeForm from "/imports/ui/components/schoolView/editSchool/classTypeDetails/classTypeForm.js";
import SkillShapeDialogBox from "/imports/ui/components/landing/components/dialogs/SkillShapeDialogBox.jsx";

import ClassTypeExpansion from './classTypeExpansion.jsx';
import ClassTypeExpansionRender from './classTypeExpansionRender';
import PanelWithTable from "/imports/ui/componentHelpers/panelWithTable";

import classTypeSettings from "./classTypeSettings";

import isEmpty from "lodash/isEmpty";

export default function () {
  let {
    classTypeData,
    classTimesData,
    showFormBuilderModal,
    moveTab,
    schoolId,
    locationData,
    isLoading,
  } = this.props;

  const {
    isBusy,
    formAction,
    notifyFor,
    classTimeForm,
    classTypeForm,
    showConfirmationModal,
    deleteConfirmationModal,
    selectedClassTimeData,
    selectedClassTypeData,
    selectedClassTypeId,
  } = this.state;

  const classTimeParentData = selectedClassTypeId ? this.getClassTypeData(selectedClassTypeId) : selectedClassTypeData;
  // console.group("CLASS TIME PARENT DATA");
  // console.log(classTimeParentData, selectedClassTypeData);
  // console.groupEnd();

  return (
    <div style={{ paddingTop: "20px" }}>
      {showConfirmationModal && (
        <SkillShapeDialogBox
          open={showConfirmationModal}
          type="alert"
          defaultButtons
          title="Are you sure?"
          content={`This will email all attending and interested students of the ${notifyFor} change. Are you sure?`}
          cancelBtnText="Cancel"
          onAffirmationButtonClick={this.handleNotifyForChange}
          onModalClose={this.cancelConfirmationModal}
          onCloseButtonClick={this.cancelConfirmationModal}
        />
      )}

      {deleteConfirmationModal && (
        <SkillShapeDialogBox
          open={deleteConfirmationModal}
          type="alert"
          defaultButtons
          title="Are you sure?"
          content={"This will delete your data, are you sure?"}
          cancelBtnText="Cancel"
          onAffirmationButtonClick={this.handleDeleteData}
          onModalClose={this.closeDeleteConfirmationModal}
          onCloseButtonClick={this.closeDeleteConfirmationModal}
        />
      )}
      {classTimeForm &&
        <ClassTimeForm
          schoolId={schoolId}
          parentKey={selectedClassTypeId || (selectedClassTypeData && selectedClassTypeData._id)}
          parentData={classTimeParentData || selectedClassTimeData}
          data={selectedClassTimeData}
          open={classTimeForm}
          onClose={this.handleClassTimeFormClose}
          moveToNextTab={this.moveToNextTab}
          locationData={locationData}
        />}

      {classTypeForm && (
        <ClassTypeForm
          schoolId={schoolId}
          data={selectedClassTypeData}
          open={classTypeForm}
          onClose={this.handleClassTypeFormClose}
          locationData={locationData}
          moveToNextTab={this.moveToNextTab}
        />
      )}

      {isBusy && <ContainerLoader />}

      <ClassTypeExpansionRender
        handleNotifyForChange={this.handleNotifyForChange}
        schoolId={schoolId}
        locationData={locationData}
        isLoading={isLoading}
        getClassTimesData={this.getClassTimesData}
        onNotifyClassTypeUpdate={this.handleNotifyClassTypeUpdate}
        onAddClassTimeClick={this.handleAddClassTimeClick}
        onAddClassTypeClick={this.handleAddClassTypeClick}
        onEditClassTypeClick={this.handleEditClassTypeClick}
        onEditClassTimesClick={this.handleEditClassTimesClick}
        onImageSave={this.handleImageSave}
        getClassTimesData={this.getClassTimesData}
        moveToNextTab={this.moveToNextTab}
        moveToPreviousTab={this.moveToPreviousTab}
        /*completeClassTimesData={classTimesData}*/
        classTypeData={this.modifySelectSubjectsInClassTypeData()}
      />}

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
