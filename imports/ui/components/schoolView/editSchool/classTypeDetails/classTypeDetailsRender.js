import React from "react";
import styled from 'styled-components';
import ClassTypeExpansionRender from './classTypeExpansionRender';
import UploadMedia from '/imports/ui/componentHelpers/schoolViewBanner/uploadMedia.js';
import SkillShapeDialogBox from "/imports/ui/components/landing/components/dialogs/SkillShapeDialogBox.jsx";
import { rhythmDiv } from '/imports/ui/components/landing/components/jss/helpers.js';
import ClassTimeForm from "/imports/ui/components/schoolView/editSchool/classTypeDetails/classTimeForm.js";
import ClassTypeForm from "/imports/ui/components/schoolView/editSchool/classTypeDetails/classTypeForm.js";
import { ContainerLoader } from "/imports/ui/loading/container";



const Wrapper = styled.div`
  padding: ${rhythmDiv * 2}px;
`;

export default function () {
  const {
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
    showBackgroundUpload,
    showConfirmationModal,
    deleteConfirmationModal,
    selectedClassTimeData,
    selectedClassTypeData,
    selectedClassTypeId,
    selectedSchoolData,
  } = this.state;

  const classTimeParentData = selectedClassTypeId ? this.getClassTypeData(selectedClassTypeId) : selectedClassTypeData;
  // console.group("CLASS TIME PARENT DATA");
  // console.log(classTimeParentData, selectedClassTypeData);
  // console.groupEnd();

  return (
    <Wrapper>
      {showBackgroundUpload && <UploadMedia
        forClassType
        fullScreen={false}
        schoolId={schoolId}
        classTypeId={selectedClassTypeData._id}
        mediaFormData={selectedClassTypeData}
        showCreateMediaModal={showBackgroundUpload}
        onChange={this.handleImageChange}
        onClose={this.handleImageUploadClose}
        imageType={"mainImg"}
      />}

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
        onEditClassTypeImageClick={this.handleEditImageClick}
        onImageSave={this.handleImageSave}
        getClassTimesData={this.getClassTimesData}
        moveToNextTab={this.moveToNextTab}
        moveToPreviousTab={this.moveToPreviousTab}
        /*completeClassTimesData={classTimesData}*/
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
    </Wrapper>
  );
}
