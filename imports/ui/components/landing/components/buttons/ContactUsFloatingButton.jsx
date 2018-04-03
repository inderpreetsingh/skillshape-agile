import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { withStyles } from 'material-ui/styles';
import Icon from 'material-ui/Icon';

import {Link} from 'react-router';

import * as helpers from '../jss/helpers.js';

const styles = {
  iconStyles : {
    transform: 'translateY(2px)',
    cursor: 'pointer'
  }
}

const Wrapper = styled.div`
  ${helpers.flexCenter}
  transition: .2s ease-in max-width, .1s ease-in-out border-radius;
  max-height: 60px;
  max-width: ${props => props.showComplete ? 400 : 60}px;
  width: 100%;
  height: 100%;
  border-radius: ${props => props.showComplete ? helpers.rhythmDiv * 2 + 'px' : '50%'};
  background: ${helpers.black};
  border: 5px solid rgba(223,223,223,0.9);
`;

const Text = styled.p`
  ${helpers.flexCenter}
  margin: 0;
  color: white;
  transition: .2s linear max-width, .2s linear transform , ${props => props.show ? '0.1s linear opacity 0.15s' : '0s linear opacity'};
  font-family: ${helpers.specialFont};
  font-size: ${props => props.largeFont ? helpers.baseFontSize * 1.25 : helpers.baseFontSize}px;
  font-weight: 400;
  opacity: ${props => props.show ? 1 : 0};
  padding: ${props => props.show ? `${helpers.rhythmDiv * 2}px` : 0};
  max-width: ${props => props.show ? '100%' : '0'};
  pointer-events: ${props => props.show ? 'all' : 'none'};
`;

const MyText = styled.span`

`;

const MyLink = styled(Link)`
  cursor: pointer;
  color: white;
  min-width: ${helpers.rhythmDiv * 3}px;
  text-align: center;
`;

const OuterWrapper = styled.div`
 position: fixed;
 right: 10px;
 bottom: 10%;
 z-index: 1500;
`;


class ContactUsFloatingButton extends Component {

  state = {
    showComplete : false
  }

  handleShowCompleteButton = (e) => {
    e.preventDefault();
    this.setState({
      showComplete: !this.state.showComplete
    });
  }

  render() {
    return(<OuterWrapper>
      <Wrapper showComplete={this.state.showComplete}>
        <Text show={this.state.showComplete} largeFont={false}>
          <MyText>Confused ? Questions ? <MyLink to="/contact-us"> click here</MyLink></MyText>
          <Icon className={this.props.classes.iconStyles} onClick={this.handleShowCompleteButton}> keyboard_arrow_down </Icon>
        </Text>
        <Text show={!this.state.showComplete} largeFont>
          <MyLink onClick={this.handleShowCompleteButton}> ? </MyLink>
        </Text>
      </Wrapper></OuterWrapper>
    )
  }
}

export default withStyles(styles)(ContactUsFloatingButton);
