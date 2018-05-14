import React, {Component,Fragment} from 'react';
import PropTypes from 'prop-types';
import ImageGallery from 'react-image-gallery';

const ClassTypeImgSlider = (props) => {
  const {images, sliderClass} = props;
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

ClassTypeImgSlider.propTypes = {
  images: PropTypes.arrayOf(PropTypes.Object),
}

export default ClassTypeImgSlider;
