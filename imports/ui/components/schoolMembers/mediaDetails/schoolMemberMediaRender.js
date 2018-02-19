import React from "react";
import Grid from 'material-ui/Grid';
import FileUpload from 'material-ui-icons/FileUpload';
import Button from 'material-ui/Button';

import CreateMedia from "/imports/ui/components/schoolView/editSchool/mediaDetails/createMedia.js";
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Thumbnail from '/imports/ui/components/schoolView/editSchool/mediaDetails/mediaList/thumbnail.js';
import ImageGalleryView from "/imports/ui/componentHelpers/imageGalleryView";
// import Thumbnail from './thumbnail';
// import ImageGalleryView from "/imports/ui/componentHelpers/imageGalleryView";

export default function() {
    console.log("this mediaDetails",this)
    const { showCreateMediaModal, mediaFormData, filterStatus, limit , isGalleryView} = this.state;
    const { schoolId, mediaData, classes, fullScreen, schoolView  } = this.props;
    const { collectionData, showEditButton, onDelete, openEditMediaForm } = this.props;
    console.log("media list render props -->>",this.props);
    console.log("media list render state -->>",this.state);
    const { isHovering, thumbnailData, imgIndex } = this.state;
    return (
        <Card style={{marginTop:'42px',width: '850px'}}>
            <Grid container style={{display: 'flex', width: '100%',padding: '12px'}}>
             {
                <CreateMedia
                    showCreateMediaModal={showCreateMediaModal}
                    onClose = {this.closeMediaUpload}
                    formType={showCreateMediaModal}
                    schoolId={this.props.schoolData._id}
                    ref="createMedia"
                    onAdd={this.onAddMedia}
                    onEdit={this.onEditMedia}
                    mediaFormData={mediaFormData}
                    filterStatus={filterStatus}
                    showLoading = {this.showLoading}
                    tagMember={true}
                    taggedMemberInfo={this.props.memberInfo}
                />
            }
                <Grid item md={8} sm={8} xs={8}>
                    Media at School name
                </Grid>
                <Grid item md={4} sm={4} xs={4} style={{textAlign:'center'}}>
                    <Button raised color="accent" onClick={()=> this.setState({showCreateMediaModal:true, mediaFormData: null, filterStatus: false})}>
                        Upload Media <FileUpload />
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    {
                    collectionData.length && (
                        <Grid container>
                            <Grid item xs={12} style={{display: 'inline-flex',justifyContent: 'center'}}>
                                <div style={{width: "100%", maxWidth: 650}}>
                                    <ImageGalleryView
                                        mediaSubscriptionReady={this.props.mediaSubscriptionReady}
                                        changeLimit = {this.props.changeLimit}
                                        lazyLoad={true}
                                        onDelete={onDelete}
                                        openEditMediaForm={openEditMediaForm}
                                        showEditButton={showEditButton}
                                        images={collectionData.map((media)=>({original: media.sourcePath, thumbnail:media.sourcePath, media: media}))}
                                    />
                                </div>
                            </Grid>
                        </Grid>)
                    }
                </Grid>
            </Grid>
        </Card>
    )
}