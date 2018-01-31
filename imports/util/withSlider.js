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

const withSlider = (WrappedComponent,sliderConfig) => (props) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    infinite: true,
    slidesToShow: sliderConfig.desktop,
    responsive: [{ breakpoint: helpers.tablet, settings: { slidesToShow: sliderConfig.tablet } }, { breakpoint: helpers.mobile, settings: { slidesToShow: sliderConfig.mobile }}]
  };

  // console.log('Props...',props,WrappedComponent);
  return (
    <Container>
      <Slider {...settings}>
      {props.data && props.data.map(obj => {
        return (
          <OuterWrapper padding={props.padding}>
            <Wrapper key={obj._id} >
              <WrappedComponent {...obj} />
            </Wrapper>
          </OuterWrapper>
        );
      })}
      </Slider>
    </Container>
  )
}

withSlider.defaultProps = {
  padding: helpers.rhythmDiv * 2
}

export default withSlider;
