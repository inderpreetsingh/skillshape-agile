import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

import { formatDate } from '/imports/util/formatSchedule.js';

import Package from '/imports/ui/components/landing/components/class/packages/Package.jsx';
import {
	Heading,
	SubHeading,
	Text,
	Italic
} from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const Wrapper = styled.div`
	position: relative;
	padding: ${helpers.rhythmDiv * 2}px;
	width: 100%;

	:after {
		content: "";
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		z-index: 0;
		background-color: ${(props) => (props.active ? helpers.primaryColor : helpers.panelColor)};
		opacity: 0.1;
	}
`;

const SubscriptionsTitle = Text.withComponent('h3').extend`
	text-align: center;
	font-size: ${helpers.baseFontSize}px;
	font-style: italic;
	margin-bottom: ${helpers.rhythmDiv}px;
`;

const AllSubscriptions = styled.div`
	max-width: 500px;
	width: 100%;
	margin: 0 auto;

	@media screen and (max-width: ${helpers.tablet}px) {
		max-width: 100%;
	}
`;

const SubscriptionDetails = styled.div`
	margin-bottom: ${helpers.rhythmDiv * 2}px;

	@media screen and (max-width: ${helpers.tablet}px) {
		max-width: 500px;
		width: 100%;
		margin: 0 auto;
		margin-bottom: ${helpers.rhythmDiv * 2}px;
	}
`;
const SubscriptionsList = (props) => {
	const { active, title, subsData, subsType, packageProps } = props;
	return (
		<Wrapper active={active}>
			<SubscriptionsTitle>{title}</SubscriptionsTitle>

			{!isEmpty(subsData) && (
				<AllSubscriptions>
					{subsData.map((subs) => {
						const startDate = moment(formatDate(subs.startDate));
						const endDate = moment(formatDate(subs.endDate));
						// console.log(endDate.diff(startDate, 'years'), 'expirey....');
						if (endDate.diff(startDate, 'years') > 20) {
							subs.expiry = 'none';
						} else {
							subs.expiry = true;
						}

						return (
							<SubscriptionDetails>
								<Package forSubscription {...packageProps} subsType={subsType} {...subs} />
							</SubscriptionDetails>
						);
					})}
				</AllSubscriptions>
			)}
		</Wrapper>
	);
};

SubscriptionsList.propTypes = {
	title: PropTypes.string,
	active: PropTypes.bool,
	subsType: PropTypes.string,
	subsData: PropTypes.object,
	packageProps: PropTypes.shape({
		bgColor: PropTypes.string,
		opacity: PropTypes.number
	})
};

SubscriptionsList.defaultProps = {
	active: false
};

export default SubscriptionsList;
