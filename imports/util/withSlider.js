import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const OuterWrapper = styled.div`
  padding-right: ${props => props.padding}px;
  padding-left: ${props => props.paddingLeft}px;
`;

const Container = styled.div``;
const Wrapper = styled.div``;

const Arrow = styled.button`
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  align-items: center;
  font-size: ${helpers.rhythmDiv * 6}px;
  font-family: ${helpers.specialFont};
  font-weight: 300;
  z-index: 1;
  width: auto;
  height: auto;
  color: ${helpers.primaryColor};
  padding: 0 ${helpers.rhythmDiv}px;

  &:hover {
    color: ${helpers.primaryColor};
  }

  &:before {
    position: absolute;
    color: transparent;
  }
`;

const SliderLeftArrow = Arrow.extend`
  left: 0px;
`;

const SliderRightArrow = Arrow.extend`
  right: 0px;
`;


const SliderNextArrow = (props) => <SliderRightArrow {...props} onClick={props.onClick} className={props.className} > {">"} </SliderRightArrow>
const SliderPreviousArrow = (props) => (<SliderLeftArrow {...props} onClick={props.onClick} className={props.className}>{"<"}</SliderLeftArrow>)

const defaultPaging = (i) => <button>{i + 1}</button>

const withSlider = (WrappedComponent,sliderConfig,sliderBreakPoints) => (props) => {
  // debugger;
  console.log(sliderBreakPoints,"slider breakPoints");
  console.log(sliderConfig,props,"slider config");
  const breakPoints = {
    mobile: (sliderBreakPoints && sliderBreakPoints.mobile) || helpers.mobile,
    tablet: (sliderBreakPoints && sliderBreakPoints.tablet) || helpers.tablet
  }
  let autoplay = true;

  if(sliderConfig.autoplay !== 'undefined') {
    autoplay = sliderConfig.autoplay;
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
    arrows: sliderConfig.arrows || false,
    autoplay: autoplay,
    infinite: true,
    nextArrow: <SliderNextArrow />,
    prevArrow: <SliderPreviousArrow />,
    beforeChange: (current, next) => {
      const {sliderProps} = props;
      if(sliderProps&& sliderProps.onBeforeSlideChange)
        sliderProps.onBeforeSlideChange(next);
    },
    afterChange: (index) => {
      // console.log(index);
      const {sliderProps} = props;
      if(sliderProps && sliderProps.onAfterSlideChange)
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
