import React from "react";
import { createContainer } from 'meteor/react-meteor-data';

// import collection definition over here
import ImportLogs from "/imports/api/importLogs/fields";
import schoolUploadRender from "./schoolUploadRender"

class schoolUploadView extends React.Component {

	constructor(props) {
    super(props);
    this.state = {
      fileUploadName: null
    };
  }
  fileSelected = (e)=>{
    var files = this.fileInputRef.files[0];
    console.log("e.target.value>>??>>>>> ",files)
    let fileUploadName =  files.name || null;
    this.setState({fileUploadName})
  }

  uploadCSV = (e)=>{
    var files = this.fileInputRef.files
    var reader = new FileReader();
     reader.onload = function(fileLoadEvent) {
        console.log("files>>>>>>>>>>>> ",files[0])
        console.log("reader.result>>>>>>>>>>>> ",reader.result)
        Meteor.call('project_upload', files[0].name, reader.result,function(error, result){
          if(error){
            console.log("errrr in file parseing >>>> ", error)
            toastr.error("Please try again. some error in provided data","Error");
          }else{
            // try{
            //   $(".fileinput-box").trigger("reset")
            // }catch(e){

            // }
            toastr.success("All School data uploaded successfully","Success");
          }
        });
     };
     reader.readAsBinaryString(files[0]);
  }

  render() {
    return schoolUploadRender.call(this, this.props, this.state)
  }

}

export default createContainer(props => {
  if(props.isUserSubsReady) {
   	Meteor.subscribe("importLogs.getAllLogs");

  }
  let importLogs = ImportLogs.find().fetch();
  /*****************************************************/

  return {
  	...props,
    importLogs
  };

}, schoolUploadView);