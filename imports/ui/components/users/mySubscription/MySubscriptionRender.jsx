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
import SubscriptionsList from '/imports/ui/componentHelpers/subscriptions/SubscriptionsList.jsx';

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
	margin-bottom: ${helpers.rhythmDiv * 4}px;
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
  transition: background-image 1s linear;
`;

const ActionButtonsWrapper = styled.div`
	${helpers.flexCenter} left: ${helpers.rhythmDiv * 2}px;
	bottom: ${helpers.rhythmDiv * 2}px;
	padding: ${helpers.rhythmDiv}px;
	right: auto;
	flex-wrap: wrap;
`;

const ActionButton = styled.div`margin-right: ${helpers.rhythmDiv}px;`;

const Subscriptions = styled.div`
	display: flex;
	width: 100%;

	@media screen and (max-width: ${helpers.tablet}px) {
		flex-direction: column;
	}
`;

const ListWrapper = styled.div`width: 50%;`;

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
		<ActionButton onClick={props.handleSchoolVisit(props.schoolSlug)}>
			<FormGhostButton icon iconName="school" label="Visit School" />
		</ActionButton>

		<ActionButton onClick={props.handleCall(props.data)}>
			<FormGhostButton icon iconName="phone" label="Call" />
		</ActionButton>

		<ActionButton onClick={props.handleEmail(props.data)}>
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
	const getSubsDataBasedOnSchool = (schoolId, purchaseData) => {
		return purchaseData.filter((sbsData) => sbsData.schoolId === schoolId);
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
		handleSchoolVisit
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
				{!isEmpty(schoolData) &&
					schoolData.map((school) => {
						const subsData = getSubsDataBasedOnSchool(school._id, purchaseData);
						const activeSubsData = subsData.filter(
							(subs) => subs.packageStatus !== 'expired' || subs.status !== 'expired'
						);
						const expiredSubsData = subsData.filter(
							(subs) => subs.packageStatus === 'expired' || subs.status === 'expired'
						);

						// console.group(' MY SUBSCRIPTION');
						// console.log(subsData, '===============');
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
										data={school}
										schoolSlug={school.slug}
										handleCall={props.handleCall}
										handleEmail={props.handleEmail}
										handleSchoolVisit={props.handleSchoolVisit}
									/>
								</ExpansionPanelSummary>

								<ExpansionPanelDetails classes={{ root: classes.expansionPanelDetails }}>
									<Subscriptions>
										<ListWrapper>
											<SubscriptionsList
												active
												packageProps={{
													bgColor: 'white',
													opacity: 1
												}}
												subsType="mySubscriptions"
												subsData={activeSubsData}
												title={
													isEmpty(activeSubsData) ? (
														'No Active Subscriptions'
													) : (
														'Active Subscriptions'
													)
												}
											/>
										</ListWrapper>
										<ListWrapper>
											<SubscriptionsList
												subsType="mySubscriptions"
												packageProps={{
													bgColor: helpers.primaryColor,
													opacity: 0.1
												}}
												subsData={expiredSubsData}
												title={
													isEmpty(expiredSubsData) ? (
														'No Expired Subscriptions'
													) : (
														'Expired Subscriptions'
													)
												}
											/>
										</ListWrapper>
									</Subscriptions>
								</ExpansionPanelDetails>
							</ExpansionPanel>
						);
					})}

				{!isEmpty(purchaseData) && purchaseData.map((sbsData) => {})}
			</Wrapper>
		</Fragment>
	);
};

export default withStyles(styles)(MySubscriptionRender);
