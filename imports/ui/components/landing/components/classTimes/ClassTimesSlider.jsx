import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import ClassTime from './ClassTime';
import withSlider from '../../../../../util/withSlider.js';

const config = {
  desktop: 4,
  tablet: 2,
  mobile: 1
}

const breakPoints = {
  mobile: 600,
}

export default withSlider(ClassTime,config,breakPoints);
