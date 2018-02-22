import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import * as helpers from '../../jss/helpers.js';

const Wrapper = styled.div`
  background-color: ${helpers.schoolPageColor};
  border-radius: ${helpers.rhythmDiv * 2}px;
  max-width: 300px;
  width: 100%;
  min-height: 100px;
  padding: ${helpers.rhythmDiv * 2}px ${helpers.rhythmDiv}px;
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
  margin: 0 ${helpers.rhythmDiv * 2}px;
  transition: max-width .15s ease-in;

  @media screen and (max-width: ${helpers.mobile}px) {
    max-width: ${props => props.active ? 250 : 100}px;
    margin: 0 ${helpers.rhythmDiv}px;
  }
`;

const ContentSection = styled.div`
  ${helpers.flexCenter}
  max-width: 150px;
  width: 100%;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  line-height: 1;
  font-weight: 400;
  opacity: 1;

  @media screen and (max-width: ${helpers.mobile}px) {
    opacity: ${props => props.active ? 1 : 0};
  }
`;

const IssueCard = (props) => (
  <Wrapper onClick={props.onClick} active={props.active}>
    <ContentSection active={props.active}>
      {props.content}
    </ContentSection>
  </Wrapper>
);

IssueCard.propTypes = {
  content: PropTypes.string,
  onClick: PropTypes.func
}

export default IssueCard;
