import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import * as helpers from '../ui/components/landing/components/jss/helpers.js';

const OuterWrapper = styled.div`
  padding-right: ${props => props.padding}px;
`;

const Wrapper = styled.div`

`;

const Container = styled.div`

`;


const withSlider = (WrappedComponent,sliderConfig,sliderBreakPoints) => (props) => {
  console.log(sliderBreakPoints,"slider breakPoints");
  console.log(sliderConfig,"slider config");
  const breakPoints = {
    mobile: (sliderBreakPoints && sliderBreakPoints.mobile) || helpers.mobile,
    tablet: (sliderBreakPoints && sliderBreakPoints.tablet) || helpers.tablet
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    infinite: true,
    slidesToShow: sliderConfig.desktop,
    responsive: [{ breakpoint: breakPoints.mobile, settings: { slidesToShow: sliderConfig.mobile } }, { breakpoint: breakPoints.tablet, settings: { slidesToShow: sliderConfig.tablet }}]
  };

  // console.log('Props...',props,WrappedComponent);
  return (
    <Container>
      <Slider {...settings}>
      {props.data && props.data.map(obj => {
        return (
          <OuterWrapper padding={props.padding} key={obj._id}>
            <Wrapper >
              <WrappedComponent {...obj} />
            </Wrapper>
          </OuterWrapper>
        );
      })}
      </Slider>
    </Container>
  )
}

export default withSlider;
