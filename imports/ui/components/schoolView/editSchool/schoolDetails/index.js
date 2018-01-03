import React from 'react';
import SchoolDetailsRender from './schoolDetailsRender';
import styles from "/imports/ui/components/schoolView/style";
import { withStyles } from "/imports/util";
import { toastrModal } from '/imports/util';

class SchoolDetails extends React.Component {

  constructor(props) {
    super(props);
    let { schoolData } = this.props;
    let {
      name,
      website,
      phone,
      firstName,
      lastName,
      email,
      backGroundVideoUrl,
      mainImage,
      aboutHtml,
      studentNotesHtml,
    } = schoolData;

    this.state = {
      aboutHtml: aboutHtml,
      studentNotesHtml: studentNotesHtml ? studentNotesHtml:'',
      name: name,
      website: website,
      phone: phone,
      firstName: firstName,
      lastName: lastName,
      email: email,
      backGroundVideoUrl: backGroundVideoUrl,
      mainImage: mainImage,
    };
  }

  componentDidMount() {
    // $('#summernote1').summernote();
    // $('#summernote2').summernote();
  }

  updateSchool = () => {
    let imageFile = this.refs.schoolImage.files[0];
    if(imageFile) {
      S3.upload({ files: { "0": imageFile}, path: "schools"}, (err, res) => {
        if(err) {
          console.error("err ",err)
        }
        if(res) {
          this.editSchoolCall(res)
        }
      })
    } else {
      this.editSchoolCall()
    }
  }

  editSchoolCall = (imageUpload) => {
    const { schoolId,toastr } = this.props;

    let schoolObj = {...this.state}
    Meteor.call("editSchool", schoolId, schoolObj, (error, result) => {
      if (error) {
        toastr.error("Oops! something went wrong.",error.message);
      }
      if (result) {
          toastr.success("School editing successfull!!!!!!","Success");
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
    this.setState({ aboutHtml: value })
  }
  // This is used to set Content into `Notes for Students` editor.
  studentNotesTREOnChange = (value)=> {
    this.setState({ studentNotesHtml: value })
  }

  render() {
    return SchoolDetailsRender.call(this, this.props, this.state)
  }
}

export default withStyles(styles)(toastrModal(SchoolDetails))