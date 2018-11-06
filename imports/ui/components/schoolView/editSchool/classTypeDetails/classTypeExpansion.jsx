import React, { Component, Fragment } from "react";
import isEmpty from 'lodash/isEmpty';

import { formatClassTimesData, withPopUp } from "/imports/util";
import { ContainerLoader } from "/imports/ui/loading/container.js";
import ClassTimes from "/imports/api/classTimes/fields";

import ClassTimeForm from "/imports/ui/components/schoolView/editSchool/classTypeDetails/classTimeForm.js";
import ClassTypeForm from "/imports/ui/components/schoolView/editSchool/classTypeDetails/classTypeForm.js";
import ClassTypeExpansionRender from "/imports/ui/components/schoolView/editSchool/classTypeDetails/classTypeExpansionRender.js";
import SkillShapeDialogBox from "/imports/ui/components/landing/components/dialogs/SkillShapeDialogBox.jsx";

if (process.env.NODE_ENV !== 'production') {
  const { whyDidYouUpdate } = require('why-did-you-update');
  whyDidYouUpdate(React);
}

class ClassTypeExpansion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBusy: false,
      selectedClassTimeData: {},
      selectedClassTypeData: {},
      showConfirmationModal: false,
      deleteConfirmationModal: false,
      classTimeForm: false,
      classTypeForm: false,
    };
  }

  getClassTypeData = (classTypeId) => {
    console.info("CHECKING", classTypeId, this.props);
    if (!classTypeId) {
      return null;
    }
    return this.props.classTypeData.filter(data => data._id === classTypeId)[0] || null;
  }

  cancelConfirmationModal = () =>
    this.setState({ showConfirmationModal: false });

  handleDeleteData = () => {
    this.setState({ isBusy: true });
    const { popUp } = this.props;
    const { classTypeData } = this.state;
    const delAction = this.props.settings.mainTable.actions.del;
    const methodToCall = delAction.onSubmit;
    // const docObj = formData;
    // console.log(formData, methodToCall, docObj, "===================");

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

  closeDeleteConfirmationModal = () => {
    this.setState(state => {
      return {
        ...state,
        deleteConfirmationModal: false,
        isBusy: false
      }
    });
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

  handleNotifyForChange = () => {
    const data = this.state.selectedClassTypeData;
    if (this.state.methodName) {
      this.setState({ isBusy: true });
      Meteor.call(
        this.state.methodName,
        {
          schoolId: data.schoolId,
          classTypeId: data._id,
          classTypeName: data.name
        },
        (err, res) => {
          // console.log("classType.notifyToStudentForClassTimes",error, result)
          const { popUp } = this.props;
          this.setState({ showConfirmationModal: false, isBusy: false }, () => {
            if (res && res.message) {
              // Need to show message to user when email is send successfully.
              popUp.appear("success", { content: res.message });
            }
            if (err) {
              popUp.appear("alert", { content: err.reason || err.message });
            }
          });
        }
      );
    }
  }

  // This is done so that we can show confirmation modal.
  handleNotifyClassTypeUpdate = (selectedClassTypeData, methodName, notifyFor) => () => {
    this.setState({
      showConfirmationModal: true,
      selectedClassTypeData,
      methodName,
      notifyFor
    });
  };

  handleClassTimeFormClose = () => {
    this.setState(state => {
      return {
        ...state,
        classTimeForm: false,
        selectedClassTypeId: null,
        selectedClassTypeData: null
      }
    })
  }

  handleClassTypeFormClose = (parentId) => {
    this.setState(state => {
      return {
        ...state,
        classTimeForm: true,
        classTypeForm: false,
        // isBusy: true,
        selectedClassTypeId: parentId
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    // debugger;
    // const { selectedClassTypeId, selectedClassTypeData } = this.state;
    // if (selectedClassTypeId) {
    //   const classData = nextProps.classTypeData.filter(data => data._id === selectedClassTypeId)[0];
    //   if (isEmpty(selectedClassTypeData) || selectedClassTypeData && selectedClassTypeData._id !== classData._id) {
    //     debugger;
    //     this.setState(prevState => {
    //       return {
    //         ...prevState,
    //         isBusy: false,
    //         selectedClassTypeData: classData
    //       }
    //     });
    //   }
    // }
  }

  componentDidMount() {
    console.info("MOUNTED __________ PARENT")
  }

  componentDidUpdate() {
    console.info("RE RENDERED ________________ PARENT");
  }

  render() {
    const {
      isBusy,
      notifyFor,
      classTimeForm,
      classTypeForm,
      showConfirmationModal,
      deleteConfirmationModal,
      selectedClassTimeData,
      selectedClassTypeData,
      selectedClassTypeId,
    } = this.state;

    const {
      classTypeData,
      isLoading,
      schoolId,
      locationData
    } = this.props;

    // debugger;
    if (isLoading || isBusy) {
      return <ContainerLoader />;
    }

    const classTimeParentData = selectedClassTypeId ? this.getClassTypeData(selectedClassTypeId) : selectedClassTypeData;
    console.group("CLASS TYPE DATA");
    console.log(isLoading, isBusy, classTimeForm)
    console.groupEnd();
    debugger;
    return (
      <Fragment>
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
            moveToNextTab={this.props.moveToNextTab}
            locationData={locationData}
          />}

        {classTypeForm && (
          <ClassTypeForm
            schoolId={schoolId}
            data={selectedClassTypeData}
            open={classTypeForm}
            onClose={this.handleClassTypeFormClose}
            locationData={locationData}
            {...this.props}
          />
        )}

        <ClassTypeExpansionRender
          classTypeData={classTypeData}
          onNotifyClassTypeUpdate={this.handleNotifyClassTypeUpdate}
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
