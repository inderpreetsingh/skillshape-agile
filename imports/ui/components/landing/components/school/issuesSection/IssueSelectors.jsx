import React, {Fragment} from 'react';
import {findDOMNode} from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Sticky from 'react-stickynode';

import * as helpers from '../../jss/helpers.js';
import IssueCard from './IssueCard.jsx';
import IssueNumber from './IssueNumber.jsx';

const Wrapper= styled.div`
  ${helpers.flexCenter}
  flex-direction: column;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
  margin-top: ${helpers.rhythmDiv * 8}px;

  @media screen and (max-width: ${helpers.tablet}px) {
    max-width: initial;
    margin-right: 0;
    margin-bottom: ${helpers.rhythmDiv * 4}px;
  }

  @media screen and (max-width: ${helpers.tablet}px) {
    margin-bottom: 0;
  }
`;

const IssuesTitle = styled.h2`
  font-family: ${helpers.specialFont};
  font-style: italic;
  font-size: ${helpers.baseFontSize * 2}px;
  color: ${helpers.black};
  font-weight: 400;
  text-align: center;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const IssuesWrapper = styled.div`
  ${helpers.flexCenter}
  width: 100%;
`;

const IssuesNumberWrapper = styled.div`
  display: none;

  @media screen and (max-width: ${helpers.mobile}px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 100px;
    left: ${helpers.rhythmDiv}px;
    z-index: 15;

    display: ${props => props.displayIssueNumbers ? 'flex' : 'none'};
  }
`;

const IssueSelectors = (props) => {
  console.log('re rendering...')
  return(<Wrapper>
    <IssuesTitle>{props.headerContent}</IssuesTitle>
    <Sticky className='issue-cards' top={helpers.rhythmDiv}>
      <IssuesWrapper>
      {props.issues &&
        props.issues.map((issue,i) => (
          <IssueCard
            key={i}
            active={props.activeIssue === i}
            onClick={() => props.handleCardClick(i)}
            {...issue}
            />
        ))}
      </IssuesWrapper>
    </Sticky>

    <IssuesNumberWrapper displayIssueNumbers={props.displayIssueNumbers}>
    {props.issues &&
      props.issues.map((issue,i) => (
        <IssueNumber
          key={i}
          active={props.activeIssue === i}
          issueIndex={i + 1}
          onClick={() => props.handleCardClick(i)}
          />
      ))}
    </IssuesNumberWrapper>

  </Wrapper>)
}

IssueSelectors.defaultProps = {
  headerContent: 'At school you face three main problems'
}

export default IssueSelectors;
