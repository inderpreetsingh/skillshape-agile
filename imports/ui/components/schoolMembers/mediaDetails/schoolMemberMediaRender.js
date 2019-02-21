import React from "react";
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import FileUpload from 'material-ui-icons/FileUpload';
import Button from 'material-ui/Button';

import CreateMedia from "/imports/ui/components/schoolView/editSchool/mediaDetails/createMedia.js";
import Card from 'material-ui/Card';
import MediaList from '/imports/ui/components/schoolView/editSchool/mediaDetails/mediaList';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
import { SectionTitle } from '../sharedStyledComponents.js';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: white;
    padding: ${helpers.rhythmDiv}px;
`;

const MediaWrapper = styled.div`
    width: 100%;
    background-color: white;
    box-shadow: ${helpers.lightShadow};
`;

const ButtonWrapper = styled.div`
    padding: ${helpers.rhythmDiv}px; 
    float: right; 
`;

const MediaListWrapper = styled.div`

`;

export default function () {
    const { showCreateMediaModal, mediaFormData, filterStatus, limit, memberInfo, _id, openEditTaggedModal } = this.state;
    const { mediaListfilters, showUploadImageBtn } = this.props;

    return (
        <Wrapper>
            {this.props.schoolData && <SectionTitle bgColor="white">Media at {this.props.schoolData.name}</SectionTitle>}
            <MediaWrapper>
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
                <ButtonWrapper>
                    {
                        showUploadImageBtn && (
                            <Button raised color="accent" onClick={() => this.setState({ showCreateMediaModal: true, mediaFormData: null, filterStatus: false })}>
                                Upload Media <FileUpload />
                            </Button>
                        )
                    }
                </ButtonWrapper>
                <MediaListWrapper>
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
                </MediaListWrapper>
            </MediaWrapper>
        </Wrapper>
    )
}