import React from "react";
import Grid from 'material-ui/Grid';
import FileUpload from 'material-ui-icons/FileUpload';
import Button from 'material-ui/Button';

import CreateMedia from "/imports/ui/components/schoolView/editSchool/mediaDetails/createMedia.js";
import Card from 'material-ui/Card';
import MediaList from '/imports/ui/components/schoolView/editSchool/mediaDetails/mediaList';

export default function() {
    const { showCreateMediaModal, mediaFormData, filterStatus, limit, memberInfo } = this.state;
    console.log("SchoolMemberMedia props -->>",this.props);
    console.log("SchoolMemberMedia state -->>",this.state);
    const { mediaListfilters, showUploadImageBtn } = this.props;

    return (
    <Grid container style={{display: 'flex',padding: '12px'}}>
        <Card style={{marginTop:'42px',width: '850px'}}>
             {
                showUploadImageBtn && (
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
                        taggedMemberInfo={memberInfo}
                    />
                )
            }
                <Grid item md={8} sm={8} xs={8}>
                    {this.props.schoolData && <b>Media at {this.props.schoolData.name}</b>}
                </Grid>
                <Grid item md={4} sm={4} xs={4} style={{padding: '8px',float: 'right'}}>
                    {
                        showUploadImageBtn && (
                            <Button raised color="accent" onClick={()=> this.setState({showCreateMediaModal:true, mediaFormData: null, filterStatus: false})}>
                                Upload Media <FileUpload />
                            </Button>
                        )
                    }
                </Grid>
                <Grid item xs={12}>
                    <MediaList
                        changeLimit = {() => alert('changeLimit')}
                        limit= {limit || 0}
                        schoolId={this.props.schoolData._id}
                        onDelete={() => alert('changeLimit')}
                        openEditMediaForm={() => alert('changeLimit')}
                        showEditButton={false}
                        filters={mediaListfilters}
                        memberExists={true}
                        handleTaggingMembers={this.props.handleTaggingMembers}
                        schoolData={this.props.schoolData}
                        memberInfo={memberInfo}
                    />
                    {
                    /*collectionData.length && (
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
                        </Grid>)*/
                    }
                </Grid>
        </Card>
    </Grid>
    )
}