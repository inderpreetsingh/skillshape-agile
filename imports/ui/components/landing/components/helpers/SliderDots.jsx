import React ,{Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import * as helpers from '../jss/helpers.js';

const Wrapper = styled.div`
  ${helpers.flexCenter}
`;

const Dot = styled.div`
  border: 1px solid ${props => props.dotColor};
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: ${helpers.rhythmDiv/2}px;
  transition: background .2s linear;
  cursor: pointer;
  background: ${props => props.selected ? props.dotColor : 'white'};

  &:last-of-type {
    margin-right: 0;
  }
`;

class SliderDots extends Component {
  state = {
    currentIndex: this.props.currentIndex
  }

  handleDotClick = (index) => () => {
    console.log(this.props,"this .props....");
    if(this.state.currentIndex != index) {
      this.setState({ currentIndex : index});

      if(this.props.onDotClick) {
        this.props.onDotClick(index);
      }
    }
  }

  createDots = (noOfDots) => {
    const dots = [];
    const {currentIndex} = this.state;
    const {dotColor, dotClassName} = this.props;
    for(let i = 0; i < noOfDots; ++i) {
      dots.push(<Dot
          key={i}
          selected={i === currentIndex}
          dotColor={dotColor}
          onClick={this.handleDotClick(i)} />);
    }
    return dots;
  }

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.currentIndex !== this.state.currentIndex) {
      this.setState({ currentIndex: nextProps.currentIndex});
    }
  }

  render() {
    console.log('this .props ',this.props);
    return (<Wrapper> {this.createDots(this.props.noOfDots)} </Wrapper>)
  }
}

SliderDots.defaultProps = {
  dotColor: helpers.black
}

export default SliderDots;
