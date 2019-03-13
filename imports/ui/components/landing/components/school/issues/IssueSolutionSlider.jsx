import React from 'react';
import styled from 'styled-components';
import IssueSolution from './IssueSolution';
import { SOLUTION_BOX_WIDTH } from './constants.js';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
import withSlider from '/imports/util/withSlider.js';

const config = {
  desktop: 1,
  tablet: 2,
  mobile: 1
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  max-width: 100vw;
  overflow: hidden;
`;

const Container = styled.div`
  display: flex;
  width: ${props => (props.totalElements + 1) * 100}vw;
  transition: all 1s ease-in-out;
  transform: translateX(${props => props.selectedIndex * -100}vw);
`;

const IssueSolutionWrapper = styled.div`
  width: 100vw;
  ${helpers.flexCenter}
`;

const Arrow = styled.button`
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  align-items: center;
  font-size: ${helpers.baseFontSize * 6}px;
  font-family: ${helpers.specialFont};
  font-weight: 300;
  z-index: 100000;
  width: auto;
  height: auto;
  color: ${helpers.primaryColor};
  padding: 0 ${helpers.rhythmDiv}px;
  top: 50%;
  transform: translateY(-50%);
  outline: none;

  &:hover {
    color: ${helpers.primaryColor};
  }

  &:focus {
    outline: none;
  }

  &:before {
    position: absolute;
    color: transparent;
  }
`;

const SliderLeftArrow = Arrow.extend`
  left: 10%;
  @media screen and (max-width: 1200px) {
    left: 5%;
  }
  @media screen and (max-width: 1000px) {
    left: ${helpers.rhythmDiv * 3}px;
  }
  @media screen and (max-width: 900px) {
    left: 0px;
  }
`;

const SliderRightArrow = Arrow.extend`
  right: 10%;

  @media screen and (max-width: 1200px) {
    right: 5%;
  }

  @media screen and (max-width: 1000px) {
    right: ${helpers.rhythmDiv * 3}px;
  }
  
  @media screen and (max-width: 900px) {
    right: 0px;
  }
`;

class IssueSolutionSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      totalElements: this.props.data.length - 1
    }
  }

  handleMoveLeft = () => {
    this.setState(state => {
      return {
        ...state,
        selectedIndex: state.selectedIndex === 0 ? state.totalElements : --state.selectedIndex
      }
    })
  }

  handleMoveRight = () => {
    this.setState(state => {
      return {
        ...state,
        selectedIndex: state.selectedIndex === state.totalElements ? 0 : ++state.selectedIndex
      }
    })
  }

  render() {
    const { totalElements, selectedIndex } = this.state;
    const { data, cardBgColor } = this.props;
    return (<Wrapper>
      {totalElements > 0 && <SliderLeftArrow onClick={this.handleMoveLeft}> {"<"} </SliderLeftArrow>}
      <Container totalElements={totalElements} selectedIndex={selectedIndex}>
        {data.map((cardData, i) => (
          <IssueSolutionWrapper key={i}>
            <IssueSolution cardBgColor={cardBgColor} {...cardData} />
          </IssueSolutionWrapper>))}
      </Container>
      {totalElements > 0 && <SliderRightArrow onClick={this.handleMoveRight}> {">"} </SliderRightArrow>}
    </Wrapper>
    )
  }
}

export default IssueSolutionSlider;