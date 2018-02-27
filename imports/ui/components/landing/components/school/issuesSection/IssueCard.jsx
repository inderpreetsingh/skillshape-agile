import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import * as helpers from '../../jss/helpers.js';

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  filter: ${props => props.active ?  'none' : 'grayscale(90%)'};
  border-radius: ${helpers.rhythmDiv * 2}px;
  width: 100%;
  height: 100px;
  max-width: 300px;
  padding: ${helpers.rhythmDiv * 2}px ${helpers.rhythmDiv}px;
  cursor: pointer;
  background-image: url('${props => props.bgImage}');
  background-size: cover;
  background-repeat: no-repeat;
  transition: flex-shrink .2s linear;
  min-width: 0;
  margin: 0 ${helpers.rhythmDiv * 2}px;

  @media screen and (max-width: ${helpers.tablet}px) {
    max-width: 250px;
    width: 100%;
    flex-shrink: ${props => props.active ?  '0' : '1'};
    margin: 0 ${helpers.rhythmDiv}px;
    min-width: 100px;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    width: 200px;
    margin: 0 ${helpers.rhythmDiv}px;
  }
`;

const Content = styled.p`
  ${helpers.flexCenter}
  max-width: 150px;
  font-family: ${helpers.specialFont};
  font-style: italic;
  font-size: ${helpers.baseFontSize}px;
  line-height: 1;
  font-weight: 400;
  opacity: 1;
  margin: 0;
  transition: opacity .2s linear, transform .2s linear;

  @media screen and (max-width: ${helpers.tablet}px) {
    opacity: ${props => props.active ? '1' : '0'};
    transform: ${props => props.active ? 'scale(1)' : 'scale(0)'};
  }
`;

const IssueCard = (props) => (
  <Wrapper onClick={props.onClick} active={props.active} bgImage={props.cardBgImage}>
    <Content active={props.active}>
      {props.title}
    </Content>
  </Wrapper>
);

IssueCard.propTypes = {
  content: PropTypes.string,
  onClick: PropTypes.func
}

export default IssueCard;
