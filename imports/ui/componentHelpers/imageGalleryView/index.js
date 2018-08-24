import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import ImageGallery from "react-image-gallery";
import Button from "material-ui/Button";
import ModeEditIcon from "material-ui-icons/ModeEdit";
import DeleteIcon from "material-ui-icons/Delete";
import Multiselect from "react-widgets/lib/Multiselect";
import Icon from "material-ui/Icon";

import ConfirmationModal from "/imports/ui/modal/confirmationModal";
import TaggedMemberDialogBox from "/imports/ui/components/landing/components/dialogs/TaggedMemberDialogBox.js";
import EditTaggedMemberDialogBox from "/imports/ui/components/landing/components/dialogs/EditTaggedMemberDialogBox.js";
import { ContainerLoader } from "/imports/ui/loading/container.js";
import { withStyles } from "/imports/util";
import "./gallery.css";
const PREFIX_URL =
  "https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/";
import "react-image-gallery/styles/css/image-gallery.css";
class ImageGalleryView extends React.Component {
  constructor() {
    super();
    this.state = {
      showIndex: false,
      slideOnThumbnailHover: false,
      showBullets: true,
      infinite: true,
      showThumbnails: true,
      showFullscreenButton: true,
      showGalleryFullscreenButton: true,
      showPlayButton: true,
      showGalleryPlayButton: true,
      showNav: true,
      slideDuration: 450,
      slideInterval: 2000,
      thumbnailPosition: "bottom",
      showVideo: {}
    };

    // this.images = [
    //   {
    //     thumbnail: `${PREFIX_URL}4v.jpg`,
    //     original: `${PREFIX_URL}4v.jpg`,
    //     embedUrl: 'https://www.youtube.com/embed/4pSzhZ76GdM?autoplay=1&showinfo=0',
    //     description: 'Render custom slides within the gallery',
    //     renderItem: this._renderVideo.bind(this)
    //   },
    //   {
    //     original: `${PREFIX_URL}1.jpg`,
    //     thumbnail: `${PREFIX_URL}1t.jpg`,
    //     // originalClass: 'featured-slide',
    //     // thumbnailClass: 'featured-thumb',
    //     description: 'Custom class for slides & thumbnails'
    //   },
    // ];
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.slideInterval !== prevState.slideInterval ||
      this.state.slideDuration !== prevState.slideDuration
    ) {
      // refresh setInterval
      this._imageGallery.pause();
      this._imageGallery.play();
    }
  }
  _renderCustomControls = events => {
    if (this.props.showEditButton) {
      return (
        <div
          style={{
            position: "absolute",
            zIndex: 5,
            top: "3%",
            left: "3%",
            display: "flex"
          }}
        >
          <Button
            onClick={e => {
              this.props.openEditMediaForm(
                this.props.images[this._imageGallery.getCurrentIndex()]["media"]
              );
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
            onClick={this.showConfirmationModal}
            className={this.props.classes.button}
          >
            <DeleteIcon />
          </Button>
        </div>
      );
    }
    if (this.props.showTagButton) {
      return (
        <div
          style={{
            position: "absolute",
            zIndex: 5,
            top: "3%",
            left: "3%",
            display: "flex"
          }}
        >
          <i
            onClick={this.showTaggedMemberInfo}
            style={{ display: this.state.showListOfMembers ? "none" : "block" }}
            className="material-icons"
            style={{ display: "block" }}
          >
            info
          </i>
        </div>
      );
    }
    return;
  };
  _onImageClick(event) {
    
  }

  _onImageLoad(event) {
  }

  _onSlide(index) {
    this._resetVideo();
    imagesLength = this.props.images.length - 1;
    if (index == imagesLength) {
      this.props.changeLimit();
    }
  }

  _onPause(index) {
  }

  _onScreenChange(fullScreenElement) {
  }

  _onPlay(index) {
  }

  _handleInputChange(state, event) {
    this.setState({ [state]: event.target.value });
  }

  _handleCheckboxChange(state, event) {
    this.setState({ [state]: event.target.checked });
  }

  _handleThumbnailPositionChange(event) {
    this.setState({ thumbnailPosition: event.target.value });
  }

  // _getStaticImages() {
  //   let images = [];
  //   for (let i = 2; i < 12; i++) {
  //     images.push({
  //       original: `${PREFIX_URL}${i}.jpg`,
  //       thumbnail:`${PREFIX_URL}${i}t.jpg`
  //     });
  //   }

  //   return images;
  // }

  _resetVideo() {
    this.setState({ showVideo: {} });

    if (this.state.showPlayButton) {
      this.setState({ showGalleryPlayButton: true });
    }

    if (this.state.showFullscreenButton) {
      this.setState({ showGalleryFullscreenButton: true });
    }
  }

  _toggleShowVideo(url) {
    this.state.showVideo[url] = !Boolean(this.state.showVideo[url]);
    this.setState({
      showVideo: this.state.showVideo
    });

    if (this.state.showVideo[url]) {
      if (this.state.showPlayButton) {
        this.setState({ showGalleryPlayButton: false });
      }

      if (this.state.showFullscreenButton) {
        this.setState({ showGalleryFullscreenButton: false });
      }
    }
  }

  _renderVideo(item) {
    return (
      <div className="image-gallery-image">
        {this.state.showVideo[item.embedUrl] ? (
          <div className="video-wrapper">
            <a
              className="close-video"
              onClick={this._toggleShowVideo.bind(this, item.embedUrl)}
            />
            {/*<iframe
                  width='560'
                  height='315'
                  src={item.embedUrl}
                  frameBorder='0'
                  allowFullScreen
                >
                </iframe>*/}
          </div>
        ) : (
          <a onClick={this._toggleShowVideo.bind(this, item.embedUrl)}>
            <div className="play-button" />
            <img src={item.original} />
            {item.description && (
              <span
                className="image-gallery-description"
                style={{ right: "0", left: "initial" }}
              >
                {item.description}
              </span>
            )}
          </a>
        )}
      </div>
    );
  }
  showConfirmationModal = () => this.setState({ showConfirmationModal: true });
  cancelConfirmationModal = () =>
    this.setState({ showConfirmationModal: false });
  showTaggedMemberInfo = () => {
    // const taggedMemberDetails = this.props.images[this._imageGallery.getCurrentIndex()]['media'];
    this.setState({
      showListOfMembers: true,
      schoolData: this.props.schoolData
    });
  };
  handleTagPhoto = () => {};

  openEditTaggedModal = () => {
    this.setState({
      openEditTaggedModal: true,
      showListOfMembers: false
    });
  };
  render() {
    return (
      <div style={{ position: "relative" }}>
        {this.state.showConfirmationModal && (
          <ConfirmationModal
            open={this.state.showConfirmationModal}
            submitBtnLabel="Yes, Delete"
            cancelBtnLabel="Cancel"
            message="This will permanently delete this media. Are you sure? "
            onSubmit={() => {
              this.props.onDelete(
                this.props.images[this._imageGallery.getCurrentIndex()]["media"]
              );
              this.setState({ showConfirmationModal: false });
            }}
            onClose={this.cancelConfirmationModal}
          />
        )}
        {this.state.showListOfMembers && (
          <TaggedMemberDialogBox
            open={this.state.showListOfMembers}
            onModalClose={() => this.setState({ showListOfMembers: false })}
            currentMediaData={
             this.props.images? this.props.images[this._imageGallery.getCurrentIndex()]["media"] :''
            }
            openEditTaggedModal={this.openEditTaggedModal}
            schoolData={this.state.schoolData}
            memberInfo={this.props.memberInfo}
          />
        )}
        {this.state.openEditTaggedModal && (
          <EditTaggedMemberDialogBox
            open={this.state.openEditTaggedModal}
            onModalClose={() => this.setState({ openEditTaggedModal: false })}
            openEditTaggedModal={this.openEditTaggedModal}
            currentMediaData={
              this.props.images? this.props.images[this._imageGallery.getCurrentIndex()]["media"] :''
            }
            memberInfo={this.props.memberInfo}
          />
        )}
        {!this.props.mediaSubscriptionReady && <ContainerLoader />}

        <ImageGallery
          ref={i => (this._imageGallery = i)}
          items={this.props.images}
          lazyLoad={this.props.lazyLoad || false}
          onClick={this._onImageClick.bind(this)}
          onImageLoad={this._onImageLoad}
          onSlide={this._onSlide.bind(this)}
          onPause={this._onPause.bind(this)}
          onScreenChange={this._onScreenChange.bind(this)}
          onPlay={this._onPlay.bind(this)}
          infinite={this.state.infinite}
          showBullets={this.state.showBullets}
          showFullscreenButton={
            this.state.showFullscreenButton &&
            this.state.showGalleryFullscreenButton
          }
          showPlayButton={
            this.state.showPlayButton && this.state.showGalleryPlayButton
          }
          showThumbnails={this.state.showThumbnails}
          showIndex={this.state.showIndex}
          showNav={this.state.showNav}
          thumbnailPosition={this.state.thumbnailPosition}
          slideDuration={parseInt(this.state.slideDuration)}
          slideInterval={parseInt(this.state.slideInterval)}
          slideOnThumbnailHover={this.state.slideOnThumbnailHover}
          renderCustomControls={this._renderCustomControls}
        />
      </div>
    );
  }
}
const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  infoButton: {
    display: "block",
    padding: "0",
    minWidth: "47px",
    boxShadow:
      "0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)",
    borderRadius: "50%",
    margin: theme.spacing.unit,
    background: "#03a9f4"
  }
});
export default withStyles(styles)(ImageGalleryView);
