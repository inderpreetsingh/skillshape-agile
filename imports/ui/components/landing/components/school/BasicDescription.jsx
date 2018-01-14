import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Typography from 'material-ui/Typography';

//TODO: Automatic imports depending upon variables used - intellij
import * as helpers from '../jss/helpers.js';

const Wrapper = styled.div`
  ${helpers.flexDirectionColumn}
  padding: ${helpers.rhythmDiv}px;
`;

const Title = styled.h3`
  font-family: ${helpers.specialFont};
  font-weight: 400;
  color: ${helpers.headingColor};
`;

const Description = styled.div`
  font-family: ${helpers.commonFont};
`;

const BasicDescription = (props) => (
  <Wrapper>
    <Title>{props.title}</Title>
    <Description>{props.children}</Description>
  </Wrapper>
);

BasicDescription.propTypes = {
  title: PropTypes.string.isRequired,
  button: PropTypes.bool,
}

export default BasicDescription;
