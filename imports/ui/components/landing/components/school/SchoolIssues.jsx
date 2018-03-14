import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Sticky from 'react-stickynode';
import {Element} from 'react-scroll';

import IssueSelectors from './issuesSection/IssueSelectors.jsx';
import SolutionBox from './issuesSection/SolutionBox';

import * as helpers from '../jss/helpers.js';

const OuterWrapper = styled.div`
  max-width: 100vw;
  height: 100%;
`;

// 108px is added for the computed height of the cards and the title above it
const Wrapper = styled.div`
  max-width: 100vw;
  width: 100%;
  height: 100vh;
  position: relative;
  background-color: ${props => props.bgColor};
  background-image: url('${props => props.bgImage}');
  background-position: bottom left;
  background-repeat: repeat no-repeat;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: ${helpers.tablet}px) {
    min-height: 100vh;
    height: 100%;
    background-attachment: initial;
    padding-top: 116px; // 100px is the height of problem cards + 16px marginbottom
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    padding-top: 0;
  }
`;

const SolutionBoxWrapper = styled.div`
  position: relative;
  max-width: 600px;
  min-height: 512px;
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

const IssuesTitle = styled.div`
  ${helpers.flexCenter}
  font-family: ${helpers.specialFont};
  font-style: italic;
  font-size: ${helpers.baseFontSize * 2}px;
  color: ${helpers.black};
  font-weight: 400;
  text-align: center;
  margin: 0;
  min-height: ${helpers.rhythmDiv * 8}px;
  line-height: 1;
  padding: ${helpers.rhythmDiv * 2}px 0;
  padding-top: ${helpers.rhythmDiv * 4}px;
`;

const Issues = styled.div`

`;

class SchoolIssues extends Component {
  state = {
    wrappers: [],
    mobile: false,
  }

  componentWillMount = () => {
    this.wrappers = [];
  }

  componentDidMount = () => {
    this.setState({
      wrappers: this.wrappers
    });
  }

  _getCardsDataForSolutionBox = (index) => {
    return this.props.cardsData['solutionBox'+(index+1)];
  }

  render() {
    // console.log(this.state.activeIssue,"lajsf");
    return(<OuterWrapper>
        <Issues>
          <IssuesTitle>{this.props.headerContent}</IssuesTitle>
          <IssueSelectors
              issues={this.props.issues}
              wrappers={this.state.wrappers}
            />
        </Issues>
        {this.props.issues && this.props.issues.map((issue, i) => (
          <Element name={`solution-container-${i}`}>
          <Wrapper
            bgImage={issue.bgImage}
            bgColor={issue.bgColor}
            firstBox={i === 0}
            ref={container => this.wrappers[i] = container}>

            <SolutionBox
              firstBox={i === 0}
              title={issue.title}
              cardsData={this._getCardsDataForSolutionBox(i)}
               />

            <Avatar src={issue.avatar} />
          </Wrapper></Element>))}
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
