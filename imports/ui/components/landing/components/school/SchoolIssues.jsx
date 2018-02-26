import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import IssueCard from './issuesSection/IssueCard';
import SolutionBox from './issuesSection/SolutionBox';

import * as helpers from '../jss/helpers.js';

const Wrapper = styled.div`
  ${helpers.flexCenter}
  justify-content: space-evenly;
  transform: translateY(64px);
  max-width: 1000px;
  margin: 0 auto;

  @media screen and (max-width: ${helpers.tablet}px) {
    flex-direction: column;
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
`;

const IssuesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  @media screen and (max-width: ${helpers.tablet}px) {
    ${helpers.flexCenter}
    flex-direction: row;
  }
`;

const LeftSideContent= styled.div`
  ${helpers.flexCenter}
  flex-direction: column;
  margin-right: ${helpers.rhythmDiv * 4}px;
  max-width: 300px;
  width: 100%;

  @media screen and (max-width: ${helpers.tablet}px) {
    max-width: initial;
    margin-right: 0;
    margin-bottom: ${helpers.rhythmDiv * 4}px;
  }
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

class SchoolIssues extends Component {
  state = {
    activeIssue: 0
  }

  handleScroll = () => {
    // console.log(window.pageYOffset);
    const solutionBox = findDOMNode(this.solutionBox);
    const solutionBoxRect = solutionBox.getBoundingClientRect();
    const documentElemTop = -1 * document.documentElement.getBoundingClientRect().top;
    const sbHeight = window.innerHeight * (window.innerHeight / document.body.offsetHeight);
    // console.log(solutionBox.elementTop, solutionBoxRect.top,solutionBox.elementTop + solutionBoxRect.top ,window.pageYOffset, sbHeight, window.pageYOffset+sbHeight)
    if(window.pageYOffset + sbHeight > documentElemTop + (solutionBoxRect.top + (solutionBoxRect.height * 2/3))) {
      this.handleActiveIssueState(2);
    }else if(window.pageYOffset + sbHeight > documentElemTop + (solutionBoxRect.top + (solutionBoxRect.height * 1/3))) {
      this.handleActiveIssueState(1);
    }else {
      this.handleActiveIssueState(0);
    }
  }

  componentDidMount = () => {
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
  render() {
    console.log(this.state.activeIssue,"lajsf");
    return(
      <Wrapper>
        <LeftSideContent>
          <IssuesTitle>{this.props.headerContent}</IssuesTitle>

          <IssuesWrapper>
          {this.props.issues &&
            this.props.issues.map((issue,i) => (
              <IssueCard
                key={i}
                active={this.state.activeIssue === i}
                onClick={() => this.handleActiveIssueState(i)}
                {...issue}
                />
            ))}
          </IssuesWrapper>
        </LeftSideContent>

        <SolutionBoxWrapper ref={container => this.solutionBox = container}>
          <SolutionBox
            issues={this.props.issues}
            activeIssue={this.state.activeIssue}/>
        </SolutionBoxWrapper>
      </Wrapper>
    )
  }
}

SchoolIssues.propTypes = {
  headerContent: PropTypes.string,
}

SchoolIssues.defaultProps = {
  headerContent: 'At school you will face three main problems'
}

export default SchoolIssues;
