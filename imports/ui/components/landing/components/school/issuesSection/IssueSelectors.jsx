import React, {Component, Fragment} from 'react';
import {scroller, Events, scrollSpy} from 'react-scroll';
import {findDOMNode} from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Sticky from 'react-stickynode';

import * as helpers from '../../jss/helpers.js';
import IssueCard from './IssueCard.jsx';
import IssueNumber from './IssueNumber.jsx';

const Wrapper= styled.div`
  ${helpers.flexCenter}
  flex-direction: column;
  margin: 0 auto;
  width: 100%;

  @media screen and (max-width: ${helpers.tablet}px) {
    max-width: initial;
    margin-right: 0;
    margin-bottom: ${helpers.rhythmDiv * 4}px;
  }

  @media screen and (max-width: ${helpers.tablet}px) {
    margin-bottom: 0;
  }
`;

const IssuesTitle = styled.h2`
  font-family: ${helpers.specialFont};
  font-style: italic;
  font-size: ${helpers.baseFontSize * 2}px;
  color: ${helpers.black};
  font-weight: 400;
  text-align: center;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  display: ${props => props.mobile ? 'none' : 'block'};

  @media screen and (max-width: ${helpers.mobile}px) {
    display: block;
  }
`;

const IssuesWrapper = styled.div`
  ${helpers.flexCenter}
  width: 100%;
`;

const IssuesNumberWrapper = styled.div`
  display: none;

  @media screen and (max-width: ${helpers.mobile}px) {
    ${helpers.flexCenter}
    flex-direction: column;
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    left: ${helpers.rhythmDiv}px;
    z-index: 15;

    display: ${props => props.displayIssueNumbers && !props.hideIssues ? 'flex' : 'none'};
  }
`;

const IssuesFixed = styled.div`
  display: ${props => props.hideIssues ? 'none' : 'block'};
  background-color: white;
  padding: ${helpers.rhythmDiv}px;
`;

class IssueSelectors extends Component {
  state = {
    activeIssue: -1,
    clickEvent: false,
    wrappers: [], // It is the solution boxes to which we want to scroll .
    hideIssues: true,
    sticky: false,
    displayIssueNumbers: true,
  }

  handleStickyStateChange = (status) => {
    console.log(status,"status..")
    if (status.status === 2) {
      if(!this.state.sticky) {
        this.setState({
          sticky: true
        });
      }
    }else if(status.status === 0) {
      this.setState({
         sticky: false
      });
    }
  }

  _calcSolutionWrappersData = () => {
    const documentElemTop = -1 * document.documentElement.getBoundingClientRect().top;
    return this.state.wrappers.map((wrapper,i) => {
      const wrapperObj = findDOMNode(wrapper);
      const wrapperObjRect = wrapperObj.getBoundingClientRect();
      return documentElemTop + wrapperObjRect.top;
    });
  }

  handleHideIssues = (state) => {
    if(this.state.hideIssues !== state) {
      this.setState({
        hideIssues: state
      });
    }
  }

  handleScroll = () => {
    const wrappersData = this._calcSolutionWrappersData();
    console.log(this.state.clickEvent,"scrolling...");

    // debugger;
    // This controls whether we want to show the issue cards or not.
    if(window.pageYOffset >= (wrappersData[2] + window.innerHeight - 200) || (window.innerWidth <= 500 && window.pageYOffset <= (wrappersData[0] - 100))) {
      this.handleHideIssues(true);
    }else {
      this.handleHideIssues(false);
    }

    if(!this.state.clickEvent) {

      // If we have moved to the 3rd wrapper/solution box
      if(window.pageYOffset >= wrappersData[2]) {
        this.handleActiveIssueState(2);
      }else if(window.pageYOffset >= wrappersData[1]) {
        this.handleActiveIssueState(1);
      }else if(window.pageYOffset >= wrappersData[0]) {
        this.handleActiveIssueState(0);
      }else {
        this.handleActiveIssueState(-1);
      }
    }

    // This controls the issue numbers to only display for browser width less than 500
    if(window.innerWidth < 500) {
      if (!this.state.displayIssueNumbers) this.setState({displayIssueNumbers : true});
    }else {
      if(this.state.displayIssueNumbers) this.setState({displayIssueNumbers : false});
    }
    // console.log(wrappersData,window.pageYOffset,"scrollevent","wrappers...");
  }

  componentDidMount = () => {
    const self = this;

    self.handleScroll();

    Events.scrollEvent.register('end', function(to, element) {
      console.log("scroll end....");
      self.setState({ clickEvent: false});
    });

    scrollSpy.update();

    window.addEventListener('scroll',self.handleScroll);
  }

  componentWillUnMount = () => {
    Events.scrollEvent.remove('end');

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
    this.setState({
      clickEvent: true,
      activeIssue: index
    });
    this.scrollTo(index);
  }

  componentWillReceiveProps = (nextProps) => {
    if(this.state.wrappers.length !== nextProps.wrappers) {
      this.setState({
        wrappers: nextProps.wrappers
      });

      this.handleScroll();
    }
  }

  render() {
    return(<Wrapper>
      <Sticky className='issue-cards' onStateChange={this.handleStickyStateChange}>
        <IssuesFixed sticky={this.state.sticky} hideIssues={this.state.hideIssues}>
            <IssuesWrapper>
            {this.props.issues &&
              this.props.issues.map((issue,i) => (
                <IssueCard
                  key={i}
                  active={this.state.activeIssue === i}
                  onClick={() => this.handleCardClick(i)}
                  {...issue}
                  />
              ))}
            </IssuesWrapper>
        </IssuesFixed>
      </Sticky>

      <IssuesNumberWrapper displayIssueNumbers={this.state.displayIssueNumbers} hideIssues={this.state.hideIssues}>
      {this.props.issues &&
        this.props.issues.map((issue,i) => (
          <IssueNumber
            key={i}
            active={this.state.activeIssue === i}
            issueIndex={i + 1}
            onClick={() => this.handleCardClick(i)}
            />
        ))}
      </IssuesNumberWrapper>
    </Wrapper>)
  }
}

IssueSelectors.defaultProps = {
  headerContent: 'At school you face three main problems'
}

export default IssueSelectors;
