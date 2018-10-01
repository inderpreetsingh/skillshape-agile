import React, { Component, Fragment } from "react";

import { formatClassTimesData, withPopUp } from "/imports/util";
import { ContainerLoader } from "/imports/ui/loading/container.js";
import ClassTimes from "/imports/api/classTimes/fields";

import ClassTimeForm from "/imports/ui/components/schoolView/editSchool/classTypeDetails/classTimeForm.js";
import ClassTypeForm from "/imports/ui/components/schoolView/editSchool/classTypeDetails/classTypeForm.js";
import ClassTypeExpansionRender from "/imports/ui/components/schoolView/editSchool/classTypeDetails/classTypeExpansionRender.js";
import SkillShapeDialogBox from "/imports/ui/components/landing/components/dialogs/SkillShapeDialogBox.jsx";


class ClassTypeExpansion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBusy: false,
      selectedClassTimeData: {},
      selectedClassTypeData: {},
      showConfirmationModal: false,
      deleteConfirmationModal: false,
      classTimeForm: false
    };
  }

  cancelConfirmationModal = () =>
    this.setState({ showConfirmationModal: false });

  handleDeleteData = () => {
    this.setState({ isBusy: true });
    const { popUp } = this.props;
    const { formData } = this.state;
    const delAction = this.props.settings.mainTable.actions.del;
    const methodToCall = delAction.onSubmit;
    // const docObj = formData;
    // console.log(formData, methodToCall, docObj, "===================");

    // NOTE: we are only covering case for location.removeLocation
    // need to somehow cover it for other panel methods as well.
    Meteor.call(methodToCall, { doc: formData }, (err, res) => {
      this.closeDeleteConfirmationModal();
      if (err) {
        popUp.appear("alert", { content: err.reason || err.message });
      } else {
        popUp.appear("success", { title: "success", content: res.message });
      }
    });
  };

  handleModalState = (modalName, modalState) => e => {
    this.setState(state => {
      return {
        ...state,
        [modalName]: modalState
      };
    });
  };

  showDeleteConfirmationModal = () => {
    this.setState({ deleteConfirmationModal: true, isBusy: false });
  };

  closeDeleteConfirmationModal = () => {
    // this.setState(state => {
    //   return {
    //     ...state,
    //     deleteConfirmationModal: false
    //   };
    // });
    this.setState({ deleteConfirmationModal: false, isBusy: false });
  };

  getClassTimesData(classTypeId) {
    const classTimesData = ClassTimes.find({ classTypeId }).fetch();
    return formatClassTimesData(classTimesData, false);
  }

  handleEditClassTypeClick = (classTypeData) => (e) => {
    e.stopPropagation();

    this.setState(state => {
      return {
        ...state,
        classTypeForm: true,
        selectedClassTypeData: classTypeData
      }
    });
  }

  handleEditClassTimesClick = (classTypeData) => (classTimeData) => () => {
    this.setState(state => {
      return {
        ...state,
        classTimeForm: true,
        selectedClassTimeData: classTimeData,
        selectedClassTypeData: classTypeData,
      }
    })
  }

  handleAddClassTypeClick = () => {
    this.setState(state => {
      return {
        ...state,
        classTypeForm: true,
        selectedClassTypeData: null
      }
    })
  }

  render() {
    const { classTypeData, isLoading, schoolId, locationData } = this.props;
    debugger;
    if (isLoading) {
      return <ContainerLoader />;
    }

    return (
      <Fragment>
        {this.state.showConfirmationModal && (
          <SkillShapeDialogBox
            open={this.state.showConfirmationModal}
            type="alert"
            defaultButtons
            title="Are you sure?"
            content="This will email all attending and interested students of the time change. Are you sure?"
            cancelBtnText="Cancel"
            onAffirmationButtonClick={() => {
              this.handleExpansionPanelRightBtn(currentTableData);
            }}
            onModalClose={this.cancelConfirmationModal}
            onCloseButtonClick={this.cancelConfirmationModal}
          />
        )}
        {this.state.deleteConfirmationModal && (
          <SkillShapeDialogBox
            open={this.state.deleteConfirmationModal}
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
        {this.state.classTimeForm && (
          <ClassTimeForm
            schoolId={schoolId}
            parentKey={this.state.selectedClassTypeData._id}
            parentData={this.state.selectedClassTypeData}
            data={this.state.selectedClassTimeData}
            open={this.state.classTimeForm}
            onClose={this.handleModalState("classTimeForm", false)}
            moveToNextTab={this.props.moveToNextTab}
            locationData={locationData}
          />
        )}

        {this.state.classTypeForm && (
          <ClassTypeForm
            schoolId={schoolId}
            data={this.state.selectedClassTypeData}
            open={this.state.classTypeForm}
            onClose={this.handleModalState("classTypeForm", false)}
            locationData={locationData}
            {...this.props}
          />
        )}
        <ClassTypeExpansionRender
          classTypeData={classTypeData}
          onAddClassTypeClick={this.handleAddClassTypeClick}
          onEditClassTypeClick={this.handleEditClassTypeClick}
          onEditClassTimesClick={this.handleEditClassTimesClick}
          getClassTimesData={this.getClassTimesData}
        />
      </Fragment>
    );
  }
}

export default withPopUp(ClassTypeExpansion);
