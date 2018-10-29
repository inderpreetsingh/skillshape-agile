import React, { Fragment } from 'react';
import styled from 'styled-components';
import ProgressiveImage from 'react-progressive-image';

import { withStyles } from 'material-ui/styles';
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';

import CallUsDialogBox from '/imports/ui/components/landing/components/dialogs/CallUsDialogBox.jsx';
import EmailUsDialogBox from '/imports/ui/components/landing/components/dialogs/EmailUsDialogBox.jsx';
import MemberActionButton from '/imports/ui/components/landing/components/buttons/MemberActionButton.jsx';

import {
	Heading,
	SubHeading,
	Text,
	Italic
} from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const Wrapper = styled.div``;

const ImageContainer = styled.div`
  width: 100px;
  height: 100px;
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

const Subscriptions = styled.div`display: flex;`;

const SubscriptionsContent = styled.div`
	position: relative;

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

const SchoolName = SubHeading.extend`color: white;`;

const ActionButtons = (props) => (
	<ActionButtonsWrapper>
		<ActionButton onClick={props.handleVisitSchool(props.schoolSlug)}>
			<MemberActionButton icon iconName="school" label="Visit School" />
		</ActionButton>

		<ActionButton onClick={props.handleCall(props.memberInfo)}>
			<MemberActionButton icon iconName="phone" label="Call" />
		</ActionButton>

		<ActionButton onClick={props.handleEmail(props.memberInfo)}>
			<MemberActionButton secondary noMarginBottom label="Email" icon iconName="email" />
		</ActionButton>
	</ActionButtonsWrapper>
);

const styles = {
	expansionPanelRoot: {
		border: 'none'
	},
	expansionPanelRootExpanded: {
		border: `1px solid black`
	}
};

const MySubscriptionRender = (props) => {
	const {
		src,
		phone,
		classes,
		handleCall,
		handleEmail,
		schoolData,
		purchaseData,
		callUsDialog,
		emailUsDialog,
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
			<Wrapper>
				<Heading>My Subscriptions</Heading>
				{purchaseData.map((sbsData) => (
					<ExpansionPanel
						classes={{
							root: classes.expansionPanelRoot
						}}
					>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
							<ProgressiveImage src={src} placeholder={config.blurImage}>
								{(src) => <ImageContainer src={src} />}
							</ProgressiveImage>
							<SchoolName> {current.name.toUpperCase()} </SchoolName>
							<ActionButtons handleCall={props.handleCall} handleEmail={props.handleEmail} />
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<Subscriptions>
								<SubscriptionsContent active>
									<Text>
										<Italic>Active Subscriptions</Italic>
									</Text>
								</SubscriptionsContent>
								<SubscriptionsContent>
									<Text>
										<Italic>Expired Subscriptions</Italic>
									</Text>
								</SubscriptionsContent>
							</Subscriptions>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				))}
			</Wrapper>
		</Fragment>
	);
};

export default MySubscriptionRender;
