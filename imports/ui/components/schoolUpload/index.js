import React from "react";
import { createContainer } from 'meteor/react-meteor-data';
import schoolUploadRender from "./schoolUploadRender"
import json2csv from 'json2csv';
import Typography from 'material-ui/Typography';
import {downloadingFunction} from '/imports/util';
// import collection definition over here
import ImportLogs from "/imports/api/importLogs/fields";
import Preloader from '/imports/ui/components/landing/components/Preloader.jsx';
import { toastrModal } from '/imports/util';


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
        const { toastr } = this.props;
        reader.onload = function(fileLoadEvent) {
            Meteor.call('project_upload', files[0].name, reader.result,function(error, result){
                if(error){
                    console.log("errrr in file parseing >>>> ", error)
                    toastr.error("Please try again. some error in provided data","Error");
                } else {
                    toastr.success("All School data uploaded successfully","Success");
                }
            });
        };
        reader.readAsBinaryString(files[0]);
    }

    downloadErrorCSV = (logId) => {
        let importLog = ImportLogs.findOne({ _id: logId });
        if (importLog && importLog.errorRecordCount > 0) {
            const { toastr } = this.props;
            Meteor.call("getErrorDocs", logId, (err, errorRecord) => {
                if (err) {
                    toastr.error("Error while fetching the records");
                } else {
                    if (errorRecord === false) {
                        toastr.info("No record Found");
                    } else {
                        let csvData = json2csv({ 'data': errorRecord });
                        downloadingFunction(csvData, `${importLog.fileName}ErrorDocuments.csv`, 'text/csv;encoding:utf-8');
                    }
                }
            })
        } else {
            toastr.info("No error record found");
        }
    }

    render() {
        const { currentUser, isUserSubsReady } = this.props;

        console.log("School Upload props -->>",this.props);

        if(!isUserSubsReady)
        return <Preloader/>

        if(currentUser && Roles.userIsInRole(currentUser._id,"Superadmin")) {
            return schoolUploadRender.call(this, this.props, this.state)
        } else {
            return  <Typography type="display2" gutterBottom align="center">
                Access Denied
            </Typography>
        }

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

}, toastrModal(schoolUploadView));