import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';

import Events from '/imports/util/events';

import PrimaryButton from '/imports/ui/components/landing/components/buttons/PrimaryButton.jsx';
import SchoolSolutionCard from '/imports/ui/components/landing/components/cards/SchoolSolutionCard.jsx';
import ContactUsDialogBox from '/imports/ui/components/landing/components/dialogs/ContactUsDialogBox.jsx';


import IssueSolutionSlider from './IssueSolutionSlider.jsx';
import { ToggleVisibilityTablet } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import { SOLUTION_BOX_WIDTH, CARD_HEIGHT } from './constants.js';
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
  flex-direction: column-reverse;
  width: 100%;

  @media screen and (max-width: ${helpers.tablet + 50}px) {
    //flex-direction: column-reverse;
    // padding: 0 ${helpers.rhythmDiv * 2}px;
	padding: 0;
	justify-content: flex-end;
  }
`;

// const SolutionListInner = styled.div`
// 	${helpers.flexCenter}
// 	min-width: 0;
// `;

const SolutionCards = styled.div`
	//max-width: ${SOLUTION_BOX_WIDTH + 100}px;
	height: ${CARD_HEIGHT + 20}px;
	// display: flex;
	// justify-content: center;
	// flex-grow: 1;
	// width: 100%;
	// padding: 0 ${helpers.rhythmDiv * 2}px;
	// margin-top: ${helpers.rhythmDiv * 2}px;

	@media screen and (max-width: ${helpers.tablet + 50}px) {
		max-width: 500px;
		height: ${props => props.totalCards > 1 ? '600px' : '500px'};
		height: fit-content;
		flex-direction: column;
		justify-content: flex-start;
	}

	@media screen and (max-width: ${helpers.mobile}px) {
		height: ${props => props.totalCards > 1 ? '700px' : '500px'};
	}
`;

const Solutions = styled.div`
	max-width: 800px;
	height: ${CARD_HEIGHT}px;
	width: 100%;
	display: flex;
	justify-content: center;
	padding: 0 ${helpers.rhythmDiv * 2}px;
	position: relative;
	margin: 0;

	@media screen and (max-width: ${helpers.tablet + 50}px) {
		display: none;
	}
`;

const CardWrapper = styled.div`
	max-width: 300px;
	max-height: fit-content;

	@media screen and (max-width: ${helpers.tablet + 50}px) {
		max-width: 500px;
		max-height: none;
	}
`;

const SolutionGfx = styled.img`	
  height: 100%;
  border-radius: 10px;
  background-position: 50% 50%; 
  box-shadow: ${helpers.buttonBoxShadow}; 	
`;

const Problem = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
	margin: ${helpers.rhythmDiv * 4}px 0;
	margin-bottom: ${helpers.rhythmDiv * 2}px;

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

				<ToggleVisibilityTablet show>
					<BoxInnerWrapper>
						<IssueSolutionSlider
							cardBgColor={props.cardBgColor}
							changeSolution={this.handleSolutionChange}
							currentSolution={this.state.currentSolution}
							data={props.cardsData}
						/>
					</BoxInnerWrapper>
				</ToggleVisibilityTablet>

				{/* Will be for the tablet/mobile*/}
				<ToggleVisibilityTablet>
					<BoxInnerWrapper>
						<SolutionCards totalCards={props.cardsData.length}>
							{props.cardsData &&
								props.cardsData.map((card, i) => (
									<CardWrapper>
										<SchoolSolutionCard
											key={i}
											{...card}
											active={i === this.state.currentSolution}
											onCardClick={() => this.handleSolutionChange(i)}
											cardBgColor={props.cardBgColor}
										/>
									</CardWrapper>
								))}
						</SolutionCards>

						{/*<Solutions totalCards={props.cardsData.length}>
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
											<SolutionGfx
												key={i} src={card.solutionContent} />
										</CSSTransition>
									);
								})}
							</Solutions> */}
					</BoxInnerWrapper>
				</ToggleVisibilityTablet>
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
