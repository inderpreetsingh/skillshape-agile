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
  margin: 0 auto;
  height: 100%;
  padding: ${helpers.rhythmDiv * 2}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    padding-top: ${helpers.rhythmDiv * 2}px;
    max-width: 500px;
    width: 100%;
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
`;


SchoolSolutionCardsWrapper = styled.div`
  width: 100%;
  ${helpers.flexCenter}
  justify-content: space-around;
  max-width: ${helpers.schoolPageContainer}px;
  padding: ${helpers.rhythmDiv * 2}px;

  @media screen and (max-width: ${helpers.tablet}px) {
    max-width: 464px;
    flex-wrap: wrap;
    margin: 0 auto;
    padding-bottom: 0;
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

const ActionArea = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
`;

const TitleArea = styled.div`
  width: 100%;
  text-align: center;
`;

const SolutionBox = (props) => (
  <BoxWrapper firstBox={props.firstBox}>
    <TitleArea>
      <Title firstBox={props.firstBox}> {props.title} </Title>
      <Tagline>SkillShape has following functions that will help you {props.helpsUsIn}</Tagline>
    </TitleArea>

    <SchoolSolutionCardsWrapper>
      {props.cardsData && props.cardsData.map((card,i) => (
        <SchoolSolutionCard key={i} {...card} cardBgColor={props.cardBgColor}/>
      ))}
    </SchoolSolutionCardsWrapper>

    <SchoolSolutionSliderWrapper>
      <SchoolSolutionSlider data={props.cardsData} />
    </SchoolSolutionSliderWrapper>

    <ActionArea>
      <ButtonWrapper>
        <PrimaryButton onClick={props.onActionButtonClick}/>
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
