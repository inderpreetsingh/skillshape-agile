import React from "react";
import Grid from 'material-ui/Grid';
import FileUpload from 'material-ui-icons/FileUpload';
import Button from 'material-ui/Button';

import CreateMedia from "/imports/ui/components/schoolView/editSchool/mediaDetails/createMedia.js";
import Card from 'material-ui/Card';
import MediaList from '/imports/ui/components/schoolView/editSchool/mediaDetails/mediaList';

export default function () {
    const { showCreateMediaModal, mediaFormData, filterStatus, limit, memberInfo, _id, openEditTaggedModal } = this.state;
    const { mediaListfilters, showUploadImageBtn } = this.props;

    return (
        <Grid container style={{ display: 'flex', padding: '12px', marginBottom: '16px' }}>
            <Grid item md={12} sm={12} xs={12}>
                {this.props.schoolData && <b>Media at {this.props.schoolData.name}</b>}
            </Grid>
            <Grid item md={12} sm={12} xs={12} style={{ background: '#fff', width: '100%', boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)' }}>
                {
                    showUploadImageBtn && (
                        <CreateMedia
                            showCreateMediaModal={showCreateMediaModal}
                            onClose={this.closeMediaUpload}
                            formType={showCreateMediaModal}
                            schoolId={this.props.schoolData._id}
                            ref="createMedia"
                            onAdd={this.onAddMedia}
                            onEdit={this.onEditMedia}
                            mediaFormData={mediaFormData}
                            filterStatus={filterStatus}
                            showLoading={this.showLoading}
                            tagMember={true}
                            taggedMemberInfo={memberInfo}
                            _id={_id}
                            openEditTaggedModal={openEditTaggedModal}
                            closeEditTaggedModal={this.closeEditTaggedModal}
                        />
                    )
                }
                <Grid item md={4} sm={4} xs={4} style={{ padding: '8px', float: 'right' }}>
                    {
                        showUploadImageBtn && (
                            <Button raised color="accent" onClick={() => this.setState({ showCreateMediaModal: true, mediaFormData: null, filterStatus: false })}>
                                Upload Media <FileUpload />
                            </Button>
                        )
                    }
                </Grid>
                <Grid item xs={12}>
                    <MediaList
                        changeLimit={() => { }}
                        limit={limit || 0}
                        schoolId={this.props.schoolData._id}
                        onDelete={() => { }}
                        openEditMediaForm={() => { }}
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
            </Grid>
        </Grid>
    )
}