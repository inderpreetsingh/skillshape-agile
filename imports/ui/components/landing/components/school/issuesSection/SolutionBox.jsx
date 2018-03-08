import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import SchoolSolutionCard from '../../cards/SchoolSolutionCard.jsx';
import SchoolSolutionSlider from './SchoolCardsSlider.jsx';

import * as helpers from '../../jss/helpers.js';

const BoxWrapper = styled.div`
  ${helpers.flexCenter}
  flex-direction: column;
  flex-grow: 1;
  max-width: ${helpers.schoolPageContainer}px;
  margin: 0 auto;
  height: 100%;
  padding: ${helpers.rhythmDiv * 2}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    padding-top: ${helpers.rhythmDiv * 2}px;
    max-width: 500px;
    width: 100%;
  }
`;

const Content = styled.h2`
  color: ${helpers.black};
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize * 2}px;
  font-weight: 500;
  text-align: center;
  line-height: 1;
  text-align: center;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  @media screen and (max-width: ${helpers.tablet}px) {
    font-size: ${helpers.baseFontSize * 1.5}px;
  }
`;

SchoolSolutionCardsWrapper = styled.div`
  width: 100%;
  ${helpers.flexCenter}
  justify-content: space-around;
  max-width: ${helpers.schoolPageContainer}px;
  padding: ${helpers.rhythmDiv * 2};

  @media screen and (max-width: ${helpers.tablet}px) {
    max-width: 464px;
    flex-wrap: wrap;
    margin: 0 auto;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    display: none;
  }
`;

SchoolSolutionSliderWrapper = styled.div`
  display: none;

  @media screen and (max-width: ${helpers.mobile}px) {
    display: block;
    width: 100%;
    overflow: hidden;
    padding-bottom: ${helpers.rhythmDiv * 4}px
  }
`;

const SolutionBox = (props) => (
  <BoxWrapper firstBox={props.firstBox}>
    <Content firstBox={props.firstBox}>
      {props.title}
    </Content>

    <SchoolSolutionCardsWrapper>
      {props.cardsData && props.cardsData.map((card,i) => (
        <SchoolSolutionCard key={i} {...card}/>
      ))}
    </SchoolSolutionCardsWrapper>

    <SchoolSolutionSliderWrapper>
      <SchoolSolutionSlider data={props.cardsData} />
    </SchoolSolutionSliderWrapper>
  </BoxWrapper>
);

SolutionBox.propTypes = {
  content: PropTypes.string,
  active: PropTypes.bool
}

export default SolutionBox;
