import PropTypes from 'prop-types';
import React from 'react';
import ImageGallery from 'react-image-gallery';

const ClassTypeImgSlider = (props) => {
  const { images } = props;
  return (
    <ImageGallery
      showPlayButton={false}
      showBullets
      items={images}
      showThumbnails={false}
      showFullscreenButton={false}
    />
  );
};

ClassTypeImgSlider.propTypes = {
  images: PropTypes.arrayOf(PropTypes.Object),
};

export default ClassTypeImgSlider;
