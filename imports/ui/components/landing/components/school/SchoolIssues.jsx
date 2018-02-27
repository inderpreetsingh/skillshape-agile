import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Sticky from 'react-stickynode';
import {Element, scroller, scrollSpy } from 'react-scroll';

import IssueSelectors from './issuesSection/IssueSelectors.jsx';
import SolutionBox from './issuesSection/SolutionBox';

import * as helpers from '../jss/helpers.js';

const OuterWrapper = styled.div`
  max-width: 100vw;
  height: 100%;
  margin-top: -64px;
`;

const Wrapper = styled.div`
  max-width: 100vw;
  height: 100vh;
  padding-top: ${props => helpers.rhythmDiv * 8}px;
  background-color: ${props => props.bgColor};
  background-image: url('${props => props.bgImage}');
  background-size: contain;
  background-position: bottom left;
  background-repeat: no-repeat;
  position: relative;
`;

const SolutionBoxWrapper = styled.div`
  position: relative;
  max-width: 600px;
  height: 512px;
  width: 100%;

  @media screen and (max-width: ${helpers.tablet}px) {
    max-width: 100%;
  }
`;

const Avatar = styled.img`
  height: 100px;
  position: absolute;
  bottom: 0;
  left: 30px;
`;

class SchoolIssues extends Component {
  state = {
    activeIssue: 0,
    currentBgImage: '',
    displayIssueNumbers: true,
  }

  componentWillMount = () => {
    this.wrappers = [];
  }

  _calcSolutionWrappersData = () => {
    const documentElemTop = -1 * document.documentElement.getBoundingClientRect().top;
    return this.wrappers.map((wrapper,i) => {
      const wrapperObj = findDOMNode(wrapper);
      const wrapperObjRect = wrapperObj.getBoundingClientRect();
      return documentElemTop + wrapperObjRect.top;
    });
  }

  handleScroll = () => {
    const wrappersData = this._calcSolutionWrappersData();
    // If we are moved to the 3rd wrapper/solution box
    if(window.pageYOffset >= wrappersData[2]) {
      this.handleActiveIssueState(2);
    }else if(window.pageYOffset >= wrappersData[1]) {
      this.handleActiveIssueState(1);
    }else {
      this.handleActiveIssueState(0);
    }

    // This controls the issue numbers to only display for issues sections
    if(window.innerWidth < 500) {
      if(window.pageYOffset < wrappersData[0]) {
        if(this.state.displayIssueNumbers)
          this.setState({displayIssueNumbers : false});
      }else {
        if(!this.state.displayIssueNumbers)
          this.setState({displayIssueNumbers : true});
      }
    }
    // console.log(wrappersData,window.pageYOffset,"scrollevent","wrappers...");
  }

  componentDidMount = () => {
    this.handleScroll();
    window.addEventListener('scroll',this.handleScroll);
  }

  componentWillUnMount = () => {
    window.addEventListener('scroll',this.handleScroll);
  }

  handleActiveIssueState = (index,e) => {
    // console.log(index,'changing...');
    if(this.state.activeIssue !== index) {
      this.setState({
        activeIssue: index
      });
    }
  }

  scrollTo(index) {
    scroller.scrollTo((`solution-container-${index}`),{
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    });
  }

  handleCardClick = (index) => {
    this.scrollTo(index);
  }

  render() {
    // console.log(this.state.activeIssue,"lajsf");
    return(<OuterWrapper>
        {this.props.issues && this.props.issues.map((issue, i) => (
          <Element name={`solution-container-${i}`}>
          <Wrapper bgImage={issue.bgImage} bgColor={issue.bgColor} firstCard={i === 0} ref={container => this.wrappers[i] = container}>
            {i === 0 ? (<IssueSelectors
                displayIssueNumbers={this.state.displayIssueNumbers}
                issues={this.props.issues}
                activeIssue={this.state.activeIssue}
                handleCardClick={this.handleCardClick}
                />) : <span></span>}

            <SolutionBox
              title={issue.title}
               />

            <Avatar src={issue.avatar} />
          </Wrapper></Element>))};
      </OuterWrapper>
    )
  }
}

SchoolIssues.propTypes = {
  headerContent: PropTypes.string,
}

SchoolIssues.defaultProps = {
  headerContent: 'At school you face three main problems'
}

export default SchoolIssues;
