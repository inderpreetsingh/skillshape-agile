import React, {Fragment,Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Swipe from 'react-easy-swipe';
import Events from '/imports/util/events';

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

  @media screen and (max-width: ${helpers.tablet}px) {
    justify-content: center;
  }
`;

const BoxInnerWrapper = styled.div`
  ${helpers.flexCenter}
  padding: ${helpers.rhythmDiv * 2}px;
  justify-content: space-between;
  width: 100%;

  @media screen and (max-width: ${helpers.tablet}px) {
    flex-direction: column-reverse;
    // padding: 0 ${helpers.rhythmDiv * 2}px;
    padding: 0;
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
  @media screen and (max-width: ${helpers.tablet + 100}px) {
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

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    font-size: 16px;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    margin-bottom: ${helpers.rhythmDiv * 2}px;
  }
`;

const Description = styled.p`
  margin: 0;
  font-weight: 300;
  font-size: 24px;
  font-family: ${helpers.specialFont};
  margin-bottom: ${helpers.rhythmDiv * 2}px;

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    font-size: 20px;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: 16px;
  }
`;

SchoolSolutionCardsWrapper = styled.div`
  ${helpers.flexCenter}
  width: 100%;
  justify-content: flex-start;
`;

SchoolSolutionCardsOuterWrapper = styled.div`
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 ${helpers.rhythmDiv * 2}px;
  margin-top: ${helpers.rhythmDiv * 2}px;
  flex-shrink: 1;

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
    flex-direction: column;
  }

`;

const ButtonWrapper = styled.div`
  display: flex;
  margin-right: ${props => props.marginRight}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    width: 100%;
    margin-bottom: ${helpers.rhythmDiv}px;
  }
`;

const SolutionContentWrapper = styled.div`
  ${helpers.flexCenter};
  flex-direction: column;
  padding: 0 ${helpers.rhythmDiv * 2}px;
  max-width: 500px;
  width: 100%;
  min-height: 300px;
  flex-shrink: 1;
  position: relative;

  @media screen and (max-width: ${helpers.tablet}px) {
    justify-content: flex-start;
    margin-bottom: ${helpers.rhythmDiv * 2}px;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    justify-content: flex-start;
  }
`;

const SolutionInnerContent = styled.div`
  display: flex;
  width: 100%;
`;

const SolutionContent = styled.div`
  position: absolute;
  transition: .2s opacity ease-in-out;
  opacity: ${props => props.showContent ? 1 : 0};
  z-index: ${props => props.showContent ? 1 : 0};
`;

const SolutionContentArea = styled.div`
  width: 100%;
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

  @media screen and (max-width: ${helpers.mobile}px) {
    margin-top: 0;
    margin: ${helpers.rhythmDiv * 2}px 0;
  }
`;

const MyProblemWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;


// const ProblemNumber = styled.p`
//   margin: 0;
//   color: ${helpers.danger};
//   font-size: 28px;
//   font-family: ${helpers.specialFont};
//   line-height: 1;
// `;

const ProblemTitle = styled.h2`
  margin: 0;
  color: ${helpers.black};
  font-size: 40px;
  font-family: ${helpers.specialFont};
  font-weight: 600;
  line-height: 1;
  text-align: center;

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    font-size: 32px;
  }
`;

const Arrows = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 40px;
  left: 0;
  bottom: 0;
  right: 0;
  font-size: 60px;
  font-family: ${helpers.specialFont};
  font-weight: 300;
  color: ${helpers.primaryColor};
  transition: .1s linear opacity;
  opacity: ${props => props.showArrows ? 1 : 0};
  ${helpers.flexCenter};
  align-items: flex-start;
`;

const Arrow = styled.p`
  display: flex;
  flex-direction: column;
  // flex-grow: 1;
  // flex-basis: 0;
  justify-content: center;
  cursor: pointer;
  position: relative;
  z-index: 3;
  align-items: center;
  font-size: 60px;
  font-family: ${helpers.specialFont};
  font-weight: 300;
  color: ${helpers.primaryColor};
  padding: 0 ${helpers.rhythmDiv}px;
  transition: .1s linear opacity;
  opacity: ${props => props.show ? 1 : 0};
`;

const LeftArrow = Arrow.extend``;

const RightArrow = Arrow.extend``;

const TOTAL_NUMBER_OF_SOLUTIONS = 3;

const MySwipe = styled.div`
  width: 100%;
`;

let myPosition = {
  initX : 0,
  initY : 0,
  currentX: 0,
  currentY: 0,
}

const TOUCH_MOVE_THRESHOLD = 40;

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

  handleSignUpButtonClick = () => {
    Events.trigger("registerAsSchool",{userType : 'School'});
  }

  _getNextSolution = (direction) => {
    let nextSolution = this.state.currentSolution;

    if(direction === 'left') {
      if(nextSolution === 0) {
        nextSolution = TOTAL_NUMBER_OF_SOLUTIONS;
      }else {
        nextSolution = --nextSolution;
      }
    }else {
      nextSolution = (++nextSolution) % (TOTAL_NUMBER_OF_SOLUTIONS + 1);
    }

    return nextSolution;
  }

  _moveToSolution = (direction) => {
    // get next solution with given direction.
    const nextSolution = this._getNextSolution(direction);

    //debugger;
    this.handleSolutionChange(nextSolution);
  }

  handleArrowClick = (arrow) => {
    this.moveToSolution(arrow);
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

  handleTouchStart = (e) => {
    console.log('handleTouchStart',e.touches[0].clientX);
    this.touchStarted = true;
    myPosition.initX = e.touches[0].clientX;
  }

  handleTouchMove = (e) => {
    console.info('handle Touch Move',e.touches[0].clientX);
    myPosition.currentX = e.touches[0].clientX;
  }

  _resetTouchEventData = () => {
    this.touchStarted = this.touchMoved = false;
    myPosition.initX = myPosition.initY = myPosition.currentX = myPosition.currentY = 0;
  }

  handleTouchCancel = (e) => {
    this._resetTouchEventData();
  }

  handleTouchEnd = (e) => {
    console.info('handle touch end');
    if(Math.abs(myPosition.currentX - myPosition.initX) > TOUCH_MOVE_THRESHOLD) {
      if(myPosition.initX < myPosition.currentX) {
        this._moveToSolution('right');
      }else {
        this._moveToSolution('left');
      }
    }
    this._resetTouchEventData();
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
        {this.state.contactDialog && <ContactUsDialogBox open={this.state.contactDialog} onModalClose={() => this.handleDialogBoxState('contactDialog',false)}/>}
        <Problem>
          <MyProblemWrapper>
            {/*<ProblemNumber>Problem #{props.solutionIndex}</ProblemNumber> */}
            <ProblemTitle>{props.title}</ProblemTitle>
          </MyProblemWrapper>
        </Problem>

        <BoxInnerWrapper>
          <SchoolSolutionCardsOuterWrapper>
            {this.state.showCards && <SchoolSolutionCardsWrapper>
              {props.cardsData && props.cardsData.map((card,i) => {
                  if(i == 0 || i == 1) {
                    return (<SchoolSolutionCard
                      key={i}
                      {...card}
                      active={i === this.state.currentSolution}
                      noMarginBotton={i === 2 || i === 3}
                      onCardClick={() => this.handleSolutionChange(i)}
                      cardBgColor={props.cardBgColor}/>)
                  }
              })}
              </SchoolSolutionCardsWrapper>}
            {this.state.showCards && <SchoolSolutionCardsWrapper>
                {props.cardsData && props.cardsData.map((card,i) => {
                    if(i == 2 || i == 3) {
                      return (<SchoolSolutionCard
                        key={i}
                        {...card}
                        active={i === this.state.currentSolution}
                        noMarginBotton={i === 2 || i === 3}
                        onCardClick={() => this.handleSolutionChange(i)}
                        cardBgColor={props.cardBgColor}/>)
                    }
                })}
              </SchoolSolutionCardsWrapper>}
            </SchoolSolutionCardsOuterWrapper>

          {/*this.state.showCards && <SchoolSolutionSliderWrapper>
            <SchoolSolutionSlider
              data={props.cardsData}
              sliderProps={{onBeforeSlideChange: this.handleSolutionChange}}
              componentProps={{cardBgColor: props.cardBgColor}} />
          </SchoolSolutionSliderWrapper>*/}

          <MySwipe
            onTouchStart={this.handleTouchStart}
            onTouchMove={this.handleTouchMove}
            onTouchCancel={this.handleTouchCancel}
            onTouchEnd={this.handleTouchEnd}
          >
            <SolutionContentWrapper
              onMouseOver={() => this.handleMouseEvent(true)}
              onMouseOut={() => this.handleMouseEvent(false)}>
              {props.cardsData && props.cardsData.map((card,i) => {
                return(<SolutionContent key={i} showContent={this.state.currentSolution === i}>
                  <SolutionInnerContent>
                    <Arrow show={this.state.showArrows} onClick={() => this.handleArrowClick('left')}> {'<'} </Arrow>

                    <SolutionContentArea>
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
                          <PrimaryButton noMarginBottom onClick={this.handleSignUpButtonClick} label="Sign up"/>
                        </ButtonWrapper>
                      </ActionArea>
                    </SolutionContentArea>

                    <Arrow show={this.state.showArrows} onClick={() => this.handleArrowClick('right')}> {'>'} </Arrow>
                  </SolutionInnerContent>
                </SolutionContent>)
              })}
            </SolutionContentWrapper>
          </MySwipe>
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
