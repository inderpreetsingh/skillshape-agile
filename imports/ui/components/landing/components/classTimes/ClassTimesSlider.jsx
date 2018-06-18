import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import ClassTime from '/imports/ui/components/landing/components/classTimes/ClassTime';
import withSlider from '/imports/util/withSlider.js';

const config = {
  desktop: 4,
  tablet: 2,
  mobile: 1,
  autoplay: false,
  arrows: true
}

const breakPoints = {
  mobile: 601,
}

export default withSlider(ClassTime,config,breakPoints);
