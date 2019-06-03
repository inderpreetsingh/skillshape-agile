import React from 'react';
import Gallery from 'react-grid-gallery';
import Button from 'material-ui/Button';
import ModeEditIcon from 'material-ui-icons/ModeEdit';
import DeleteIcon from 'material-ui-icons/Delete';

import { withSubscriptionAndPagination, withStyles } from '/imports/util';
import Media from '/imports/api/media/fields';
import ConfirmationModal from '/imports/ui/modal/confirmationModal';


class ImageGridGallery extends React.Component {
  state = {
    showConfirmationModal: false,
  };

  renderCustomControls = media => (
    <div style={{
      position: 'absolute', zIndex: 5, top: '3%', left: '3%',
    }}
    >
      <Button
        onClick={(e) => {
          this.props.openEditMediaForm(media, e);
        }}
        fab
        mini
        color="accent"
        aria-label="edit"
        className={this.props.classes.button}
      >
        <ModeEditIcon />
      </Button>
      <Button
        fab
        mini
        aria-label="delete"
        onClick={(event) => {
          this.showConfirmationModal(media, event);
        }}
        className={this.props.classes.button}
      >
        <DeleteIcon />
      </Button>
    </div>
  );

  showConfirmationModal = (media, event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ selectedMedia: media, showConfirmationModal: true });
  };

  cancelConfirmationModal = () => this.setState({ showConfirmationModal: false, selectedMedia: false });

  render() {
    const { collectionData } = this.props;
    const images = collectionData.map((media) => {
      const img = new Image();
      img.src = media.sourcePath;
      const obj = {};
      const ratio = img.width / img.height;
      if (ratio == 1) {
        obj.thumbnailWidth = 313;
        obj.thumbnailHeight = 320;
      } else if (ratio > 1) {
        obj.thumbnailWidth = 320;
        obj.thumbnailHeight = 113;
      } else if (ratio < 1) {
        obj.thumbnailWidth = 240;
        obj.thumbnailHeight = 320;
      }
      return {
        ...obj,
        src: media.sourcePath,
        thumbnail: media.sourcePath,
        media,
        isSelected: false,
        customOverlay: !this.props.hideCustomControls && this.renderCustomControls(media),
        scaletwidth: 100,
      };
    });
    return (
      <div>
        {this.state.showConfirmationModal && (
          <ConfirmationModal
            open={this.state.showConfirmationModal}
            submitBtnLabel="Yes, Delete"
            cancelBtnLabel="Cancel"
            message="This will permanently delete this media. Are you sure? "
            onSubmit={() => {
              this.props.onDelete(this.state.selectedMedia);
              this.setState({ showConfirmationModal: false, selectedMedia: false });
            }}
            onClose={this.cancelConfirmationModal}
          />
        )}
        <Gallery rowHeight={220} enableImageSelection={false} images={images} />
      </div>
    );
  }
}

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});
export default withStyles(styles)(
  withSubscriptionAndPagination(ImageGridGallery, {
    collection: Media,
    subscriptionName: 'media.getMedia',
    recordLimit: 20,
  }),
);
