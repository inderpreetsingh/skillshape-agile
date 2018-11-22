import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';

import Events from '/imports/util/events';

import PrimaryButton from '/imports/ui/components/landing/components/buttons/PrimaryButton.jsx';
import SchoolSolutionCard from '/imports/ui/components/landing/components/cards/SchoolSolutionCard.jsx';
import SchoolSolutionSlider from '/imports/ui/components/landing/components/school/issues/SchoolCardsSlider.jsx';
import ContactUsDialogBox from '/imports/ui/components/landing/components/dialogs/ContactUsDialogBox.jsx';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const BoxWrapper = styled.div`
	${helpers.flexCenter} flex-direction: column;
	flex-grow: 1;
	justify-content: flex-start;
	max-width: ${helpers.schoolPageContainer + 200}px;
	width: 100%;
	height: 100%;
	margin: 0 auto;
	padding: 0 ${helpers.rhythmDiv * 2}px;
	position: relative;

	@media screen and (max-width: ${helpers.mobile}px) {
		max-width: 500px;
	}

	@media screen and (max-width: ${helpers.tablet + 50}px) {
		justify-content: center;
	}
`;

const BoxInnerWrapper = styled.div`
  ${helpers.flexCenter}
  padding: ${helpers.rhythmDiv * 2}px;
  justify-content: space-around;
  width: 100%;

  @media screen and (max-width: ${helpers.tablet + 50}px) {
    flex-direction: column-reverse;
    // padding: 0 ${helpers.rhythmDiv * 2}px;
    padding: 0;
  }
`;

const SolutionListInner = styled.div`
	${helpers.flexCenter} flex-direction: column;
	min-width: 0;
	justify-content: flex-start;
`;

const SolutionList = styled.div`
	max-width: 450px;
	width: 100%;
	height: 380px; // computed based on the cards and it's content.
	min-width: 0;
	display: flex;
	flex-grow: 1;
	padding: 0 ${helpers.rhythmDiv * 2}px;
	margin-top: ${helpers.rhythmDiv * 2}px;

	@media screen and (max-width: ${helpers.tablet + 50}px) {
		max-width: 500px;
		height: calc(400px + 360px);
	}

	@media screen and (max-width: ${helpers.mobile}px) {
		min-height: 800px;
	}
`;

const SolutionContentWrapper = styled.div`
	display: flex;
	flex-direction: column;
	padding: 0 ${helpers.rhythmDiv * 2}px;
	position: relative;
	max-width: 400px;
	width: 100%;
	height: 200px;
	margin: 0;
	position: relative;

	@media screen and (max-width: ${helpers.tablet + 50}px) {
		// max-width: 500px;
		// justify-content: flex-start;
		// margin-bottom: ${helpers.rhythmDiv * 2}px;
		display: none;
	}
`;

const SolutionContent = styled.img`	
  //background-image: url('${(props) => props.solutionContent}');
  //background-size: contain;
  //background-repeat: no-repeat;	
  height: 100%;
  border-radius: 10px;
  //object-fit: contain;
  background-position: 50% 50%; 
  box-shadow: ${helpers.buttonBoxShadow}; 	
`;

const Problem = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
	margin: ${helpers.rhythmDiv * 4}px 0;
	margin-bottom: 0;

	@media screen and (max-width: ${helpers.tablet + 50}px) {
		margin: ${helpers.rhythmDiv * 4}px 0;
	}

	@media screen and (max-width: ${helpers.mobile}px) {
		margin-top: 0;
		margin: ${helpers.rhythmDiv * 2}px 0;
	}
`;


// const ProblemNumber = styled.p`
//   margin: 0;
//   color: ${helpers.danger};
//   font-size: 28px;
//   font-family: ${helpers.specialFont};
//   line-height: 1;
// `;

const ProblemTitle = styled.h2`
	margin: 0;
	color: ${helpers.black};
	font-size: 40px;
	font-family: ${helpers.specialFont};
	font-weight: 600;
	line-height: 1;
	text-align: center;

	@media screen and (max-width: ${helpers.tablet + 50}px) {
		font-size: 32px;
	}
`;

class SolutionBox extends Component {
	state = {
		currentSolution: 0,
		showArrows: false,
		showCards: true
	};

	handleDialogBoxState = (dialogBoxName, state) => {
		this.setState({
			[dialogBoxName]: state
		});
	};

	handleSignUpButtonClick = () => {
		Events.trigger('registerAsSchool', { userType: 'School' });
	};

	handleSolutionChange = (currentSolution) => {
		this.setState({ currentSolution });
	};

	handleScreenResize = () => {
		if (window.innerWidth <= helpers.tablet) {
			if (this.state.showCards) this.setState({ showCards: false });
		} else {
			if (!this.state.showCards) this.setState({ showCards: true });
		}
	};

	componentWillMount = () => {
		window.addEventListener('resize', this.handleScreenResize);
	};

	componentDidMount = () => {
		this.handleScreenResize();
	};

	componentWillUnMount = () => {
		window.removeEventListener('resize', this.handleScreenResize);
	};

	render() {
		const { props } = this;
		return (
			<BoxWrapper firstBox={props.firstBox}>
				{this.state.contactDialog && (
					<ContactUsDialogBox
						open={this.state.contactDialog}
						onModalClose={() => this.handleDialogBoxState('contactDialog', false)}
					/>
				)}
				<Problem>
					{/*<ProblemNumber>Problem #{props.solutionIndex}</ProblemNumber> */}
					<ProblemTitle>{props.title}</ProblemTitle>

				</Problem>

				<BoxInnerWrapper>
					<SolutionList>
						<SolutionListInner>
							{props.cardsData &&
								props.cardsData.map((card, i) => (
									<SchoolSolutionCard
										key={i}
										{...card}
										active={i === this.state.currentSolution}
										noMarginBotton={i === 2 || i === 3}
										onCardClick={() => this.handleSolutionChange(i)}
										cardBgColor={props.cardBgColor}
									/>
								))}
						</SolutionListInner>
					</SolutionList>

					<SolutionContentWrapper>
						{props.cardsData &&
							props.cardsData.map((card, i) => {
								const isCurrentSolutionSelected = this.state.currentSolution === i;
								return (
									<CSSTransition
										in={isCurrentSolutionSelected}
										timeout={{
											enter: 600,
											exit: 400
										}}
										classNames="fade"
										unmountOnExit
									>
										<SolutionContent key={i} src={card.solutionContent} />
									</CSSTransition>
								);
							})}
					</SolutionContentWrapper>
				</BoxInnerWrapper>
			</BoxWrapper>
		);
	}
}

SolutionBox.propTypes = {
	content: PropTypes.string,
	active: PropTypes.bool,
	onActionButtonClick: PropTypes.func
};

export default SolutionBox;
