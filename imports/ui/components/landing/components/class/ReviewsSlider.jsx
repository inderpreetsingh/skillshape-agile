import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Review from './Review';
import withSlider from '../../../../../util/withSlider.js';

const config = {
  desktop: 3,
  tablet: 2,
  mobile: 1
}

export default withSlider(Review,config);
