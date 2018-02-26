import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import * as helpers from '../../jss/helpers.js';

const BoxWrapper = styled.div`
  top: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${props => props.bgColor};
  background-image: url('${props => props.bgImage}');
  background-size: contain;
  background-position: bottom left;
  background-repeat: no-repeat;
  padding: ${helpers.rhythmDiv * 2}px;
  transition: .2s opacity ease-in;
  opacity: ${props => props.active ? 1 : 0};
`;

const Content = styled.p`
  color: ${helpers.black};
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize * 2}px;
  font-weight: 300;
  text-align: center;
  margin: 0;
`;

const SolutionBox = (props) => (
  <Fragment>
  {props.issues && props.issues.map((issue,i) => (
    <BoxWrapper bgColor={issue.bgColor} bgImage={issue.background} active={props.activeIssue === i}>
      <Content>
        {issue.title}
      </Content>
    </BoxWrapper>
  ))}
  </Fragment>
);

SolutionBox.propTypes = {
  content: PropTypes.string,
  active: PropTypes.bool
}

export default SolutionBox;
