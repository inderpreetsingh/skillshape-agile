import React from 'react';
import SchoolDetailsRender from './schoolDetailsRender';

export default class SchoolDetails extends React.Component {

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
      descHtml, 
    } = schoolData;

    this.state = {
      name: name,
      website: website,
      phone: phone,
      firstName: firstName,
      lastName: lastName,
      email: email,
      backGroundVideoUrl: backGroundVideoUrl,
      mainImage: mainImage,
      aboutHtml: aboutHtml,
      descHtml: descHtml,
    };
  }

  componentDidMount() {
    $('#summernote1').summernote();
    $('#summernote2').summernote();
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
    } else
      this.editSchoolCall()
  }

  editSchoolCall = (imageUpload) => {
    const { schoolId } = this.props;

    let schoolObj = {...this.state, 
      aboutHtml: $('#summernote1').summernote('code'),
      descHtml: $('#summernote2').summernote('code')
    }
    if(imageUpload) {
      schoolObj.mainImage = imageUpload.secure_url
    }
    
    Meteor.call("editSchool", schoolId, schoolObj, (error, result) => {
      if (error) {
        console.log("error", error);
      }
      if (result) {
        setTimeout(() => {
          this.props.moveTab("location_details");
        }, 1000);
      }
    });
  }

  render() {
    return SchoolDetailsRender.call(this, this.props, this.state)
  }
}  