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
	max-width: ${getContainerMaxWidth(CARD_WIDTH, SPACING, 4) + 24}px;
	padding: ${helpers.rhythmDiv * 2}px ${helpers.rhythmDiv * 3}px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin: 0 auto;

	@media screen and (max-width: ${getContainerMaxWidth(CARD_WIDTH, SPACING, 4) + 24}px) {
		max-width: ${getContainerMaxWidth(CARD_WIDTH, SPACING, 3) + 24}px;
	}

	@media screen and (max-width: ${getContainerMaxWidth(CARD_WIDTH, SPACING, 3) + 24}px) {
		max-width: 100%;
	}

	@media screen and (max-width: ${helpers.mobile}px) {
		flex-direction: column;
	}
`;

const ButtonWrapper = styled.div``;

const TextWrapper = styled.div`
	font-size: ${helpers.baseFontSize * 1.25}px;
	text-align: left;
	max-width: 900px;
	margin-right: ${helpers.rhythmDiv * 2}px;

	@media screen and (max-width: ${helpers.mobile}px) {
		margin-bottom: ${helpers.rhythmDiv}px;
	}
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

const ListingButton = (props) => (
	<ButtonWrapper>
		<button className="danger-button" onClick={props.onClick}>
			<span className="skillshape-button--icon">{props.iconName}</span>
			{props.label}
		</button>
	</ButtonWrapper>
);

const ClaimSchoolRender = function (props) {
	let schools = this.props.collectionData;

	const NoneOfMyLisiting = (props) => (
		<NonListingWrapper>
			<TextWrapper>
				Check to see if any of these are your school. The filters can help you search! If you find your school,
				press the <b>claim</b> button. To create a new listing, click the New Listing button!
			</TextWrapper>

			<ListingButton
				onClick={props.onStartNewListingButtonClick}
				label={'New Listing'}
				iconName={'add_circle_outline'}
			/>
		</NonListingWrapper>
	);

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
				<NoneOfMyLisiting {...props} />
				<GridWrapper>
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
