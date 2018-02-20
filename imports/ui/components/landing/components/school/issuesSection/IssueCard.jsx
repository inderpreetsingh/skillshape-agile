import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import * as helpers from '../../jss/helpers.js';

const Wrapper = styled.div`
  background-color: ${helpers.schoolPageColor};
  border-radius: ${helpers.rhythmDiv * 2}px;
  width: 300px;
  min-height: 100px;
  padding: ${helpers.rhythmDiv * 2}px ${helpers.rhythmDiv}px;
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
`;

const ContentSection = styled.div`
  ${helpers.flexCenter}
  width: 150px;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  line-height: 1;
  font-weight: 400;
`;

const IssueCard = (props) => (
  <Wrapper onClick={props.onClick} active={props.active}>
    <ContentSection>
      {props.content}
    </ContentSection>
  </Wrapper>
);

IssueCard.propTypes = {
  content: PropTypes.string,
  onClick: PropTypes.func
}

export default IssueCard;
