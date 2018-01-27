import React, {Fragment} from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Star from './Star.jsx';
import * as helpers from './jss/helpers.js';

const StarsWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StarWrapper = styled.div`
  margin-right: ${helpers.rhythmDiv/2}px;
`;

const createStars = (noOfStars) => {
  const stars = [];
  const totalStars = Math.ceil(noOfStars);
  for(i = 0; i < totalStars; ++i) {
    stars.push(
      <StarWrapper>
        <Star />
      </StarWrapper>
    )
  }
  return stars;
}

const StarsBar = (props) => {
  return (
    <StarsWrapper>
      {createStars(props.noOfStars)}
    </StarsWrapper>
  )
}

StarsBar.propTypes = {
  noOfStars: PropTypes.number
}

StarsBar.defaultProps = {

}

export default StarsBar;
