import React from 'react';
import styled from 'styled-components';
import ReactStars from 'react-stars';
import PropTypes from 'prop-types';

import * as helpers from '../../jss/helpers.js';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const Title = styled.h2`
  font-size: ${helpers.baseFontSize * 2}px;
  font-family: ${helpers.specialFont};
  color: ${helpers.primaryColor};
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv}px;
  font-weight: 300;
  line-height: 1;
`;

const Description = styled.p`
  margin: 0;
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.specialFont};
  line-height: 1;
`;

const AboutSchool = (props) => (
  <Wrapper>
    <Title>About {props.title}</Title>
    <Description>{props.description}</Description>
  </Wrapper>
);

AboutSchool.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
}

export default AboutSchool;
