import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import IssueCard from './issuesSection/IssueCard';
import SolutionBox from './issuesSection/SolutionBox';

import * as helpers from '../jss/helpers.js';

const Wrapper = styled.div`
  transform: translateY(64px);
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.h2`
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
  justify-content: space-around;
  margin-bottom: ${helpers.rhythmDiv * 4}px;
`;

class SchoolIssues extends Component {
  state = {
    activeIssue: 0
  }

  handleActiveIssueState = (index) => (e) => {
    console.log(index,'changing...');
    this.setState({
      activeIssue: index
    });
  }
  render() {
    console.log(this.state.activeIssue,"lajsf");
    return(
      <Wrapper>

        <Header>{this.props.headerContent}</Header>

        <IssuesWrapper>
        {this.props.issues &&
          this.props.issues.map((issue,i) => (
            <IssueCard
              key={i}
              active={this.state.activeIssue === i}
              content={issue}
              onClick={this.handleActiveIssueState(i)}/>
          ))}
        </IssuesWrapper>

        <SolutionBox
          issues={this.props.issues}
          activeIssue={this.state.activeIssue}/>
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
