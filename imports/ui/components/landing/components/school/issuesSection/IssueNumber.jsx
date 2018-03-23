import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import * as helpers from '../../jss/helpers.js';

const Wrapper = styled.div`
  ${helpers.flexCenter}
  width: ${helpers.rhythmDiv * 4}px;
  height: ${helpers.rhythmDiv * 4}px;
  border: 2px solid ${props => props.active ? helpers.primaryColor : helpers.cancel};
  border-radius: 50%;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  padding: ${helpers.rhythmDiv}px;
  cursor: pointer;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const Content = styled.p`
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.commonFont};
  font-weight: 300;
  margin: 0;
  color: ${props => props.active ? helpers.primaryColor : helpers.cancel};
`;

const IssueCard = (props) => (
  <Wrapper onClick={props.onClick} active={props.active}>
    <Content active={props.active}>
      {props.issueIndex}
    </Content>
  </Wrapper>
);

IssueCard.propTypes = {
  issueNumber: PropTypes.string,
  onClick: PropTypes.func
}

export default IssueCard;
