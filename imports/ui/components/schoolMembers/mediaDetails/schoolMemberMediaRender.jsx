/* eslint-disable react/no-this-in-sfc */
import FileUpload from 'material-ui-icons/FileUpload';
import Button from 'material-ui/Button';
import React from 'react';
import styled from 'styled-components';
import { SectionTitle } from '../sharedStyledComponents';
import { EmailUsDialogBox } from '/imports/ui/components/landing/components/dialogs/';
import NoMediaFound from '/imports/ui/components/landing/components/helpers/NoMediaFound';
import { lightShadow, rhythmDiv } from '/imports/ui/components/landing/components/jss/helpers';
import CreateMedia from '/imports/ui/components/schoolView/editSchool/mediaDetails/createMedia';
import MediaList from '/imports/ui/components/schoolView/editSchool/mediaDetails/mediaList';

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

const MediaListWrapper = styled.div``;

export default function () {
  const {
    showCreateMediaModal,
    mediaFormData,
    emailUsDialog,
    filterStatus,
    limit,
    memberInfo,
    _id,
    openEditTaggedModal,
  } = this.state;
  const {
    mediaListfilters, showUploadImageBtn, schoolData, handleTaggingMembers,
  } = this.props;

  return (
    <Wrapper>
      {emailUsDialog && (
        <EmailUsDialogBox
          ourEmail={schoolData.email}
          schoolData={schoolData}
          open={emailUsDialog}
          onModalClose={this.handleDialogState('emailUsDialog', false)}
        />
      )}
      {schoolData && (
        <SectionTitle bgColor="white">
          Media at
          {schoolData.name}
        </SectionTitle>
      )}
      <MediaWrapper>
        {showUploadImageBtn && (
          <CreateMedia
            showCreateMediaModal={showCreateMediaModal}
            onClose={this.closeMediaUpload}
            formType={showCreateMediaModal}
            schoolId={schoolData._id}
            ref="createMedia"
            onAdd={this.onAddMedia}
            onEdit={this.onEditMedia}
            mediaFormData={mediaFormData}
            filterStatus={filterStatus}
            showLoading={this.showLoading}
            tagMember
            taggedMemberInfo={memberInfo}
            _id={_id}
            openEditTaggedModal={openEditTaggedModal}
            closeEditTaggedModal={this.closeEditTaggedModal}
          />
        )}
        <ButtonWrapper>
          {showUploadImageBtn && (
            <Button
              raised
              color="accent"
              onClick={() => this.setState({
                showCreateMediaModal: true,
                mediaFormData: null,
                filterStatus: false,
              })
              }
            >
              Upload Media
              {' '}
              <FileUpload />
            </Button>
          )}
        </ButtonWrapper>
        <MediaListWrapper>
          <MediaList
            changeLimit={() => {}}
            limit={limit || 0}
            schoolId={schoolData._id}
            onDelete={() => {}}
            openEditMediaForm={() => {}}
            showEditButton={false}
            filters={mediaListfilters}
            memberExists
            handleTaggingMembers={handleTaggingMembers}
            schoolData={schoolData}
            memberInfo={memberInfo}
            noMediaFound={(
              <NoMediaFound
                schoolName={schoolData.name}
                siteLink={schoolData.website}
                onEmailButtonClick={this.handleDialogState('emailUsDialog', true)}
              />
)}
          />
        </MediaListWrapper>
      </MediaWrapper>
    </Wrapper>
  );
}
