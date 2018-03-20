import React, {Component} from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';
import Sticky from 'react-stickynode';
import {Element} from 'react-scroll';

import IssueFormatSelectors from './issuesSection/IssueFormatSelectors.jsx';
import SolutionBox from './issuesSection/SolutionBox';

import Girl from '../icons/Girl.jsx';
import Boy from '../icons/Boy.jsx';
import Desk from '../icons/Desk.jsx';

import GetStartedDialogBox from '../dialogs/GetStartedDialogBox.jsx';

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
  padding-top: 116px; // 100px is the height of problem cards + 16px marginbottom
  display: flex;
  flex-direction: column;

  @media screen and (max-width: ${helpers.tablet}px) {
    min-height: 100vh;
    height: 100%;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    padding-top: 0;
    height: 100vh;
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

const Avatar = styled.div`
  position: absolute;
  bottom: 8px;
  left: 30px;

  @media screen and (max-width: ${helpers.tablet}px) {

  }
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
    getStartedDialogBox: false,
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

  _getDataForSolutionBox = (index) => {
    return this.props.cardsData['solutionBox'+(index+1)];
  }

  _getAvatar = (index) => {
    if(index == 0) {
      return Boy;
    }else if(index == 1) {
      return Girl;
    }else if(index == 2) {
      return Desk;
    }
  }

  handleGetStartedDialogBoxState = (state) => {
    this.setState({
      getStartedDialogBox: state
    })
  }

  render() {
    // console.log(this.state.activeIssue,"lajsf");
    return(<OuterWrapper>
        <Issues>
          <IssuesTitle>{this.props.headerContent}</IssuesTitle>
          <IssueFormatSelectors
              issues={this.props.issues}
              wrappers={this.state.wrappers}
            />
        </Issues>
        {this.state.getStartedDialogBox && <GetStartedDialogBox open={this.state.getStartedDialogBox} onModalClose={() => this.handleGetStartedDialogBoxState(false)}/>}

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
              helpsUsIn={issue.helpsUsIn}
              cardBgColor={this._getDataForSolutionBox(i).cardBgColor}
              cardsData={this._getDataForSolutionBox(i).cardsData}
              onActionButtonClick={() => this.handleGetStartedDialogBoxState(true)}
            />

            {/*<Avatar src={issue.avatar} /> */}
            <Avatar>
              {this._getAvatar(i)}
            </Avatar>

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
