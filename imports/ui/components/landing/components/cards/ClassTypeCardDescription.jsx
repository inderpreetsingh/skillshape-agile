import isEmpty from 'lodash/isEmpty';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactStars from 'react-stars';
import styled from 'styled-components';
import PrimaryButton from '/imports/ui/components/landing/components/buttons/PrimaryButton.jsx';
import SecondaryButton from '/imports/ui/components/landing/components/buttons/SecondaryButton.jsx';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
import MuiTheme from '/imports/ui/components/landing/components/jss/muitheme';
import { addDelimiter, goToClassTypePage, goToSchoolPage } from '/imports/util';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';




const RatingsWrapper = styled.div`
	display: flex;
	flex-direction: column;
	flex-shrink: 0;
`;

const Reviews = styled.a`color: ${helpers.primaryColor};`;
const NoFoundResultWapper = styled.div`text-align: center;`;

const ClassDescription = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
`;

const ClassDescriptionInnerWrapper = styled.div`
  padding: ${helpers.rhythmDiv}px;
  margin: ${helpers.rhythmDiv * 2}px 0;
  border: 1px solid #ddd;
  height: 100%;
  max-height: ${(props) => (props.editMode ? '100%' : '200px')};
  display: flex;
  flex-direction: column;
  //
  // @media screen and (max-width: ${helpers.mobile + 100}px) {
  //   max-height: 250px;
  // }
`;

const ClassTypeRequirements = styled.div`
	display: flex;
	flex-direction: column;
	flex-shrink: 0;
`;

const ClassDescriptionContentWrapper = styled.div`
	display: flex;
	flex-direction: column;
	max-height: 100%;
	overflow-y: auto;
`;

const ClassDescriptionContent = styled.p`
	overflow-y: auto;
	color: ${helpers.black};
	font-size: ${helpers.baseFontSize}px;
	display: flex;
	flex-shrink: 1;
`;

const Text = styled.p`
	font-size: ${helpers.baseFontSize}px;
	font-family: ${helpers.commontFont};
	color: ${helpers.black};
	line-height: 1.2;
	margin: 0;
`;

const Buttons = styled.div`
	display: flex;
	flex-direction: column;
	flex-shrink: 0;
`;

const SelectedSkillSubject = styled.div``;

const ButtonsWrapper = styled.div`
	display: flex;

	@media screen and (max-width: ${helpers.mobile}px) {
		flex-direction: column;
	}
`;

const ButtonWrapper = styled.div`
	padding: 0 ${helpers.rhythmDiv / 2}px;
	margin-bottom: ${helpers.rhythmDiv}px;
	width: 50%;

	@media screen and (max-width: ${helpers.mobile}px) {
		width: 100%;
	}
`;

const styles = {
	gridDescriptionWrapper: {
		margin: `${helpers.rhythmDiv * 2}px 0`,
		marginBottom: 4,
		border: `1px solid #ddd`
	},
	descriptionHeader: {
		marginTop: `${helpers.rhythmDiv}px`,
		fontSize: '17px',
		fontWeight: 500
	}
};

const ClassTypeCardDescription = (props) => {
	const { cardRevealInfo, schoolData, editMode, selectedSkillSubject, onEditClassTypeClick } = props;
	let BB = {backgroundColor:'black'};
	return (
		<MuiThemeProvider theme={MuiTheme}>
			<Fragment>
				<RatingsWrapper itemScope itemType="http://schema.org/AggregateRating">
					{!props.hideClassTypeOptions &&
					!props.editMode && (
						<Fragment>
							<ReactStars size={15} value={props.ratings} edit={false} itemProp="ratingCount" />
							<Reviews href="#">
								<Typography>
									<span itemProp="reviewCount">{props.reviews}</span> Reviews
								</Typography>
							</Reviews>
						</Fragment>
					)}
				</RatingsWrapper>

				<ClassDescription className="description">
					{/*
                <Grid container spacing={8}>
                 <Grid item xs={12} classes={{typeItem: props.classes.gridDescriptionWrapper}}>
                    {cardRevealInfo.ageMin && <Text>Age: {cardRevealInfo.ageMin} {cardRevealInfo.ageMax && `to ${cardRevealInfo.ageMax}`}</Text>}
                    {cardRevealInfo.gender && <Text>{cardRevealInfo.gender && (cardRevealInfo.gender !== "All") && `${cardRevealInfo.gender}`}</Text>}
                    {cardRevealInfo.experienceLevel && <Text>Level: {cardRevealInfo.experienceLevel == "All" ? "All levels are welcomed": cardRevealInfo.experienceLevel}</Text>}
                 <Grid item xs={12}>
                    <Typography classes={{root: props.classes.descriptionHeader}}>Class Description: </Typography>
                    {cardRevealInfo.description && <DescriptionContent>{cardRevealInfo.description}</DescriptionContent>}
                 </Grid>
               </Grid> */}

					<ClassDescriptionInnerWrapper editMode={editMode}>
						<ClassTypeRequirements>
							{cardRevealInfo.ageMin && (
								<Text>
									Age: {cardRevealInfo.ageMin}{' '}
									{cardRevealInfo.ageMax && `to ${cardRevealInfo.ageMax}`}
									<Divider style={BB}/>
								</Text>
								
							)}
							
							{cardRevealInfo.gender && (
								<Text>
									{cardRevealInfo.gender &&
										cardRevealInfo.gender !== 'All' &&
										`${cardRevealInfo.gender}`}
								</Text>
							)}
							
							{cardRevealInfo.experienceLevel && (
								<Text>
									Level:{' '}
									{cardRevealInfo.experienceLevel == 'All' ? (
										'All levels are welcomed'
									) : (
										cardRevealInfo.experienceLevel
									)}
									<Divider style={BB}/>
								</Text>
							)}
							
							{editMode &&
							!isEmpty(selectedSkillSubject) && (
								<Text>
									Subjects: {' '}
									{selectedSkillSubject.map((selectedSubj) => selectedSubj.name).join(', ')}
									<Divider style={BB}/>
								</Text>
							)}
						</ClassTypeRequirements>
						
						<ClassDescriptionContentWrapper>
							<Typography classes={{ root: props.classes.descriptionHeader }}>
								Class Description:{' '}
							</Typography>
							{cardRevealInfo.description && (
								<ClassDescriptionContent>{cardRevealInfo.description}</ClassDescriptionContent>
							)}
						</ClassDescriptionContentWrapper>
					</ClassDescriptionInnerWrapper>

					{/*editMode && isEmpty(selectedSkillSubject) && <SelectedSkillSubject>
            <Typography classes={{ root: props.classes.descriptionHeader }}>
                Selected Skills:{" "}
              </Typography>  
          </SelectedSkillSubject>*/}

					{!editMode ? (
						<Buttons>
							{props &&
							!props.hideClassTypeOptions && (
								<ButtonsWrapper>
									<ButtonWrapper>
										<SecondaryButton
											noMarginBottom
											fullWidth
											onClick={() =>
												goToClassTypePage(
													addDelimiter(cardRevealInfo.name),
													cardRevealInfo._id
												)}
											label="Class Details"
										/>
									</ButtonWrapper>

									<ButtonWrapper>
										<SecondaryButton
											noMarginBottom
											fullWidth
											label="View School"
											onClick={() => goToSchoolPage(cardRevealInfo.schoolId)}
										/>
									</ButtonWrapper>
								</ButtonsWrapper>
							)}

							{props.classTimeCheck ? (
								<div 	style={{ bottom: "0px", position: "absolute", width: "93%"}}>
								<PrimaryButton
									label="View Class Times"
									fullWidth
									onClick={props.onClassTimeButtonClick}
									itemScope
									itemType="http://schema.org/ViewAction"
								
								/>
								</div>
							) : (
								<PrimaryButton
									label="Request Class Times"
									fullWidth
									onClick={props.onRequestClassTimeButtonClick}
								/>
							)}
						</Buttons>
					) : (
							<PrimaryButton
								icon
								iconName="edit"
								fullWidth
								label="Edit Details"
								onClick={onEditClassTypeClick}
							/>
					)}
				</ClassDescription>
			</Fragment>
		</MuiThemeProvider>
	);
};

ClassTypeCardDescription.propTypes = {
	ratings: PropTypes.number,
	reviews: PropTypes.number,
	description: PropTypes.string,
	editMode: PropTypes.bool,
	onClassTimeButtonClick: PropTypes.func
};

ClassTypeCardDescription.defaultProps = {
	editMode: false
};

export default withStyles(styles)(ClassTypeCardDescription);
