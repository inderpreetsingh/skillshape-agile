import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Review from './Review';

import ReviewStructure from '../../constants/structure/review.js';
import * as helpers from '../jss/helpers.js';

const ReviewOuterWrapper = styled.div`
  padding-right: ${helpers.rhythmDiv * 2}px;
`;

const ReviewWrapper = styled.div`

`;

const Container = styled.div`

`;

const ReviewsSlider = (props) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    infinite: true,
    slidesToShow: 3,
    responsive: [{ breakpoint: helpers.tablet, settings: { slidesToShow: 2 } }, { breakpoint: helpers.mobile, settings: { slidesToShow: 1 }}]
  };
  return (
    <Container>
      <Slider {...settings}>
      {props.reviewsData && props.reviewsData.map(review => {
        return (
          <ReviewOuterWrapper>
            <ReviewWrapper key={review._id} >
              <Review {...review} />
            </ReviewWrapper>
          </ReviewOuterWrapper>
        );
      })}
      </Slider>
    </Container>
  )
}

ReviewsSlider.propTypes = {
  reviewsData: PropTypes.arrayOf(ReviewStructure)
}


export default ReviewsSlider;
