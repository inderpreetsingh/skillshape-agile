import React from 'react';
import ReactDOM from 'react-dom';
import ImageGallery from 'react-image-gallery';
import Button from 'material-ui/Button';
import ModeEditIcon from 'material-ui-icons/ModeEdit';
import DeleteIcon from 'material-ui-icons/Delete';

import { withStyles } from "/imports/util";
import './gallery.css';
const PREFIX_URL = 'https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/';
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
      thumbnailPosition: 'bottom',
      showVideo: {},
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
    if (this.state.slideInterval !== prevState.slideInterval ||
        this.state.slideDuration !== prevState.slideDuration) {
      // refresh setInterval
      this._imageGallery.pause();
      this._imageGallery.play();
    }
  }
  _renderCustomControls = (events) => {
    if(this.props.showEditButton){
  	 return (<div style={{position: 'absolute', zIndex: 5,top: '3%', left: '3%'}}>
      <Button onClick={(e)=>{this.props.openEditMediaForm(this.props.images[this._imageGallery.getCurrentIndex()]['media'])}}  fab mini color="accent" aria-label="edit" className={this.props.classes.button}>
        <ModeEditIcon />
      </Button>
      <Button fab mini aria-label="delete" onClick={(e)=>{this.props.onDelete(this.props.images[this._imageGallery.getCurrentIndex()]['media'])}} className={this.props.classes.button}>
        <DeleteIcon />
      </Button></div>)
    }
    return;
  }
  _onImageClick(event) {
    console.debug('clicked on image', event.target, 'at index', this.props.images[this._imageGallery.getCurrentIndex()]);
  }

  _onImageLoad(event) {
    console.debug('loaded image', event.target.src);
  }

  _onSlide(index) {
    this._resetVideo();
    console.debug('slid to index', index);
  }

  _onPause(index) {
    console.debug('paused on index', index);
  }

  _onScreenChange(fullScreenElement) {
    console.debug('isFullScreen?', !!fullScreenElement);
  }

  _onPlay(index) {
    console.debug('playing from index', index);
  }

  _handleInputChange(state, event) {
    this.setState({[state]: event.target.value});
  }

  _handleCheckboxChange(state, event) {
    this.setState({[state]: event.target.checked});
  }

  _handleThumbnailPositionChange(event) {
    this.setState({thumbnailPosition: event.target.value});
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
    this.setState({showVideo: {}});

    if (this.state.showPlayButton) {
      this.setState({showGalleryPlayButton: true});
    }

    if (this.state.showFullscreenButton) {
      this.setState({showGalleryFullscreenButton: true});
    }
  }

  _toggleShowVideo(url) {
    this.state.showVideo[url] = !Boolean(this.state.showVideo[url]);
    this.setState({
      showVideo: this.state.showVideo
    });

    if (this.state.showVideo[url]) {
      if (this.state.showPlayButton) {
        this.setState({showGalleryPlayButton: false});
      }

      if (this.state.showFullscreenButton) {
        this.setState({showGalleryFullscreenButton: false});
      }
    }
  }

  _renderVideo(item) {
    return (
      <div className='image-gallery-image'>
        {
          this.state.showVideo[item.embedUrl] ?
            <div className='video-wrapper'>
                <a
                  className='close-video'
                  onClick={this._toggleShowVideo.bind(this, item.embedUrl)}
                >
                </a>
                <iframe
                  width='560'
                  height='315'
                  src={item.embedUrl}
                  frameBorder='0'
                  allowFullScreen
                >
                </iframe>
            </div>
          :
            <a onClick={this._toggleShowVideo.bind(this, item.embedUrl)}>
              <div className='play-button'></div>
              <img src={item.original}/>
              {
                item.description &&
                  <span
                    className='image-gallery-description'
                    style={{right: '0', left: 'initial'}}
                  >
                    {item.description}
                  </span>
              }
            </a>
        }
      </div>
    );
  }


  render() {
    return (
        <ImageGallery
          ref={i => this._imageGallery = i}
          items={this.props.images}
          lazyLoad={false}
          onClick={this._onImageClick.bind(this)}
          onImageLoad={this._onImageLoad}
          onSlide={this._onSlide.bind(this)}
          onPause={this._onPause.bind(this)}
          onScreenChange={this._onScreenChange.bind(this)}
          onPlay={this._onPlay.bind(this)}
          infinite={this.state.infinite}
          showBullets={this.state.showBullets}
          showFullscreenButton={this.state.showFullscreenButton && this.state.showGalleryFullscreenButton}
          showPlayButton={this.state.showPlayButton && this.state.showGalleryPlayButton}
          showThumbnails={this.state.showThumbnails}
          showIndex={this.state.showIndex}
          showNav={this.state.showNav}
          thumbnailPosition={this.state.thumbnailPosition}
          slideDuration={parseInt(this.state.slideDuration)}
          slideInterval={parseInt(this.state.slideInterval)}
          slideOnThumbnailHover={this.state.slideOnThumbnailHover}
          renderCustomControls = {this._renderCustomControls}
        />

    );
  }
}
const styles = theme => ({
    button: {
      margin: theme.spacing.unit,
    },
  });
export default withStyles(styles)(ImageGalleryView)