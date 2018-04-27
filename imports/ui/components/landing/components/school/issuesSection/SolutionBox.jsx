import React, {Fragment,Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import PrimaryButton from '../../buttons/PrimaryButton.jsx';

import SchoolSolutionCard from '../../cards/SchoolSolutionCard.jsx';
import SchoolSolutionSlider from './SchoolCardsSlider.jsx';

import ContactUsDialogBox from '/imports/ui/components/landing/components/dialogs/ContactUsDialogBox.jsx';

import * as helpers from '../../jss/helpers.js';

const BoxWrapper = styled.div`
  ${helpers.flexCenter}
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-evenly;
  max-width: ${helpers.schoolPageContainer + 200}px;
  width: 100%;
  margin: 0 auto;
  height: 100%;
  padding: 0 ${helpers.rhythmDiv * 2}px;
  position: relative;
  overflow: hidden;

  @media screen and (max-width: ${helpers.mobile}px) {
    max-width: 500px;
  }
`;

const BoxInnerWrapper = styled.div`
  ${helpers.flexCenter}
  padding: ${helpers.rhythmDiv * 2}px;
  justify-content: space-between;
  width: 100%;

  @media screen and (max-width: ${helpers.tablet}px) {
    flex-direction: column-reverse;
  }
`;

const TitleArea = styled.div`
  width: 100%;
  margin-top: ${helpers.rhythmDiv * 2}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    ${helpers.flexCenter}
  }
`;
const SolutionNumber = styled.p`
  color: ${helpers.primaryColor};
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.specialFont};
  margin: 0;
`;

const Title = styled.h2`
  color: ${helpers.black};
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize * 2}px;
  font-weight: 500;
  line-height: 1;
  margin: 0;
  @media screen and (max-width: ${helpers.tablet}px) {
    font-size: ${helpers.baseFontSize * 1.5}px;
  }
`;

const Tagline = styled.h3`
  color: ${helpers.black};
  font-family: ${helpers.specialFont};
  font-size: 18px;
  font-style: italic;
  font-weight: 400;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv * 4}px;
  line-height: 1;
`;

const Description = styled.p`
  margin: 0;
  font-weight: 300;
  font-size: 24px;
  font-family: ${helpers.specialFont};
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

SchoolSolutionCardsWrapper = styled.div`
  ${helpers.flexCenter}
  width: 100%;
  max-width: ${464 + 2 * helpers.rhythmDiv * 2}px;
  flex-wrap: wrap;
  justify-content: flex-start;
  flex-shrink: 0;
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

const SolutionContentWrapper = styled.div`
  ${helpers.flexCenter};
  flex-direction: column;
  padding: 0 ${helpers.rhythmDiv * 2}px;
  max-width: 500px;
  min-height: 400px;
  width: 100%;
  position: relative;

  @media screen and (max-width: ${helpers.tablet}px) {
    margin-bottom: ${helpers.rhythmDiv * 2}px;
  }
`;

const SolutionContent = styled.div`
  position: absolute;
  transition: .2s opacity ease-in-out;
  opacity: ${props => props.showContent ? 1 : 0};
  z-index: ${props => props.showContent ? 1 : 0};
`;


const SolutionWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 150px;
`;

const Solution = styled.div`

`;

const Problem = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: ${helpers.rhythmDiv * 4}px 0;
`;

const MyProblemWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProblemNumber = styled.p`
  margin: 0;
  color: ${helpers.danger};
  font-size: 28px;
  font-family: ${helpers.specialFont};
  line-height: 1;
`;

const ProblemTitle = styled.h2`
  margin: 0;
  color: ${helpers.black};
  font-size: 40px;
  font-family: ${helpers.specialFont};
  font-weight: 600;
  line-height: 1;
`;

const Arrows = styled.div`
  position: absolute;
  width: 100%;
  font-size: 60px;
  font-family: ${helpers.specialFont};
  font-weight: 300;
  color: ${helpers.primaryColor};
  ${helpers.flexCenter}
  transition: .1s linear opacity;
  opacity: ${props => props.showArrows ? 1 : 0};
`;

const LeftArrow = styled.p`
  width: 100%;
  margin: 0;
  position: relative;
  left: -30px;
  cursor: pointer;

  @media screen and (max-width: ${helpers.mobile}px) {
    left: -15px;
  }
`;

const RightArrow = styled.p`
  margin: 0;
  right: 0;
  position: relative;
  right: -30px;
  cursor: pointer;

  @media screen and (max-width: ${helpers.mobile}px) {
    right: -15px;
  }
`;
const TOTAL_NUMBER_OF_SOLUTIONS = 3;

class SolutionBox extends Component {

  state = {
    currentSolution: 0,
    showArrows: false,
    showCards: true,
  }

  handleDialogBoxState = (dialogBoxName,state) => {
    this.setState({
      [dialogBoxName] : state
    })
  }

  handleArrowClick = (arrow) => {
    let nextSolution = this.state.currentSolution;
    if(arrow === 'left') {
      if(0 === nextSolution) {
        nextSolution = TOTAL_NUMBER_OF_SOLUTIONS;
      }else {
        nextSolution = --nextSolution;
      }
    }else {
      nextSolution = (++nextSolution) % (TOTAL_NUMBER_OF_SOLUTIONS + 1);
    }
    //debugger;
    this.handleSolutionChange(nextSolution);
  }

  handleSolutionChange = (currentSolution) => {
    this.setState({currentSolution});
  }

  handleScreenResize = () => {
    if(window.innerWidth <= helpers.tablet) {
      // console.log(window.innerWidth,"------");
      if(this.state.showCards)
        this.setState({showCards: false});
    }else {
      if(!this.state.showCards)
        this.setState({showCards: true});
    }
  }

  handleMouseEvent = (state) => {
    this.setState({
      showArrows: state
    });
  }

  componentWillMount = () => {
    window.addEventListener('resize',this.handleScreenResize);
  }

  componentDidMount = () => {
    this.handleScreenResize();
  }

  componentWillUnMount = () => {
    window.removeEventListener('resize',this.handleScreenResize);
  }

  render() {
    const {props} = this;
    return(<BoxWrapper firstBox={props.firstBox}>
        {this.state.contactDialog && <ContactUsDialogBox open={this.state.contactDialog} onClose={() => this.handleDialogBoxState('contactDialog',false)}/>}
        <Problem>
          <MyProblemWrapper>
            {/*<ProblemNumber>Problem #{props.solutionIndex}</ProblemNumber> */}
            <ProblemTitle>{props.title}</ProblemTitle>
          </MyProblemWrapper>
        </Problem>
        <BoxInnerWrapper>
          {this.state.showCards && <SchoolSolutionCardsWrapper>
            {props.cardsData && props.cardsData.map((card,i) => (
              <SchoolSolutionCard
                key={i}
                {...card}
                downwards={i === 2 || i === 3}
                active={i === this.state.currentSolution}
                noMarginBotton={i === 2 || i === 3}
                onCardClick={() => this.handleSolutionChange(i)}
                cardBgColor={props.cardBgColor}/>
            ))}
          </SchoolSolutionCardsWrapper>}

          {/*this.state.showCards && <SchoolSolutionSliderWrapper>
            <SchoolSolutionSlider
              data={props.cardsData}
              sliderProps={{onBeforeSlideChange: this.handleSolutionChange}}
              componentProps={{cardBgColor: props.cardBgColor}} />
          </SchoolSolutionSliderWrapper>*/}

          <SolutionContentWrapper
            onTouchMove={this.handleTouchEvent}
            onTouchStart={this.handleTouchStart}
            onMouseOver={() => this.handleMouseEvent(true)}
            onMouseOut={() => this.handleMouseEvent(false)}>
            <Arrows showArrows={this.state.showArrows}>
              <LeftArrow onClick={() => this.handleArrowClick('left')}> {'<'} </LeftArrow>
              <RightArrow onClick={() => this.handleArrowClick('right')}> {'>'} </RightArrow>
            </Arrows>
            {props.cardsData && props.cardsData.map((card,i) => {
              return(<SolutionContent key={i} showContent={this.state.currentSolution === i}>
                {/*<SolutionNumber>Solution #{props.solutionIndex}</SolutionNumber> */}
                <Title firstBox={props.firstBox}> {card.title} </Title>

                <Tagline>
                  {card.tagline}
                </Tagline>

                <Description>
                  {card.content}
                </Description>

                <ActionArea>
                  <ButtonWrapper marginRight={helpers.rhythmDiv * 2}>
                    <PrimaryButton noMarginBottom onClick={() => this.handleDialogBoxState('contactDialog',true)} label="Any doubts?" />
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <PrimaryButton noMarginBottom onClick={props.onActionButtonClick} label="Get started"/>
                  </ButtonWrapper>
                </ActionArea>
              </SolutionContent>)
            })}
            </SolutionContentWrapper>

        </BoxInnerWrapper>
      </BoxWrapper>);
  }
}

{/*
  marginTop={(i == 1 && helpers.rhythmDiv * 4) || (i == 2 && -1 * helpers.rhythmDiv * 4)}
  marginLeft={i === 2 && helpers.rhythmDiv * 2}
*/}

SolutionBox.propTypes = {
  content: PropTypes.string,
  active: PropTypes.bool,
  onActionButtonClick: PropTypes.func
}

export default SolutionBox;
