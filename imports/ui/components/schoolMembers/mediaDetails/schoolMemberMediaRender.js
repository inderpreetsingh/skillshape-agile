import React from "react";
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import FileUpload from 'material-ui-icons/FileUpload';
import Button from 'material-ui/Button';
import Card from 'material-ui/Card';

import { EmailUsDialogBox } from '/imports/ui/components/landing/components/dialogs/';
import CreateMedia from "/imports/ui/components/schoolView/editSchool/mediaDetails/createMedia.js";
import NoMediaFound from '/imports/ui/components/landing/components/helpers/NoMediaFound.jsx';
import MediaList from '/imports/ui/components/schoolView/editSchool/mediaDetails/mediaList';

import { rhythmDiv, lightShadow } from '/imports/ui/components/landing/components/jss/helpers.js';
import { SectionTitle } from '../sharedStyledComponents.js';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: white;
    padding: ${rhythmDiv}px;
    padding-bottom: ${rhythmDiv * 4}px;
`;

const MediaWrapper = styled.div`
    width: 100%;
    background-color: white;
    box-shadow: ${lightShadow};
`;

const ButtonWrapper = styled.div`
    padding: ${rhythmDiv}px; 
    float: right; 
`;

const MediaListWrapper = styled.div`

`;

export default function () {
    const { showCreateMediaModal, mediaFormData, emailUsDialog, filterStatus, limit, memberInfo, _id, openEditTaggedModal } = this.state;
    const { mediaListfilters, showUploadImageBtn, schoolData } = this.props;

    return (
        <Wrapper>
            {emailUsDialog && <EmailUsDialogBox
                ourEmail={schoolData.email}
                schoolData={schoolData}
                open={emailUsDialog}
                onModalClose={this.handleDialogState('emailUsDialog', false)} />
            }
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
                        noMediaFound={<NoMediaFound
                            schoolName={schoolData.name}
                            siteLink={schoolData.website}
                            onEmailButtonClick={this.handleDialogState('emailUsDialog', true)} />}
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