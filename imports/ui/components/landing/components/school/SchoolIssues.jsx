import React, { Component } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';
import Sticky from 'react-stickynode';
import { Element } from 'react-scroll';

import IssueFormatSelectors from './issues/IssueFormatSelectors.jsx';
import SolutionBox from './issues/SolutionBox';

import Girl from '../icons/Girl.jsx';
import Boy from '../icons/Boy.jsx';
import Desk from '../icons/Desk.jsx';

import GetStartedDialogBox from '../dialogs/GetStartedDialogBox.jsx';

import * as helpers from '../jss/helpers.js';

const OuterWrapper = styled.div`
	max-width: 100vw;
	height: 100%;
	overflow: hidden;
`;

// 108px is added for the computed height of the cards and the title above it
const Wrapper = styled.div`
  max-width: 100vw;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  position: relative;
  background-color: ${props => props.bgColor};
  background-image: url('${props => props.bgImage}');
  background-position: bottom left;
  background-repeat: repeat no-repeat;
  padding-top: 116px; // 100px is the height of problem cards + 16px marginbottom
  display: flex;
  flex-direction: column;

  @media screen and (max-width: ${helpers.tablet + 50}px) {
    min-height: 100vh;
	height: auto;
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

	@media screen and (max-width: ${helpers.tablet + 50}px) {
		max-width: 100%;
	}
`;

const Avatar = styled.div`
	position: absolute;
	bottom: 8px;
	left: 30px;
	z-index: 1;

	@media screen and (max-width: ${helpers.tablet + 50}px) {
		display: none;
	}
`;

const AvatarSmallScreen = styled.div`
	display: none;
	position: absolute;
	bottom: 8px;
	right: -10px;
	z-index: 1;

	@media screen and (max-width: ${helpers.tablet + 50}px) {
		display: block;
	}
`;

const IssuesTitle = styled.div`
	${helpers.flexCenter} font-family: ${helpers.specialFont};
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

const Issues = styled.div``;

class SchoolIssues extends Component {
	state = {
		wrappers: [],
		getStartedDialogBox: false,
		mobile: false
	};

	componentWillMount = () => {
		// Need to create a default array for storing multiple wrappers
		// when the actual DOM is created.
		this.wrappers = [];
	};

	componentDidMount = () => {
		this.setState({
			wrappers: this.wrappers
		});
	};

	_getDataForSolutionBox = (index) => {
		return this.props.cardsData['solutionBox' + (index + 1)];
	};

	_getAvatar = (index, smallScreen) => {
		if (index == 0) {
			return smallScreen ? <Boy height="50px" /> : <Boy />;
		} else if (index == 1) {
			return smallScreen ? <Girl height="50px" /> : <Girl />;
		} else if (index == 2) {
			return smallScreen ? <Desk height="50px" /> : <Desk />;
		}
	};

	handleGetStartedDialogBoxState = (state) => {
		this.setState({
			getStartedDialogBox: state
		});
	};

	render() {
		// console.log(this.state.activeIssue,"lajsf");
		return (
			<OuterWrapper>
				<Issues>
					<IssuesTitle>{this.props.headerContent}</IssuesTitle>
					<IssueFormatSelectors issues={this.props.issues} wrappers={this.state.wrappers} />
				</Issues>
				{this.state.getStartedDialogBox && (
					<GetStartedDialogBox
						open={this.state.getStartedDialogBox}
						onModalClose={() => this.handleGetStartedDialogBoxState(false)}
					/>
				)}

				{this.props.issues &&
					this.props.issues.map((issue, i) => (
						<Element name={`solution-container-${i}`}>
							<Wrapper
								bgImage={issue.bgImage}
								bgColor={issue.bgColor}
								firstBox={i === 0}
								ref={(container) => (this.wrappers[i] = container)}
							>
								<SolutionBox
									firstBox={i === 0}
									solutionIndex={i + 1}
									title={issue.title}
									helpsUsIn={issue.helpsUsIn}
									cardBgColor={this._getDataForSolutionBox(i).cardBgColor}
									cardsData={this._getDataForSolutionBox(i).cardsData}
									onActionButtonClick={() => this.handleGetStartedDialogBoxState(true)}
								/>

								{/*<Avatar src={issue.avatar} /> */}
								<Avatar> {this._getAvatar(i)} </Avatar>

								<AvatarSmallScreen> {this._getAvatar(i, true)} </AvatarSmallScreen>
							</Wrapper>
						</Element>
					))}
			</OuterWrapper>
		);
	}
}

SchoolIssues.propTypes = {
	headerContent: PropTypes.string
};

SchoolIssues.defaultProps = {
	headerContent: 'At school you face three main problems'
};

export default SchoolIssues;
