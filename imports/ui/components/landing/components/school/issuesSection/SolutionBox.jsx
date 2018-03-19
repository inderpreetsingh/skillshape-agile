import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import PrimaryButton from '../../buttons/PrimaryButton.jsx';

import SchoolSolutionCard from '../../cards/SchoolSolutionCard.jsx';
import SchoolSolutionSlider from './SchoolCardsSlider.jsx';

import * as helpers from '../../jss/helpers.js';

const BoxWrapper = styled.div`
  ${helpers.flexCenter}
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-evenly;
  max-width: ${helpers.schoolPageContainer}px;
  width: 100%;
  margin: 0 auto;
  height: 100%;
  padding: 0 ${helpers.rhythmDiv * 2}px;
  position: relative;

  @media screen and (max-width: ${helpers.mobile}px) {
    max-width: 500px;
    justify-content: center;
  }
`;

const TitleArea = styled.div`
  width: 100%;
  text-align: center;
  padding: 0 ${helpers.rhythmDiv * 2}px;
  margin-top: ${helpers.rhythmDiv * 2}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    ${helpers.flexCenter}
    flex-grow: 1;
  }
`;

const Title = styled.h2`
  color: ${helpers.black};
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize * 2}px;
  font-weight: 500;
  text-align: center;
  line-height: 1;
  text-align: center;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv}px;


  @media screen and (max-width: ${helpers.tablet}px) {
    font-size: ${helpers.baseFontSize * 1.5}px;
  }
`;

const Tagline = styled.h3`
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  line-height: 1;
  font-style: italic;
  font-weight: 300;
  margin: 0;

  @media screen and (max-width: ${helpers.mobile}px) {
    display: none;
  }
`;


SchoolSolutionCardsWrapper = styled.div`
  width: 100%;
  ${helpers.flexCenter}
  justify-content: space-around;
  max-width: ${helpers.schoolPageContainer}px;
  padding: 0 ${helpers.rhythmDiv * 2}px;
  margin-top: ${helpers.rhythmDiv * 2}px;

  @media screen and (max-width: ${helpers.tablet}px) {
    max-width: 464px;
    flex-wrap: wrap;
    margin: ${helpers.rhythmDiv * 2}px auto;
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
    margin-top: ${helpers.rhythmDiv * 2}px;
    padding-bottom: ${helpers.rhythmDiv * 2}px;
    flex-grow: 2;
  }
`;

const ActionArea = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 0 ${helpers.rhythmDiv * 2}px;
  margin-top: ${helpers.rhythmDiv * 2}px;

  @media screen and (max-width: ${helpers.tablet}px) {
    margin-bottom: ${helpers.rhythmDiv * 2}px;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    display: none;
    margin: 0;
  }

`;

const ButtonWrapper = styled.div`
  display: flex;
`;

const SolutionBox = (props) => (
  <BoxWrapper firstBox={props.firstBox}>

    <TitleArea>
      <Title firstBox={props.firstBox}> {props.title} </Title>
      <Tagline>SkillShape has following functions that will help you {props.helpsUsIn}</Tagline>
    </TitleArea>

    <SchoolSolutionCardsWrapper>
      {props.cardsData && props.cardsData.map((card,i) => (
        <SchoolSolutionCard key={i} noMarginBotton={i === 2 || i === 3} {...card} cardBgColor={props.cardBgColor}/>
      ))}
    </SchoolSolutionCardsWrapper>

    <SchoolSolutionSliderWrapper>
      <SchoolSolutionSlider data={props.cardsData} componentProps={{cardBgColor: props.cardBgColor}}/>
    </SchoolSolutionSliderWrapper>

    <ActionArea>
      <ButtonWrapper>
        <PrimaryButton noMarginBottom onClick={props.onActionButtonClick} label="Get started"/>
      </ButtonWrapper>
    </ActionArea>
  </BoxWrapper>
);

SolutionBox.propTypes = {
  content: PropTypes.string,
  active: PropTypes.bool,
  onActionButtonClick: PropTypes.func
}

export default SolutionBox;
