import React from 'react';
import SchoolDetailsRender from './schoolDetailsRender';
import styles from "/imports/ui/components/schoolView/style";
import { withStyles, withPopUp,emailRegex } from "/imports/util";

class SchoolDetails extends React.Component {

  constructor(props) {
    super(props);
    let { schoolData,handleIsSavedState } = this.props;
    let { name, website, phone, firstName, lastName, email, backGroundVideoUrl, mainImage, aboutHtml, studentNotesHtml, currency, } = schoolData;
    handleIsSavedState(true);
    this.state = {
      aboutHtml: aboutHtml || "",
      studentNotesHtml: studentNotesHtml || "",
      name: name || "",
      website: website || "",
      phone: phone,
      firstName: firstName || "",
      lastName: lastName || "",
      email: email,
      backGroundVideoUrl: backGroundVideoUrl || "",
      mainImage: schoolData.mainImage || "",
      isLoading:false, // Loading variable in state.
      currency: currency || "",
      previousSelectedCurrency: currency || ""
    };
  }

  componentDidMount() {
   window.scroll(0,0)
  }

  updateSchool = () => {
    let imageFile = this.refs.schoolImage.files[0];
    if(imageFile) {
      S3.upload({ files: { "0": imageFile}, path: "schools"}, (err, res) => {
        if(err) {
        }
        if(res) {
          this.editSchoolCall(res)
        }
      })
    } else {
      this.editSchoolCall()
    }
  }

  editSchoolCall = (nextTab, event) => {
    // Start loading on when user press button to update school details.
    const { schoolId,popUp,handleIsSavedState } = this.props;
    
    let schoolObj = {...this.state}
    if(this.props.schoolData && this.props.schoolData.mainImage) {
      schoolObj['mainImage'] = this.props.schoolData && this.props.schoolData.mainImage;
    }
    if(!schoolObj.email){
      popUp.appear('alert',{content:'Email is Required'});
      return
    }
    if(!emailRegex.email.test(schoolObj.email)){
      popUp.appear('alert',{content:'Email is Invalid'});
      return
    }
    this.setState({isLoading: true});
    // This function is used to edit school details.
    Meteor.call("editSchool", schoolId, schoolObj, (error, result) => {
      if (error) {
        popUp.appear("alert", { title: "Oops! something went wrong.", content: error.message })
      }
      if (result) {
        popUp.appear("success", { title: "Success", content:  "School details editing successful." })
      }
      // Stop loading on completion of editing school details.
      this.setState({isLoading: false});
      handleIsSavedState(true);
      if(nextTab) {
        this.props.moveToNextTab(1);
      }
    });
  }

  onAddMedia = ()=> {

  }

  closeMediaUpload = ()=> {

  }

  onEditMedia = ()=> {

  }
  // This is used to set Content into `About School` editor.
  aboutSchoolTREOnChange = (value)=> {
		console.log("TCL: aboutSchoolTREOnChange -> value", value)
    this.props.handleIsSavedState(false);
    this.setState({ aboutHtml: value })
  }
  // This is used to set Content into `Notes for Students` editor.
  studentNotesTREOnChange = (value)=> {
    this.props.handleIsSavedState(false);
    this.setState({ studentNotesHtml: value })
  }

  render() {
    return SchoolDetailsRender.call(this, this.props, this.state)
  }
}

export default withStyles(styles)(withPopUp(SchoolDetails))