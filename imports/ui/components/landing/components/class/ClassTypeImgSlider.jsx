import React, {Component,Fragment} from 'react';
import PropTypes from 'prop-types';
import ImageGallery from 'react-image-gallery';

class ClassTypeImgSlider extends React.Component {
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

ClassTypeImgSlider.propTypes = {
  images: PropTypes.arrayOf(PropTypes.Object),
}

export default ClassTypeImgSlider;
