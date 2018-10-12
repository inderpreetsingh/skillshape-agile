import React, { Fragment } from 'react';
import styled from 'styled-components';
import ReactStars from 'react-stars';
import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';

import PrimaryButton from '/imports/ui/components/landing/components/buttons/PrimaryButton.jsx';
import SecondaryButton from '/imports/ui/components/landing/components/buttons/SecondaryButton.jsx';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const ReviewsWrapper = styled.div`
	display: flex;
	flex-direction: column;
	margin: 0 0 ${helpers.rhythmDiv}px 0;
`;

const Reviews = styled.a`color: ${helpers.primaryColor};`;

// e.stopPropagation is necessary since cardbody is passing a default event to all it's children
const handleStarsClick = (e) => {
	e.stopPropagation();
};

const handleReviewsClick = (e) => {
	e.stopPropagation();
	e.preventDefault();
};

const ClassTypeCardBody = (props) => (
	<Fragment>
		{!props.editMode && (
			<ReviewsWrapper itemProp="aggregateRating" itemScope itemType="http://schema.org/AggregateRating">
				{!props.hideClassTypeOptions && (
					<Fragment>
						<div onClick={handleStarsClick}>
							<ReactStars size={15} value={props.ratings} edit={false} itemProp="ratingCount" />
						</div>
						<Reviews href="#" onClick={handleReviewsClick}>
							<span itemProp="reviewCount">{props.reviews}</span> Reviews
						</Reviews>
					</Fragment>
				)}
			</ReviewsWrapper>
		)}

		<Grid container spacing={8}>
			{!props.editMode && (
				<Grid item xs={12} sm={7}>
					<PrimaryButton
						icon
						iconName="add_circle_outline"
						fullWidth
						label="Join Class"
						onClick={props.onJoinClassButtonClick}
					/>
				</Grid>
			)}

			<Grid item xs={12} sm={5}>
				<SecondaryButton fullWidth label={'Details'} />
			</Grid>

			{props.editMode && (
				<Grid item xs={12} sm={7}>
					<PrimaryButton
						icon
						iconName="edit"
						fullWidth
						label="Edit Details"
						onClick={props.onEditClassTypeClick}
					/>
				</Grid>
			)}
		</Grid>
	</Fragment>
);

ClassTypeCardBody.propTypes = {
	ratings: PropTypes.number,
	joinClassButtonClick: PropTypes.func,
	reviews: PropTypes.number,
	editMode: PropTypes.bool
};

ClassTypeCardBody.defaultProps = {
	editMode: false
};

export default ClassTypeCardBody;
