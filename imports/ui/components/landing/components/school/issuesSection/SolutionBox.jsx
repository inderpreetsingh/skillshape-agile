import React, {Fragment,Component} from 'react';
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
  }
`;

const BoxInnerWrapper = styled.div`
  ${helpers.flexCenter}

  @media screen and (max-width: ${helpers.tablet}px) {
    flex-direction: column-reverse;
    width: 100%;
  }

`;

const TitleArea = styled.div`
  width: 100%;
  margin-top: ${helpers.rhythmDiv * 2}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    ${helpers.flexCenter}
  }
`;

const Title = styled.h2`
  color: ${helpers.black};
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize * 2}px;
  font-weight: 500;
  line-height: 1;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  @media screen and (max-width: ${helpers.tablet}px) {
    font-size: ${helpers.baseFontSize * 1.5}px;
  }
`;

const Heading = styled.h3`
  color: ${helpers.black};
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  line-height: 1;
  font-weight: 500;
`;

const Description = styled.p`
  margin: 0;
  font-weight: 300;
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.specialFont};
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

SchoolSolutionCardsWrapper = styled.div`
  ${helpers.flexCenter}
  width: 100%;
  max-width: ${464 + 2 * helpers.rhythmDiv * 2}px;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 0 ${helpers.rhythmDiv * 2}px;
  margin-top: ${helpers.rhythmDiv * 2}px;

  @media screen and (max-width: ${helpers.tablet}px) {
    // margin: ${helpers.rhythmDiv * 2}px auto;
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
    padding-bottom: ${helpers.rhythmDiv * 3}px;
  }
`;

const ActionArea = styled.div`
  display: flex;
  justify-content: center;
  // justify-content: flex-end;
  width: 100%;
  padding: 0 ${helpers.rhythmDiv * 2}px;
  // margin-top: ${helpers.rhythmDiv * 2}px;

  @media screen and (max-width: ${helpers.tablet}px) {
    margin-bottom: ${helpers.rhythmDiv * 2}px;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    margin-bottom: 0;
  }

`;

const ButtonWrapper = styled.div`
  display: flex;
  margin-right: ${props => props.marginRight}px;
`;

const SolutionContent = styled.div`
  ${helpers.flexCenter};
  max-width: 400px;
  flex-direction: column;

  @media screen and (max-width: ${helpers.tablet}px) {
    margin-bottom: ${helpers.rhythmDiv * 2}px;
  }
`;

const SolutionWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 150px;
`;

const Solution = styled.div`
  // position: ${props => props.showContent ? 'static' : 'absolute'};
  position: absolute;
  transition: .2s opacity ease-in-out;
  opacity: ${props => props.showContent ? 1 : 0};
`;

class SolutionBox extends Component {

  state = {
    currentSolution: 0,
    showSlider: false,
  }

  handleSolutionChange = (currentSolution) => {
    this.setState({currentSolution});
  }

  handleScreenResize = () => {
    if(window.innerWidth <= 500) {
      // console.log(window.innerWidth,"------");
      if(!this.state.showSlider)
        this.setState({showSlider: true});
    }else {
      if(this.state.showSlider)
        this.setState({showSlider: false});
    }
  }

  componentWillMount = () => {
    window.addEventListener('resize',this.handleScreenResize);
  }

  componentWillUnMount = () => {
    window.removeEventListener('resize',this.handleScreenResize);
  }

  render() {
    const {props} = this;
    return(<BoxWrapper firstBox={props.firstBox}>
        <BoxInnerWrapper>
          <SchoolSolutionCardsWrapper>
            {props.cardsData && props.cardsData.map((card,i) => (
              <SchoolSolutionCard
                key={i}
                {...card}
                marginTop={(i == 1 && helpers.rhythmDiv * 4) || (i == 2 && -1 * helpers.rhythmDiv * 4)}
                marginLeft={i === 2 && helpers.rhythmDiv * 2}
                noMarginBotton={i === 2 || i === 3}
                onCardClick={() => this.handleSolutionChange(i)}
                cardBgColor={props.cardBgColor}/>
            ))}
          </SchoolSolutionCardsWrapper>

          {this.state.showSlider && <SchoolSolutionSliderWrapper>
            <SchoolSolutionSlider
              data={props.cardsData}
              sliderProps={{onBeforeSlideChange: this.handleSolutionChange}}
              componentProps={{cardBgColor: props.cardBgColor}} />
          </SchoolSolutionSliderWrapper>}

          <SolutionContent>
            <TitleArea>
              <Title firstBox={props.firstBox}> {props.title} </Title>
            </TitleArea>

            <SolutionWrapper>
            {props.cardsData && props.cardsData.map((card,i) => {
              return(<Fragment><Solution key={i} showContent={this.state.currentSolution === i}>
                <Heading>
                  {card.tagline}
                </Heading>

                <Description>
                  {card.content}
                </Description>

                <ActionArea>
                  <ButtonWrapper marginRight={helpers.rhythmDiv * 2}>
                    <PrimaryButton noMarginBottom onClick={props.onKnowMoreButtonClick} label="Know more" />
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <PrimaryButton noMarginBottom onClick={props.onActionButtonClick} label="Get started"/>
                  </ButtonWrapper>
                </ActionArea>
              </Solution>

              </Fragment>)
            })}
            </SolutionWrapper>

            {/*
            <SolutionWrapper>
              <Solution showContent={true}>
                <Heading>
                  {props.cardsData && props.cardsData[this.state.currentSolution].tagline}
                </Heading>

                <Description>
                  {props.cardsData && props.cardsData[this.state.currentSolution].content}
                </Description>
              </Solution>
            </SolutionWrapper>
            */}
          </SolutionContent>
        </BoxInnerWrapper>
      </BoxWrapper>);
  }
}

{/*
const SolutionBox = (props) => (
  <BoxWrapper firstBox={props.firstBox}>

    {/*<TitleArea>
      <Title firstBox={props.firstBox}> {props.title} </Title>
      <Tagline>SkillShape has following functions that will help you {props.helpsUsIn}</Tagline>
    </TitleArea>

    <SchoolSolutionCardsWrapper>
      {props.cardsData && props.cardsData.map((card,i) => (
        <SchoolSolutionCard key={i} marginTop={(i == 1 && helpers.rhythmDiv * 4) || (i == 2 && -1 * helpers.rhythmDiv * 4)} marginLeft={i === 2 && helpers.rhythmDiv * 2} noMarginBotton={i === 2 || i === 3} {...card} cardBgColor={props.cardBgColor}/>
      ))}
    </SchoolSolutionCardsWrapper>

    <SchoolSolutionSliderWrapper>
      <SchoolSolutionSlider data={props.cardsData} componentProps={{cardBgColor: props.cardBgColor}}/>
    </SchoolSolutionSliderWrapper>

    <SolutionContent>
      <TitleArea>
        <Title firstBox={props.firstBox}> {props.title} </Title>
      </TitleArea>

      {props.cardsData && props.cardsData.map((card,i) => {
        return(<Solution>
          <Heading>
            {card.tagline}
          </Heading>

          <Description>
            {props.description}
          </Description>

          <ActionArea>
            <ButtonWrapper>
              <PrimaryButton noMarginBottom onClick={props.onActionButtonClick} label="Get started"/>
            </ButtonWrapper>
          </ActionArea>
        </Solution>);
      });

    </SolutionContent>

  </BoxWrapper>
);
*/}

SolutionBox.propTypes = {
  content: PropTypes.string,
  active: PropTypes.bool,
  onActionButtonClick: PropTypes.func
}

export default SolutionBox;
