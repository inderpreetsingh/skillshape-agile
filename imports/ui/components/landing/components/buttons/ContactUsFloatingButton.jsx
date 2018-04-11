import React, {Component, Fragment} from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { withStyles } from 'material-ui/styles';
import Icon from 'material-ui/Icon';
import MobileDetect from 'mobile-detect';

import ContactUsDialogBox from '../dialogs/ContactUsDialogBox.jsx';

import * as helpers from '../jss/helpers.js';

const styles = {
  iconStyles : {
    marginLeft: helpers.rhythmDiv,
    transform: 'translateY(2px)',
    cursor: 'pointer'
  }
};

const OuterWrapper = styled.div`
   position: fixed;
   right: ${helpers.rhythmDiv * 3}px;
   bottom: ${helpers.rhythmDiv * 3}px;
   z-index: 1500;
`;

const Wrapper = styled.div`
  ${helpers.flexCenter}
  transition: .2s ease-in max-width, .2s ease-in-out border-radius ${props => props.showComplete ? '0s' : '.1s'};
  max-height: 60px;
  max-width: ${props => props.showComplete ? 400 : 60}px;
  width: 100%;
  height: 100%;
  border-radius: ${props => props.showComplete ? helpers.rhythmDiv * 2 + 'px' : '50%'};
  background: ${helpers.black};
  border: 5px solid rgba(223,223,223,0.9);

  @media screen and (max-width: ${helpers.mobile}px) {
    max-height: 45px;
    max-width: ${props => props.showComplete ? 400 : 45}px;
  }
`;

const Text = styled.p`
  ${helpers.flexCenter}
  margin: 0;
  color: white;
  transition: .2s linear max-width, .2s linear transform , ${props => props.show ? '0.1s linear opacity 0.15s' : '0s linear opacity'};
  font-family: ${helpers.specialFont};
  font-size: ${props => props.largeFont ? helpers.baseFontSize * 1.25 : 18}px;
  font-weight: 400;
  opacity: ${props => props.show ? 1 : 0};
  padding: ${props => props.show ? `${helpers.rhythmDiv * 2}px ${helpers.rhythmDiv * 4}px` : 0};
  max-width: ${props => props.show ? '100%' : '0'};
  pointer-events: ${props => props.show ? 'all' : 'none'};
  cursor: ${props => props.showCursor ? 'pointer' : 'initial'};

  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: ${helpers.baseFontSize}px;
    padding: ${props => props.show ? helpers.rhythmDiv * 2 : 0}px;
  }
`;

const MyText = styled.span`
  cursor: pointer;
`;

class ContactUsFloatingButton extends Component {

  state = {
    showComplete : true,
    contactUsDialogBox: false,
  }

  handleShowCompleteButton = (e) => {
    e.preventDefault();
    this.setState({
      showComplete: !this.state.showComplete
    });
  }

  handleContactUsDialogBox = (state) => {
    this.setState({
      contactUsDialogBox: state
    })
  }

  handleMobileView = (e) => {
    const md = new MobileDetect(window.navigator.userAgent);
    if(md.mobile() || window.innerWidth < (helpers.mobile + 20)) {
      if(this.state.showComplete) {
        this.setState({showComplete: false});
      }
    }else {
      if(!this.state.showComplete) {
        this.setState({showComplete: true});
      }
    }
  }

  componentDidMount = () => {
    this.handleMobileView();
  }

  render() {
    return(<Fragment>
      {this.state.contactUsDialogBox && <ContactUsDialogBox open={this.state.contactUsDialogBox} onModalClose={() => this.handleContactUsDialogBox(false)} />}
      <OuterWrapper>
      <Wrapper showComplete={this.state.showComplete}>
        <Text show={this.state.showComplete} largeFont={false}>
          <MyText onClick={() => this.handleContactUsDialogBox(true)}>Confused ? Questions ? Click here</MyText>
          <Icon className={this.props.classes.iconStyles} onClick={this.handleShowCompleteButton}> keyboard_arrow_down </Icon>
        </Text>
        <Text show={!this.state.showComplete} largeFont showCursor onClick={this.handleShowCompleteButton}>
          <MyText> ? </MyText>
        </Text>
      </Wrapper></OuterWrapper></Fragment>)
  }
}

export default withStyles(styles)(ContactUsFloatingButton);
