import React from "react";
import { createContainer } from "meteor/react-meteor-data";
import ClassTypeDetailsRender from "./classTypeDetailsRender";
import "/imports/api/classPricing/methods";
import { compressImage } from "/imports/util";
import ClassType from "/imports/api/classType/fields";
import SkillCategory from "/imports/api/skillCategory/fields";
import SkillSubject from "/imports/api/skillSubject/fields";
import ClassTimes from "/imports/api/classTimes/fields";
import { formatClassTimesData, withPopUp } from "/imports/util";


class ClassTypeDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null
    };
  }

  getChildTableData(parentData) {
    return ClassTimes.find({ classTypeId: parentData._id }).fetch();
  }

  handleEditImageClick = (classTypeData) => (e) => {
    e.stopPropagation();
    e.preventDefault();

    this.setState({
      showBackgroundUpload: true,
      selectedClassTypeData: classTypeData,
    })
  }

  handleImageChange = file => {
    this.setState({ file });
  };

  handleImageSave = (schoolId, classTypeId) => {
    const { file } = this.state;
    let allUploadPromise = [];
    let doc = {
      schoolId: schoolId
    };
    try {
      compressImage(file["org"], file.file, file.isUrl).then(result => {
        console.group("ClassTypeDetails");
        if (_.isArray(result)) {
          console.log("Non-cors");
          for (let i = 0; i <= 1; i++) {
            allUploadPromise.push(
              new Promise((resolve, reject) => {
                S3.upload(
                  { files: { "0": result[i] }, path: "compressed" },
                  (err, res) => {
                    if (res) {
                      if (i == 0) {
                        doc.medium = res.secure_url;
                        resolve();
                      } else {
                        doc.low = res.secure_url;
                        resolve();
                      }
                    }
                  }
                );
              })
            );
          }
          Promise.all(allUploadPromise).then(() => {
            if (file && file.fileData && !file.isUrl) {
              S3.upload(
                { files: { "0": file.fileData }, path: "schools" },
                (err, res) => {
                  if (err) {
                  }
                  if (res) {
                    doc.classTypeImg = res.secure_url;
                    this.editClassType({ doc_id: classTypeId, doc });
                  }
                }
              );
            } else if (file && file.isUrl) {
              doc.classTypeImg = file.file;
              this.editClassType({ doc_id: classTypeId, doc });
            } else {
              doc.classTypeImg = null;
              this.editClassType({ doc_id: classTypeId, doc });
            }
          });
        } else {
          console.log("cors");
          if (file && file.fileData && !file.isUrl) {
            S3.upload(
              { files: { "0": file.fileData }, path: "schools" },
              (err, res) => {
                if (err) {
                }
                if (res) {
                  doc.classTypeImg = res.secure_url;
                  this.editClassType({ doc_id: classTypeId, doc });
                }
              }
            );
          } else if (file && file.isUrl) {
            doc.classTypeImg = file.file;
            this.editClassType({ doc_id: classTypeId, doc });
          } else {
            doc.classTypeImg = null;
            this.editClassType({ doc_id: classTypeId, doc });
          }
        }
        console.groupEnd("ClassTypeDetails");
      });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  };

  handleImageUploadClose = () => {
    this.setState(state => {
      return {
        ...state,
        showBackgroundUpload: false,
        selectedClassTypeData: null,
        file: null
      }
    })
  }

  editClassType = ({ doc, doc_id }) => {
    const { popUp } = this.props;
    Meteor.call("classType.editClassType", { doc, doc_id }, (error, result) => {
      if (error) {
      }
      if (result) {
        popUp.appear("success", {
          title: "Message",
          content: "Image Saved Successfully"
        });

      }
    });
  };

  moveToNextTab = () => {
    this.props.moveToNextTab(3);
  };

  moveToPreviousTab = () => {
    this.props.moveToNextTab(1);
  };

  _getCategoryName = (categoryId, categoryData) => {
    let categoryName = "";
    for (let i = 0; i < categoryData.length; ++i) {
      if (categoryData[i]._id === categoryId) {
        return categoryData[i].name;
      }
    }
  };

  modifySelectSubjectsInClassTypeData = () => {
    const { classTypeData } = this.props;
    classTypeData.map(obj => {
      obj.selectedSkillSubject.map(subjectData => {
        if (subjectData.name == "Others") {
          const categoryName = this._getCategoryName(
            subjectData.skillCategoryId,
            obj.selectedSkillCategory
          );
          subjectData.name = `${subjectData.name} -- ${categoryName}`;
        }
        return subjectData;
      });
      return obj;
    });
    return classTypeData;
  };

  /* LIFTING THE STATE UP */

  getClassTypeData = (classTypeId) => {
    console.info("CHECKING", classTypeId, this.props);
    if (!classTypeId) {
      return null;
    }
    return this.props.classTypeData.filter(data => data._id === classTypeId)[0] || null;
  }

  cancelConfirmationModal = () => {
    this.setState({ showConfirmationModal: false });
  }

  handleDeleteData = () => {
    debugger;
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
    debugger;
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
        formAction: 'edit',
        classTypeForm: true,
        selectedClassTypeData: classTypeData
      }
    });
  }

  handleEditClassTimesClick = (classTypeData) => (classTimeData) => (e) => {
    e.stopPropagation();

    this.setState(state => {
      return {
        ...state,
        formAction: 'edit',
        classTimeForm: true,
        selectedClassTimeData: classTimeData,
        selectedClassTypeData: classTypeData,
      }
    })
  }

  handleAddClassTimeClick = (classTypeData) => (e) => {
    e.stopPropagation();

    this.setState(state => {
      return {
        ...state,
        formAction: 'add',
        classTimeForm: true,
        selectedClassTimeData: null,
        selectedClassTypeData: classTypeData
      }
    })
  }

  handleAddClassTypeClick = () => {
    this.setState(state => {
      return {
        ...state,
        formAction: 'add',
        classTypeForm: true,
        selectedClassTypeId: null,
        selectedClassTimeData: null,
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
        formAction: null,
        selectedClassTypeId: null,
        selectedClassTypeData: null,
        selectedClassTimeData: null,
      }
    });
  }

  handleClassTypeFormClose = (parentId, formAction) => {
    if (formAction === 'add') {
      this.setState(state => {
        return {
          ...state,
          formAction,
          classTimeForm: true,
          classTypeForm: false,
          // isBusy: true,
          selectedClassTypeId: parentId
        }
      });
    } else {
      this.setState(state => {
        return {
          ...state,
          formAction,
          classTypeForm: false,
          selectedClassTypeId: null,
          selectedClassTypeData: null
        }
      });
    }
  }

  render() {
    // return <ClassTypeDetailsRender
    //   {...this.props}
    //   modifySelectSubjectsInClassTypeData={this.modifySelectSubjectsInClassTypeData}
    // />
    console.group("MY CLASSTYPE DETAILS RENDER");
    console.log(this.state);
    console.groupEnd();
    return ClassTypeDetailsRender.call(this, this.props, this.state);
  }
}

export default createContainer(props => {
  const { schoolId } = props;
  let classTimesData = [];
  let classTypeData = [];

  let subscription = Meteor.subscribe("classType.getclassType", { schoolId });

  // if (subscription.ready()) {
  classTypeData = ClassType.find({ schoolId: schoolId }).fetch();
  let classTypeIds = classTypeData && classTypeData.map(data => data._id);

  let classTimesDataSubscription = Meteor.subscribe(
    "classTimes.getclassTimesByClassTypeIds",
    {
      schoolId,
      classTypeIds
    }
  );
  classTimesData = ClassTimes.find({ schoolId }, { sort: { _id: -1 } }).fetch();
  // }

  /*Find skills to make this container reactive on skill
    other wise skills are joined with collections using package
    perak:joins */
  SkillCategory.find().fetch();
  SkillSubject.find().fetch();
  /*****************************************************/

  return {
    isLoading: !classTimesDataSubscription.ready() && !subscription.ready(),
    ...props,
    schoolId,
    classTypeData,
    classTimesData
  };
}, withPopUp(ClassTypeDetails));
