import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import * as helpers from '../../jss/helpers.js';

const BoxWrapper = styled.div`
  max-width: ${helpers.schoolPageContainer}px;
  margin: 0 auto;
  padding: ${helpers.rhythmDiv * 2}px;
  padding-top: ${helpers.rhythmDiv * 4}px;
`;

const Content = styled.h2`
  color: ${helpers.black};
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize * 2}px;
  font-weight: 500;
  text-align: center;
  line-height: 1;
  margin: 0;
  @media screen and (max-width: ${helpers.tablet}px) {
    font-size: ${helpers.baseFontSize * 1.5}px;
  }
`;

const SolutionBox = (props) => (
  <BoxWrapper firstBox={props.firstBox}>
    <Content>
      {props.title}
    </Content>
  </BoxWrapper>
);

SolutionBox.propTypes = {
  content: PropTypes.string,
  active: PropTypes.bool
}

export default SolutionBox;
