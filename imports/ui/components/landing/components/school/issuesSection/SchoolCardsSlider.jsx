import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import SchoolSolutionCard from '../../cards/SchoolSolutionCard.jsx';
import withSlider from '/imports/util/withSlider.js';

const config = {
  desktop: 4,
  tablet: 1,
  mobile: 1,
  speed: 1000
}

const breakPoints = {
  mobile: 501,
}

export default withSlider(SchoolSolutionCard,config,breakPoints);
