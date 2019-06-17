import React, { Component, Fragment } from 'react';
import ClassTypeExpansionRender from '/imports/ui/components/schoolView/editSchool/classTypeDetails/classTypeExpansionRender';
import { withPopUp } from '/imports/util';

class ClassTypeExpansion extends Component {
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

  render() {
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
