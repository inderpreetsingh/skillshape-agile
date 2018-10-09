import React from 'react';
import { browserHistory, Link } from 'react-router';
import styled from 'styled-components';
import { withStyles } from 'material-ui/styles';
import isEmpty from 'lodash/isEmpty';
import Icon from 'material-ui/Icon';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import SchoolCard from '/imports/ui/components/landing/components/cards/schoolCard';
import NoResults from '/imports/ui/components/landing/components/NoResults.jsx';
import NoResultsFound from '/imports/ui/components/landing/components/helpers/NoResultsFound.jsx';
import FilterPanel from '/imports/ui/components/landing/components/FilterPanel.jsx';

import { cutString } from '/imports/util';
import { InfiniteScroll } from '/imports/util';
import { getContainerMaxWidth } from '/imports/util/cards.js';
import { ContainerLoader } from '/imports/ui/loading/container.js';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const SPACING = helpers.rhythmDiv * 2;
const CARD_WIDTH = 300;

const NoResultContainer = styled.div`
	text-align: center;
	width: 100%;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
`;

const NonListingWrapper = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;

	@media screen and (max-width: ${helpers.tablet}px) {
		flex-direction: column;
		align-items: center;
	}
`;

const FormSubmitButtonWrapper = styled.div`padding: ${helpers.rhythmDiv * 2}px;`;

const TextWrapper = styled.div`
	font-size: ${helpers.baseFontSize * 1.25}px;
	text-align: left;
	max-width: 900px;
	margin-left: ${helpers.rhythmDiv * 2}px;
`;

const GridInnerWrapper = styled.div`
	${helpers.flexCenter} justify-content: flex-start;
	flex-wrap: wrap;

	@media screen and (max-width: ${helpers.mobile}px) {
		justify-content: center;
	}
`;

const GridItem = styled.div`
	width: ${CARD_WIDTH}px;
	margin: ${(props) => props.spacing / 2 || '16'}px;

	@media screen and (max-width: ${helpers.mobile}px) {
		max-width: ${CARD_WIDTH}px;
		margin: ${(props) => props.spacing / 2 || '16'}px 0;
	}
`;

const GridWrapper = styled.div`
	padding: ${SPACING / 2}px;
	margin: 0 auto;
	max-width: ${getContainerMaxWidth(CARD_WIDTH, SPACING, 4) + 24}px;

	@media screen and (max-width: ${getContainerMaxWidth(CARD_WIDTH, SPACING, 4) + 24}px) {
		max-width: ${getContainerMaxWidth(CARD_WIDTH, SPACING, 3) + 24}px;
		${(props) => (props.suggestionForm ? 'max-width: 800px' : '')};
	}

	@media screen and (max-width: ${getContainerMaxWidth(CARD_WIDTH, SPACING, 3) + 24}px) {
		max-width: ${getContainerMaxWidth(CARD_WIDTH, SPACING, 2) + 24}px;
		${(props) => (props.suggestionForm ? 'max-width: 800px' : '')};
	}

	@media screen and (max-width: ${getContainerMaxWidth(CARD_WIDTH, SPACING, 2) + 24}px) {
		max-width: ${getContainerMaxWidth(CARD_WIDTH, SPACING, 1) + 24}px;
		${(props) => (props.suggestionForm ? 'max-width: 800px' : '')};
		margin: 0 auto;
	}
`;

const styles = {
	claimListingButton: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		fontWeight: 600,
		borderRadius: 10,
		backgroundColor: helpers.danger,
		color: 'white',
		textTransform: 'none',
		whiteSpace: 'nowrap',
		marginRight: helpers.rhythmDiv * 2
	},
	claimListingIcon: {
		color: 'white',
		marginLeft: helpers.rhythmDiv
	}
};

const ListingButton = withStyles(styles)((props) => (
	<Button className={props.classes.claimListingButton} onClick={props.onClick}>
		{props.label}
		<Icon className={props.classes.claimListingIcon}>{props.iconName}</Icon>
	</Button>
));

console.log(withStyles, '>>>>>>>>>>>>>.');

const ClaimSchoolRender = function(props) {
	let schools = this.props.collectionData;

	const NoneOfMyLisiting = (props) => (
		<NonListingWrapper>
			<TextWrapper>
				Check to see if any of these are your school. The filters can help you search! If you find your school,
				press the <b>claim</b> button. If you do not find it, click the button to the right to open a new
				listing!
			</TextWrapper>
			<FormSubmitButtonWrapper>
				<ListingButton
					onClick={props.onStartNewListingButtonClick}
					label={'New listing'}
					iconName={'add_circle_outline'}
				/>
			</FormSubmitButtonWrapper>
		</NonListingWrapper>
	);

	// if (this.props.isLoading) {
	//   return <div />;
	// }

	if (isEmpty(schools)) {
		return (
			<GridWrapper suggestionForm={this.props.suggestionForm}>
				{this.state.isLoading && <ContainerLoader />}
				<NoResultContainer>
					<NoneOfMyLisiting {...this.props} />

					<NoResults
						ghostButtons={true}
						removeAllFiltersButtonClick={props.removeAllFilters}
						addYourSchoolButtonClick={props.onStartNewListingButtonClick}
					/>
				</NoResultContainer>
			</GridWrapper>
		);
	} else {
		return (
			<div>
				<GridWrapper>
					<NoneOfMyLisiting {...props} />
					<GridInnerWrapper>
						{schools &&
							schools.map((school, index) => {
								return (
									<GridItem spacing={SPACING} key={index}>
										<SchoolCard
											schoolCardData={school}
											handleClaimASchool={this.props.handleClaimASchool}
										/>
									</GridItem>
								);
							})}
					</GridInnerWrapper>
				</GridWrapper>
			</div>
		);
	}
};

export default ClaimSchoolRender;
