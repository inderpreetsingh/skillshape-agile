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
  whyDidYouUpdate(React, { include: [/(^ClassTimeForm)|(^ClassTypeExpansion)|(^ReactMeteorData)/] });
}

class ClassTypeExpansion extends Component {
  constructor(props) {
    super(props);
  }

  // cancelConfirmationModal = () =>
  //   this.setState({ showConfirmationModal: false });

  // handleDeleteData = () => {
  //   this.setState({ isBusy: true });
  //   const { popUp } = this.props;
  //   const { classTypeData } = this.state;
  //   const delAction = this.props.settings.mainTable.actions.del;
  //   const methodToCall = delAction.onSubmit;
  //   // const docObj = formData;
  //   // console.log(formData, methodToCall, docObj, "===================");

  //   Meteor.call(methodToCall, { doc: formData }, (err, res) => {
  //     this.closeDeleteConfirmationModal();
  //     if (err) {
  //       popUp.appear("alert", { content: err.reason || err.message });
  //     } else {
  //       popUp.appear("success", { title: "success", content: res.message });
  //     }
  //   });
  // };

  // handleModalState = (modalName, modalState) => e => {
  //   this.setState(state => {
  //     return {
  //       ...state,
  //       [modalName]: modalState
  //     };
  //   });
  // };

  // closeDeleteConfirmationModal = () => {
  //   this.setState(state => {
  //     return {
  //       ...state,
  //       deleteConfirmationModal: false,
  //       isBusy: false
  //     }
  //   });
  // };

  // getClassTimesData(classTypeId) {
  //   const classTimesData = ClassTimes.find({ classTypeId }).fetch();
  //   return formatClassTimesData(classTimesData, false);
  // }

  // handleEditClassTypeClick = (classTypeData) => (e) => {
  //   e.stopPropagation();

  //   this.setState(state => {
  //     return {
  //       ...state,
  //       classTypeForm: true,
  //       selectedClassTypeData: classTypeData
  //     }
  //   });
  // }

  // handleEditClassTimesClick = (classTypeData) => (classTimeData) => () => {
  //   this.setState(state => {
  //     return {
  //       ...state,
  //       classTimeForm: true,
  //       selectedClassTimeData: classTimeData,
  //       selectedClassTypeData: classTypeData,
  //     }
  //   })
  // }

  // handleAddClassTypeClick = () => {
  //   this.setState(state => {
  //     return {
  //       ...state,
  //       classTypeForm: true,
  //       selectedClassTypeData: null
  //     }
  //   })
  // }

  // handleNotifyForChange = () => {
  //   const data = this.state.selectedClassTypeData;
  //   if (this.state.methodName) {
  //     this.setState({ isBusy: true });
  //     Meteor.call(
  //       this.state.methodName,
  //       {
  //         schoolId: data.schoolId,
  //         classTypeId: data._id,
  //         classTypeName: data.name
  //       },
  //       (err, res) => {
  //         // console.log("classType.notifyToStudentForClassTimes",error, result)
  //         const { popUp } = this.props;
  //         this.setState({ showConfirmationModal: false, isBusy: false }, () => {
  //           if (res && res.message) {
  //             // Need to show message to user when email is send successfully.
  //             popUp.appear("success", { content: res.message });
  //           }
  //           if (err) {
  //             popUp.appear("alert", { content: err.reason || err.message });
  //           }
  //         });
  //       }
  //     );
  //   }
  // }

  // // This is done so that we can show confirmation modal.
  // handleNotifyClassTypeUpdate = (selectedClassTypeData, methodName, notifyFor) => () => {
  //   this.setState({
  //     showConfirmationModal: true,
  //     selectedClassTypeData,
  //     methodName,
  //     notifyFor
  //   });
  // };

  // handleClassTimeFormClose = () => {
  //   this.setState(state => {
  //     return {
  //       ...state,
  //       classTimeForm: false,
  //       selectedClassTypeId: null,
  //       selectedClassTypeData: null
  //     }
  //   })
  // }

  // handleClassTypeFormClose = (parentId) => {
  //   this.setState(state => {
  //     return {
  //       ...state,
  //       classTimeForm: true,
  //       classTypeForm: false,
  //       // isBusy: true,
  //       selectedClassTypeId: parentId
  //     }
  //   });
  // }

  componentDidMount() {
    console.info("MOUNTED __________ PARENT")
  }

  componentDidUpdate() {
    console.info("RE RENDERED ________________ PARENT");
  }

  render() {
    const {
      classTypeData,
      isLoading,
      schoolId,
      locationData,
      moveToNextTab
    } = this.props;

    // debugger;


    return (
      <Fragment>
        <ClassTypeExpansionRender
          onNotifyClassTypeUpdate={this.props.handleNotifyClassTypeUpdate}
          onAddClassTypeClick={this.props.handleAddClassTypeClick}
          onEditClassTypeClick={this.props.handleEditClassTypeClick}
          onEditClassTimesClick={this.props.handleEditClassTimesClick}
          getClassTimesData={this.props.getClassTimesData}
        />
      </Fragment>
    );
  }
}

export default withPopUp(ClassTypeExpansion);
