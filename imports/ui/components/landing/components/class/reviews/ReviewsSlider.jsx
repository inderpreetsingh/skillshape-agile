import React from 'react';
import Slider from 'react-slick';

import Review from './Review';
import withSlider from '/imports/util/withSlider.js';
import {mobile} from '/imports/ui/components/landing/components/jss/helpers.js';

const config = {
  desktop: 3,
  tablet: 2,
  mobile: 1
}

const breakPoints = {
  mobile: mobile + 121
}

export default withSlider(Review,config,breakPoints);
