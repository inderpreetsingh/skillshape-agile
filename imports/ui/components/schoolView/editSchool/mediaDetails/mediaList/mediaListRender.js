import isEmpty from 'lodash/isEmpty';
import Grid from 'material-ui/Grid';
import React from 'react';
import ImageGalleryView from '/imports/ui/componentHelpers/imageGalleryView';

export default function () {
  const {
    collectionData,
    noMediaFound,
    showEditButton,
    onDelete,
    openEditMediaForm,
    memberExists,
    memberInfo,
  } = this.props;

  
  return (
    <div style={{ textAlign: 'center' }}>
      {isEmpty(collectionData) ? (
        React.cloneElement(noMediaFound)
      ) : (
        <Grid container>
          <Grid item xs={12} style={{ display: 'inline-flex', justifyContent: 'center' }}>
            <div style={{ width: '100%' }}>
              <ImageGalleryView
                mediaSubscriptionReady={this.props.mediaSubscriptionReady}
                changeLimit={this.props.changeLimit}
                lazyLoad
                onDelete={onDelete}
                openEditMediaForm={openEditMediaForm}
                showEditButton={showEditButton}
                images={collectionData.map(media => ({
                  original: media.sourcePath,
                  thumbnail: media.sourcePath,
                  media,
                }))}
                showTagButton={memberExists}
                schoolData={this.props.schoolData}
                memberInfo={memberInfo}
              />
            </div>
          </Grid>
        </Grid>
      )}
    </div>
  );
}
