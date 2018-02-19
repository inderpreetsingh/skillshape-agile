import React from "react";
import Grid from 'material-ui/Grid';
import FileUpload from 'material-ui-icons/FileUpload';
import Button from 'material-ui/Button';

import CreateMedia from "/imports/ui/components/schoolView/editSchool/mediaDetails/createMedia.js";

// import Thumbnail from './thumbnail';
// import ImageGalleryView from "/imports/ui/componentHelpers/imageGalleryView";

export default function() {
    console.log("this mediaDetails",this)
    /*const { showCreateMediaModal }= this.state;
    const schoolId=false;
    const mediaFormData='xyz';
    const filterStatus='xyz';*/
    return (
        <Grid container>
         {/*<CreateMedia
            showCreateMediaModal={showCreateMediaModal}
            onClose = {this.closeMediaUpload}
            formType={showCreateMediaModal}
            schoolId={schoolId}
            ref="createMedia"
            onAdd={this.onAddMedia}
            onEdit={this.onEditMedia}
            mediaFormData={mediaFormData}
            filterStatus={filterStatus}
            showLoading = {this.showLoading}
        />*/}
            <div style={{textAlign:"right",padding: 8}}>
                <Button raised color="accent" onClick={()=> this.setState({showCreateMediaModal:true, mediaFormData: null, filterStatus: false})}>
                    Upload Media <FileUpload />
                </Button>
            </div>
        </Grid>
    )
}