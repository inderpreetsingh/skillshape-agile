import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import Star from './icons/Star';
import * as helpers from './jss/helpers';

const StarsWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StarWrapper = styled.div`
  height: ${helpers.baseFontSize}px;
  margin-right: ${helpers.rhythmDiv / 2}px;
`;

const createStars = (noOfStars) => {
  const stars = [];
  const totalStars = Math.floor(noOfStars);
  for (let i = 0; i < totalStars; ++i) {
    stars.push(
      <StarWrapper key={i}>
        <Star />
      </StarWrapper>,
    );
  }
  return stars;
};

const StarsBar = props => <StarsWrapper>{createStars(props.noOfStars)}</StarsWrapper>;

StarsBar.propTypes = {
  noOfStars: PropTypes.number,
};

StarsBar.defaultProps = {};

export default StarsBar;
