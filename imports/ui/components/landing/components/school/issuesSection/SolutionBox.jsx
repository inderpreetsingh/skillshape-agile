import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import * as helpers from '../../jss/helpers.js';

const Wrapper = styled.div`
  max-width: 1000px;
  min-height: 500px;
  background-color: ${helpers.schoolPageColor};
  padding: ${helpers.rhythmDiv * 2}px;
  display: flex;
  justify-content: flex-end;
  position: relative;
`;

const ContentSectionWrapper = styled.div`
  padding: ${helpers.rhythmDiv * 2}px;
  transition: opacity .5s ease-in-out;
  opacity: ${props => props.active ? 1 : 0};
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
`;

const ContentSection = styled.div`
  width: 500px;
  color: ${helpers.primaryColor};
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize * 2}px;
  font-weight: 300;
  text-align: center;
`;

const SolutionBox = (props) => (
  <Wrapper>
    {props.issues && props.issues.map((content,i) => (
      <ContentSectionWrapper key={i} active={props.activeIssue === i}>
        <ContentSection >
          {content}
        </ContentSection>
      </ContentSectionWrapper>
    ))}
  </Wrapper>
);

SolutionBox.propTypes = {
  content: PropTypes.string,
  active: PropTypes.bool
}

export default SolutionBox;
