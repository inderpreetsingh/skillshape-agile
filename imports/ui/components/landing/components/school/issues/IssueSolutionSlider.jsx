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

const Arrow = styled.button`
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  align-items: center;
  font-size: ${helpers.rhythmDiv * 6}px;
  font-family: ${helpers.specialFont};
  font-weight: 300;
  z-index: 100000;
  width: auto;
  height: auto;
  color: ${helpers.primaryColor};
  padding: 0 ${helpers.rhythmDiv}px;

  &:hover {
    color: ${helpers.primaryColor};
  }

  &:before {
    position: absolute;
    color: transparent;
  }
`;

const SliderLeftArrow = Arrow.extend`
  left: 8px;

  @media screen and (max-width: ${helpers.mobile - 100}px) {
    left: -25px;
  }
`;

const SliderRightArrow = Arrow.extend`
  
  right: 8px;
  
  @media screen and (max-width: ${helpers.mobile - 100}px) {
    right: -25px;
  }
`;

const InnerWidth = styled.div`
  width: ${totalElements * 100}vw;
  transition: all 0.1s ease-in-out;
  transform: translate3d(${selectedIndex} * 100%, 0, 0});
`;

class IssueSolutionSlider extends React.Component {
  constructor(props) {
    super(props);
    state = {
      selectedIndex: 0,
      totalElements: this.props.data.length
    }
  }

  moveLeft = () => {
    this.setState(state => {
      return {
        ...state,
        selectedIndex: state.selectedIndex === 0 ? state.totalElements : --state.selectedIndex
      }
    })
  }

  moveRight = () => {
    this.setState(state => {
      return {
        ...state,
        selectedIndex: state.selectedIndex === state.totalElement ? 0 : ++state.selectedIndex
      }
    })
  }

  render() {
    const { totalElements } = this.state;
    return (<Wrapper>
      <SliderLeftArrow> {"<"} </SliderLeftArrow>
      <InnerWidth totalElements={totalElements} >
        {this.props.data.map(cardData =>
          <IssueSolution
            {...cardData}
          />)
        }
      </InnerWidth>
      <SliderRightArrow> {">"} </SliderRightArrow>
    </Wrapper>
    )
  }
}

export default withSlider(IssueSolution, config);