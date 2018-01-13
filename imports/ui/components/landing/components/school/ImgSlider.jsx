import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ImageGallery from 'react-image-gallery';

const images = [
  {
    original: '/images/classtype/slider1.jpeg',
    thumbnail: '/images/classtype/slider1.jpeg',
    thumbnailClass: 'image-slider-thumbnail-img'
  },
  {
    original: '/images/classtype/slider2.jpeg',
    thumbnail: '/images/classtype/slider2.jpeg',
    thumbnailClass: 'image-slider-thumbnail-img'
  },
  {
    original: '/images/classtype/slider3.jpeg',
    thumbnail: '/images/classtype/slider3.jpeg',
    thumbnailClass: 'image-slider-thumbnail-img'
  },
  {
    original: '/images/classtype/slider4.jpeg',
    thumbnail: '/images/classtype/slider4.jpeg',
    thumbnailClass: 'image-slider-thumbnail-img'
  }
]


class ImgSlider extends React.Component {
  render() {
    const {images, sliderClass} = this.props;
    return (
      <ImageGallery
        showPlayButton={false}
        showBullets={true}
        items={images}
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

ImgSlider.defaultProps = {
  images: images
}

export default ImgSlider;
