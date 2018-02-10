import React, {Component,Fragment} from 'react';
import PropTypes from 'prop-types';
import ImageGallery from 'react-image-gallery';

class ImgSlider extends React.Component {
  render() {
    const {images, sliderClass} = this.props;
    return (
      <ImageGallery
        showPlayButton={false}
        showBullets={true}
        items={images}
        showThumbnails={false}
        showFullscreenButton={false}
        />
    );
  }
}

ImgSlider.propTypes = {
  images: PropTypes.arrayOf({
    original: PropTypes.string,
    thumbnail: PropTypes.string
  }),
}

export default ImgSlider;
