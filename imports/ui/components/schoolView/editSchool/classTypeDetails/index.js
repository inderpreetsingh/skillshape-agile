import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ClassTypeDetailsRender from './classTypeDetailsRender';
import '/imports/api/classPricing/methods';

import ClassType from "/imports/api/classType/fields";
import SkillCategory from "/imports/api/skillCategory/fields";
import SkillSubject from "/imports/api/skillSubject/fields";
import ClassTimes from "/imports/api/classTimes/fields";

class ClassTypeDetails extends React.Component {

    constructor(props) {
    	super(props);
        this.state = { 
           file: null,
        }  
    }

    getChildTableData(parentData) {
        console.log("getChildTableData -->>", parentData._id)
  		return ClassTimes.find({classTypeId: parentData._id}).fetch();
    }
  	
  	handleImageChange = (file)=> {
        this.setState({file})
  	}

  	handleImageSave = (schoolId, classTypeId) => {
      console.log("<<<< handleImageSave called-->>",this.state)
      const { file } = this.state;
      let doc = {
        schoolId: schoolId,
      }
      if(file && file.fileData && !file.isUrl) {
        S3.upload({files: { "0": file.fileData}, path:"schools"}, (err, res) => {
            if(err) {
                console.error("err ",err);
            }
            if(res) {
                doc.classTypeImg = res.secure_url; 
                this.editClassType({ doc_id: classTypeId, doc})
            }
        })

      } else if(file && file.isUrl) {
        doc.classTypeImg = file.file;
        this.editClassType({ doc_id: classTypeId, doc})
      } else {
        doc.classTypeImg = null;
        this.editClassType({ doc_id: classTypeId, doc})
      }

  	}

    editClassType = ({ doc, doc_id })=> {
        
        Meteor.call("classType.editClassType", { doc, doc_id }, (error, result) => {
            if (error) {
              console.error("error", error);
            }
            if (result) {
                
            }
        });
    }
  	
    render() {
    	return ClassTypeDetailsRender.call(this, this.props, this.state)
    }
}  

export default createContainer(props => {
    const { schoolId } = props;
    let classTimesData = [];
    let classTypeData = [];

    let subscription = Meteor.subscribe("classType.getclassType", {schoolId});
    
    if(subscription.ready()) {
        classTypeData = ClassType.find({ schoolId: schoolId }).fetch();
        let classTypeIds = classTypeData && classTypeData.map((data) => data._id);
        
        Meteor.subscribe("classTimes.getclassTimesByClassTypeIds", {schoolId, classTypeIds});
        classTimesData = ClassTimes.find({ schoolId },{sort: {_id: -1}}).fetch();
    }

    console.log("classTimesData -->>",classTimesData)
    /*Find skills to make this container reactive on skill
    other wise skills are joined with collections using package
    perak:joins */
    SkillCategory.find().fetch()
    SkillSubject.find().fetch()
    /*****************************************************/

    return {
        ...props,
        schoolId,
        classTypeData,
        classTimesData,
    };

}, ClassTypeDetails);