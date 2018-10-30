import React, { Fragment } from 'react';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import ProgressiveImage from 'react-progressive-image';

import { withStyles } from 'material-ui/styles';
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';

import CallUsDialogBox from '/imports/ui/components/landing/components/dialogs/CallUsDialogBox.jsx';
import EmailUsDialogBox from '/imports/ui/components/landing/components/dialogs/EmailUsDialogBox.jsx';
import MemberActionButton from '/imports/ui/components/landing/components/buttons/MemberActionButton.jsx';
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton.jsx';

import School from '/imports/api/school/fields';

import {
	Heading,
	SubHeading,
	Text,
	Italic
} from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const Wrapper = styled.div`
	max-width: 800px;
	margin: 0 auto;
`;

const ImageContainer = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  flex-shrink: 0;
  ${helpers.coverBg};
  margin-right: ${helpers.rhythmDiv * 2}px;
  margin-bottom: ${helpers.rhythmDiv}px;
  background-position: 50% 50%;
  background-image: url('${(props) => props.src}');
  transition: background-image 1s linear !important;
`;

const ActionButtonsWrapper = styled.div`
	${helpers.flexCenter} left: ${helpers.rhythmDiv * 2}px;
	bottom: ${helpers.rhythmDiv * 2}px;
	padding: ${helpers.rhythmDiv}px;
	right: auto;
	@media screen and (max-width: ${helpers.tablet + 100}px) {
		justify-content: flex-start;
		align-items: flex-start;
		bottom: 0;
	}

	@media screen and (max-width: ${helpers.tablet}px) {
		position: initial;
		align-items: center;
		flex-direction: row;
		flex-wrap: wrap;
	}
`;

const ActionButton = styled.div`
	margin-right: ${helpers.rhythmDiv}px;

	@media screen and (max-width: ${helpers.tablet + 100}px) {
		margin-right: 0;
		margin-bottom: ${helpers.rhythmDiv * 2}px;
	}

	@media screen and (max-width: ${helpers.tablet}px) {
		margin-right: ${helpers.rhythmDiv}px;
	}
`;

const Subscriptions = styled.div`
	display: flex;
	width: 100%;
`;

const SubscriptionsTitle = Text.withComponent('h3').extend`
	text-align: center;
	font-size: ${helpers.baseFontSize}px;
	font-style: italic;
	margin-bottom: ${helpers.rhythmDiv}px;
`;

const SubscriptionsContent = styled.div`
	position: relative;
	width: 50%;
	padding: ${helpers.rhythmDiv * 2}px;

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

const PageTitle = Heading.extend`
	font-size: ${helpers.baseFontSize * 2}px;
	text-align: center;
	margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const SchoolProfile = styled.div`
	/* prettier-ignore */
	${helpers.flexCenter}
`;

const ActionButtons = (props) => (
	<ActionButtonsWrapper>
		<ActionButton onClick={() => props.handleVisitSchool(props.schoolSlug)}>
			<FormGhostButton icon iconName="school" label="Visit School" />
		</ActionButton>

		<ActionButton onClick={() => props.handleCall(props.memberInfo)}>
			<FormGhostButton icon iconName="phone" label="Call" />
		</ActionButton>

		<ActionButton onClick={() => props.handleEmail(props.memberInfo)}>
			<FormGhostButton icon iconName="email" label="Email" noMarginBottom />
		</ActionButton>
	</ActionButtonsWrapper>
);

const styles = {
	expansionPanelRoot: {
		border: 'none'
	},
	expansionPanelRootExpanded: {
		border: `1px solid black`
	},
	expansionPanelDetails: {
		padding: 0,
		marginTop: helpers.rhythmDiv
	},
	expansionPanelSummary: {
		margin: 0,
		padding: helpers.rhythmDiv
	},
	expansionPanelSummaryContent: {
		margin: 0,
		justifyContent: 'space-between'
	}
};

const MySubscriptionRender = (props) => {
	const getSchoolDataBasedOnSubscription = (sbsData) => {
		return School.find({ _id: sbsData.schoolId }).fetch()[0];
	};

	const {
		src,
		phone,
		classes,
		schoolData,
		purchaseData,
		callUsDialog,
		emailUsDialog,
		handleCall,
		handleEmail,
		handleModelState,
		handleVisitSchool
	} = props;

	return (
		<Fragment>
			{callUsDialog && (
				<CallUsDialogBox
					contactNumbers={[ phone ]}
					open={callUsDialog}
					onModalClose={handleModelState('callUsDialog', false)}
				/>
			)}
			{emailUsDialog && (
				<EmailUsDialogBox
					ourEmail={email}
					schoolData={schoolData}
					open={emailUsDialog}
					onModalClose={handleModelState('emailUsDialog', false)}
				/>
			)}
			<PageTitle>My Subscriptions</PageTitle>
			<Wrapper>
				{!isEmpty(purchaseData) &&
					purchaseData.map((sbsData) => {
						const schoolData = getSchoolDataBasedOnSubscription(sbsData);
						// console.group(' MY SUBSCRIPTION');
						// console.log(schoolData, sbsData, '===============');
						// console.group();
						return (
							<ExpansionPanel
								classes={{
									root: classes.expansionPanelRoot
								}}
							>
								<ExpansionPanelSummary
									classes={{
										root: classes.expansionPanelSummary,
										content: classes.expansionPanelSummaryContent
									}}
									expandIcon={<ExpandMoreIcon />}
								>
									<SchoolProfile>
										<ProgressiveImage src={src} placeholder={config.blurImage}>
											{(src) => <ImageContainer src={src} />}
										</ProgressiveImage>
										<SubHeading> {schoolData.name} </SubHeading>
									</SchoolProfile>

									<ActionButtons
										handleCall={props.handleCall}
										handleEmail={props.handleEmail}
										handleVisitSchool={props.handleVisitSchool}
									/>
								</ExpansionPanelSummary>

								<ExpansionPanelDetails classes={{ root: classes.expansionPanelDetails }}>
									<Subscriptions>
										<SubscriptionsContent active>
											<SubscriptionsTitle>Active Subscription</SubscriptionsTitle>
										</SubscriptionsContent>
										<SubscriptionsContent>
											<SubscriptionsTitle>Expired Subscriptions</SubscriptionsTitle>
										</SubscriptionsContent>
									</Subscriptions>
								</ExpansionPanelDetails>
							</ExpansionPanel>
						);
					})}
			</Wrapper>
		</Fragment>
	);
};

export default withStyles(styles)(MySubscriptionRender);
