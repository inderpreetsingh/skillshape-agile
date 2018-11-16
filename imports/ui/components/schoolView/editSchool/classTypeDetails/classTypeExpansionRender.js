import React, { Fragment } from 'react';
import { withStyles } from 'material-ui/styles';
import styled from 'styled-components';
import { get } from 'lodash';
import Typography from 'material-ui/Typography';
import Icon from 'material-ui/Icon';
import Paper from 'material-ui/Paper';
import ProgressiveImage from 'react-progressive-image';

import ExpansionPanel, {
	ExpansionPanelDetails,
	ExpansionPanelSummary,
	ExpansionPanelActions
} from 'material-ui/ExpansionPanel';

import {
	Text,
	GridMaxWidthWrapper,
	GridContainer,
	GridItem
} from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import ClassTypeCard from '/imports/ui/components/landing/components/cards/ClassTypeCard.jsx';
import ClassTimeCard from '/imports/ui/components/landing/components/classTimes/ClassTime.jsx';
import OutLinedCard from '/imports/ui/components/landing/components/cards/OutlinedCard.jsx';

import Notification from '/imports/ui/components/landing/components/helpers/Notification.jsx';
import PrimaryButton from '/imports/ui/components/landing/components/buttons/PrimaryButton.jsx';
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton.jsx';

import { getContainerMaxWidth, withImageExists } from '/imports/util';
import {
	rhythmDiv,
	flexCenter,
	primaryColor,
	mobile, maxContainerWidth, tablet
} from '/imports/ui/components/landing/components/jss/helpers.js';
import { classTypeImgSrc } from '/imports/ui/components/landing/site-settings.js';

const SPACING = rhythmDiv * 2;
const CARD_WIDTH = 280;

const imageExistsConfig = {
	originalImagePath: 'src',
	defaultImage: classTypeImgSrc
};

const Wrapper = styled.div`
	max-width: ${maxContainerWidth}px;
`;

const CardsWrapper = styled.div``;

const Notifications = styled.div`
	display: flex;
	flex-direction: column;
`;

const TopBar = styled.div`
	display: flex;
	justify-content: space-between;

	@media screen and (max-width: ${mobile + 100}px) {
		width: 100%;
		justify-content: space-between;
		margin-bottom: ${rhythmDiv}px;
	}
`;

const ImageContainer = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-right: ${rhythmDiv * 2}px;
  margin-bottom: ${rhythmDiv}px;
  background-position: 50% 50%;
  background-image: url('${(props) => props.src}');
  background-size: cover;
  transition: background-image 0.5s linear;

  @media screen and (max-width: ${tablet}px) {
		width: 75px;
		height: 75px;
		background-size: cover;
	}
`;

const NotificationWrapper = styled.div`margin-bottom: ${rhythmDiv}px;`;

const IconWrapper = styled.div`${flexCenter}; margin-right: ${rhythmDiv}px;`;

const TextWrapper = styled.div`padding: 0`;

const ExpansionsWrapper = styled.div`padding: ${rhythmDiv * 2}px;`;

const ToggleVisibility = styled.div`
	display: ${(props) => (props.hideOnSmall ? 'flex' : 'none')};
	${props => props.noShrink && 'flex-shrink: 0'};

	@media screen and (max-width: ${props => props.screenSize || mobile + 100}px) {
		display: ${(props) => (props.hideOnSmall ? 'none' : 'flex')};
	}
`;

const TopBarButton = styled.div`
	flex-shrink: 0;
	align-self: center;
`;

const ActionButtons = styled.div`
	${flexCenter}
	flex-shrink: 0;

	@media screen and (max-width: ${mobile}px) {
		flex-wrap: wrap;
	}
`;

const ActionButton = styled.div`
	max-height: ${rhythmDiv * 5}px;
	${props => props.left && `margin-right: ${rhythmDiv}px`};
	@media screen and (max-width: ${mobile}px) {
		margin-right: 0;
		${props => props.left && `display: none`};
	}
`;

const ClassTypeProfile = styled.div`
	${flexCenter}
	@media screen and (max-width : 350px) {
	 	flex-direction: column;
		align-items: flex-start;
	}
`;

const ClassTypeNameWrapper = styled.div`
	${flexCenter}
	flex-direction: column;
	
	@media screen and (max-width: ${mobile}px) {
		align-items: flex-start;
	}
`;

const ClassTypeName = Text.extend`
	font-size: 20px;
	margin-right: ${rhythmDiv}px;
	margin-bottom: ${rhythmDiv}px;
	flex-shrink: 1;
`;

const ClassTypeImage = withImageExists((props) => {
	return (
		<ProgressiveImage src={props.bgImg} placeholder={config.blurImage}>
			{(src) => <ImageContainer src={src} />}
		</ProgressiveImage>
	);
}, imageExistsConfig);

const styles = {
	paperRoot: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		background: primaryColor,
		padding: rhythmDiv,
		[`@media screen and (max-width: ${mobile + 100}px)`]: {
			flexDirection: 'column',
			justifyContent: 'center'
		}
	},
	barIcon: {
		color: 'white'
	},
	expansionPanelRoot: {
		marginBottom: rhythmDiv,
	},
	expansionPanelSummaryContent: {
		margin: `${rhythmDiv * 2}px 0`,
		justifyContent: 'space-between',
		[`@media screen and (max-width: ${tablet}px)`]: {
			justifyContent: 'center'
		},
		[`@media screen and (max-width: ${mobile}px)`]: {
			justifyContent: 'flex-start',
			"& > :last-child": {
				paddingRight: 0
			}
		},
	},
	expansionPanelDetails: {
		display: 'flex',
		flexDirection: 'column'
	}
}


const ClassTypeExpansionRender = (props) => {
	const {
		getClassTimesData,
		onAddClassTimeClick,
		onAddClassTypeClick,
		onEditClassTypeClick,
		onEditClassTimesClick,
		onEditClassTypeImageClick,
		onNotifyClassTypeUpdate,
		onImageSave,
		classTypeData,
		classes: {
			expansionPanelDetails,
			expansionPanelSummaryContent,
			expansionPanelRoot,
			paperRoot,
			barIcon
		}
	} = props;

	return (
		<Wrapper>
			<Paper className={paperRoot} elevation={1}>
				<TopBar>
					<IconWrapper>
						<Icon className={barIcon}>{'class'}</Icon>
						<Text marginBottom="0" color="white">
							ClassType
						</Text>
					</IconWrapper>
					<ToggleVisibility hideOnSmall>
						<TextWrapper>
							<Text color="white">
								Class Types are a group of one or more Classtimes where similar or related material is
								taught to students, possibly grouped by age, skill level, or gender. If you separate
								classes by age, gender, skill level or material, separate Class Types should be created.
							</Text>
						</TextWrapper>
					</ToggleVisibility>
					<TopBarButton>
						<FormGhostButton whiteColor label={'Add ClassType'} onClick={onAddClassTypeClick} />
					</TopBarButton>
				</TopBar>
				<ToggleVisibility>
					<TextWrapper>
						<Text color="white">
							Class Types are a group of one or more Class Times where similar or related material is
							taught to students, possibly grouped by age, skill level, or gender. If you separate classes
							by age, gender, skill level or material, separate Class Types should be created.
						</Text>
					</TextWrapper>
				</ToggleVisibility>
			</Paper>
			<ExpansionsWrapper>
				{classTypeData && classTypeData.map(ctData => {
					{ console.log(ctData, get(ctData, 'medium', get(ctData, 'classTypeImg', classTypeImgSrc)), "ctData-----------------------") }
					return (< ExpansionPanel className={expansionPanelRoot} >
						<ExpansionPanelSummary
							classes={{ content: props.classes.expansionPanelSummaryContent }}
							expandIcon={<Icon>{'expand_more'}</Icon>}>
							<ClassTypeProfile>
								<ClassTypeImage src={get(ctData, 'medium', get(ctData, 'classTypeImg', null))} />
								<ClassTypeNameWrapper>
									<ClassTypeName>{ctData.name}</ClassTypeName>
									<ToggleVisibility screenSize={tablet}>
										<ActionButtons>
											<ActionButton left>
												<FormGhostButton
													icon
													iconName="edit"
													label="Edit class"
													onClick={onEditClassTypeClick(ctData)}
												/>
											</ActionButton>

											<ActionButton>
												<FormGhostButton
													icon
													iconName="add_circle_outline"
													label="Add time"
													onClick={onAddClassTimeClick(ctData)}
												/>
											</ActionButton>
										</ActionButtons>
									</ToggleVisibility>
								</ClassTypeNameWrapper>
							</ClassTypeProfile>

							<ToggleVisibility hideOnSmall noShrink screenSize={tablet}>
								<ActionButtons>
									<ActionButton left>
										<FormGhostButton
											icon
											iconName="edit"
											label="Edit class"
											onClick={onEditClassTypeClick(ctData)}
										/>
									</ActionButton>

									<ActionButton>
										<FormGhostButton
											icon
											iconName="add_circle_outline"
											label="Add time"
											onClick={onAddClassTimeClick(ctData)}
										/>
									</ActionButton>
								</ActionButtons>
							</ToggleVisibility>

						</ExpansionPanelSummary>

						<ExpansionPanelDetails className={expansionPanelDetails}>
							<CardsWrapper>
								<GridMaxWidthWrapper>
									<GridContainer>
										<GridItem spacing={SPACING} cardWidth={CARD_WIDTH}>
											<ClassTypeCard
												editMode
												{...ctData}
												onEditClassTypeImageClick={onEditClassTypeImageClick(ctData)}
												onEditClassTypeClick={onEditClassTypeClick(ctData)}
											/>
										</GridItem>
										{getClassTimesData(ctData._id).map((classTimeObj) => (
											<GridItem
												key={classTimeObj._id}
												spacing={SPACING}
												cardWidth={CARD_WIDTH}
												inPopUp={false}
											>
												<ClassTimeCard
													editMode
													{...classTimeObj}
													inPopUp={false}
													classTimeData={classTimeObj}
													onImageSave={onImageSave}
													onEditClassTimesClick={onEditClassTimesClick(ctData)}
												/>
											</GridItem>
										))}
										<GridItem spacing={SPACING} cardWidth={CARD_WIDTH}>
											<OutLinedCard
												content="Inform enrolled or interested students for changes in this class. Please do not abuse these buttons."
												button1Icon={'location_on'}
												button1Label="Notify location changes"
												onButton1Click={onNotifyClassTypeUpdate(
													ctData,
													'classType.notifyToStudentForLocation',
													'Class Location'
												)}
												button2Icon={'class'}
												button2Label="Notify time changes"
												onButton2Click={onNotifyClassTypeUpdate(
													ctData,
													'classType.notifyToStudentForClassTimes',
													'Class Times'
												)}
											/>
										</GridItem>
									</GridContainer>
								</GridMaxWidthWrapper>
							</CardsWrapper>
						</ExpansionPanelDetails>
					</ExpansionPanel>)
				})}
			</ExpansionsWrapper>
		</Wrapper>)
}

export default withStyles(styles)(ClassTypeExpansionRender);
