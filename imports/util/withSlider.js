import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import * as helpers from '../ui/components/landing/components/jss/helpers.js';

const OuterWrapper = styled.div`
  padding-right: ${props => props.padding}px;
  padding-left: ${props => props.paddingLeft}px;
`;

const Wrapper = styled.div`

`;

const Container = styled.div`

`;

const defaultPaging = (i) => <button>{i + 1}</button>

const withSlider = (WrappedComponent,sliderConfig,sliderBreakPoints) => (props) => {
  console.log(sliderBreakPoints,"slider breakPoints");
  console.log(sliderConfig,props,"slider config");
  const breakPoints = {
    mobile: (sliderBreakPoints && sliderBreakPoints.mobile) || helpers.mobile,
    tablet: (sliderBreakPoints && sliderBreakPoints.tablet) || helpers.tablet
  }

  const settings = {
    dots: sliderConfig.dots || true,
    dotsClass: sliderConfig.dotsClass || 'slick-dots',
    customPaging: sliderConfig.customPaging ?  sliderConfig.customPaging : defaultPaging,
    variableWidth: sliderConfig.variableWidth || false,
    infinite: true,
    speed: sliderConfig.speed || 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    infinite: true,
    beforeChange: (current, next) => {
      const {sliderProps} = props;
      if(sliderProps.onBeforeSlideChange)
        sliderProps.onBeforeSlideChange(next);
    },
    afterChange: (index) => {
      console.log(index);
      const {sliderProps} = props;
      if(sliderProps.onAfterSlideChange)
        sliderProps.onAfterSlideChange(index);
    },
    slidesToShow: sliderConfig.desktop,
    responsive: [{ breakpoint: breakPoints.mobile, settings: { slidesToShow: sliderConfig.mobile } }, { breakpoint: breakPoints.tablet, settings: { slidesToShow: sliderConfig.tablet }}]
  };

  // console.log('Props...',props,WrappedComponent);
  const { componentProps } = props;
  return (
    <Container>
      <Slider {...settings}>
      {props.data && props.data.map((obj,i) => {
        return (
          <OuterWrapper padding={props.padding} paddingLeft={props.paddingLeft} key={obj._id || i}>
            <Wrapper >
              <WrappedComponent {...obj} {...componentProps}/>
            </Wrapper>
          </OuterWrapper>
        );
      })}
      </Slider>
    </Container>
  )
}

export default withSlider;
