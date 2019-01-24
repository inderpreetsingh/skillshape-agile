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
  width: 100vw;
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

  &:hover {
    color: ${helpers.primaryColor};
  }

  &:before {
    position: absolute;
    color: transparent;
  }
`;

const SliderLeftArrow = Arrow.extend`
  left: ${helpers.rhythmDiv * 3}px;
  @media screen and (max-width: ${helpers.tablet + 120}px) {
    left: 0;
  }
`;

const SliderRightArrow = Arrow.extend`
  right: ${helpers.rhythmDiv * 3}px;
  @media screen and (max-width: ${helpers.tablet + 120}px) {
    right: 0;
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
    console.log(selectedIndex, 'SOLUTION SLIDER');
    return (<Wrapper>
      <SliderLeftArrow onClick={this.handleMoveLeft}> {"<"} </SliderLeftArrow>
      <Container totalElements={totalElements} selectedIndex={selectedIndex}>
        {data.map((cardData, i) => (
          <IssueSolutionWrapper key={i}>
            <IssueSolution cardBgColor={cardBgColor} {...cardData} />
          </IssueSolutionWrapper>))}
      </Container>
      <SliderRightArrow onClick={this.handleMoveRight}> {">"} </SliderRightArrow>
    </Wrapper>
    )
  }
}

export default IssueSolutionSlider;