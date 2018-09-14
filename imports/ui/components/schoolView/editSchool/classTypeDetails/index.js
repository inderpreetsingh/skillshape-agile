import React from "react";
import { createContainer } from "meteor/react-meteor-data";
import ClassTypeDetailsRender from "./classTypeDetailsRender";
import "/imports/api/classPricing/methods";
import { compressImage } from "/imports/util";
import ClassType from "/imports/api/classType/fields";
import SkillCategory from "/imports/api/skillCategory/fields";
import SkillSubject from "/imports/api/skillSubject/fields";
import ClassTimes from "/imports/api/classTimes/fields";
import { withPopUp } from "/imports/util";
class ClassTypeDetails extends React.Component {
  constructor(props) {
    super(props);
    debugger;
    this.state = {
      file: null
    };
  }

  getChildTableData(parentData) {
    return ClassTimes.find({ classTypeId: parentData._id }).fetch();
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
    try{
      compressImage(file['org'],file.file,file.isUrl).then((result) => {
        console.group("ClassTypeDetails");
        if(_.isArray(result)){
          console.log('Non-cors');
          for (let i = 0; i <= 1; i++) {
            allUploadPromise.push(new Promise((resolve,reject)=>{
              S3.upload({ files: { "0": result[i] }, path: "compressed" }, (err, res) => {
                if (res) {
                  if(i==0){
                    doc.medium= res.secure_url;
                    resolve();
                  }else{
                    doc.low = res.secure_url;
                    resolve();
                  }
                }
      
              });
            }))
          }
          Promise.all(allUploadPromise).then(()=>{
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
          })
        }
        else{
							console.log('cors');
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

      })
    }catch(error){
    throw new Meteor.Error(error);
    }
  };

  editClassType = ({ doc, doc_id }) => {
    const {popUp} = this.props;
    Meteor.call("classType.editClassType", { doc, doc_id }, (error, result) => {
      if (error) {
      }
      if (result) {
        popUp.appear("success", { title: "Message", content: 'Image Saved Successfully' });
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

  render() {
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

  Meteor.subscribe("classTimes.getclassTimesByClassTypeIds", {
    schoolId,
    classTypeIds
  });
  classTimesData = ClassTimes.find({ schoolId }, { sort: { _id: -1 } }).fetch();
  // }

  /*Find skills to make this container reactive on skill
    other wise skills are joined with collections using package
    perak:joins */
  SkillCategory.find().fetch();
  SkillSubject.find().fetch();
  /*****************************************************/

  return {
    ...props,
    schoolId,
    classTypeData,
    classTimesData
  };
}, (withPopUp(ClassTypeDetails)));

