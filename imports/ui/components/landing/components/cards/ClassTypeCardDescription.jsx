import React, {Fragment} from 'react';
import styled from 'styled-components';
import { browserHistory } from 'react-router';
import ReactStars from 'react-stars';
import PropTypes from 'prop-types';

import { withStyles ,MuiThemeProvider} from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid'

import PrimaryButton from '../buttons/PrimaryButton.jsx';
import SecondaryButton from '../buttons/SecondaryButton.jsx';

import School from "/imports/api/school/fields";
import { cutString, goToSchoolPage, goToClassTypePage, addDelimiter } from "/imports/util";
import { openMailToInNewTab } from '/imports/util/openInNewTabHelpers';

import * as helpers from '../jss/helpers.js';
import MuiTheme from '../jss/muitheme';

const RatingsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const Reviews = styled.a`
  color: ${helpers.primaryColor};
`;
const NoFoundResultWapper = styled.div`
  text-align: center;
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const DescriptionInnerWrapper = styled.div`
  padding: ${helpers.rhythmDiv}px;
  margin: ${helpers.rhythmDiv * 2}px 0;
  border: 1px solid #ddd;
  height: 100%;
  max-height: 250px;
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

const DescriptionContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
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

const ButtonsWrapper = styled.div`
  display: flex;

  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
  }
`;

const ButtonWrapper = styled.div`
  padding: 0 ${helpers.rhythmDiv/2}px;
  margin-bottom: ${helpers.rhythmDiv}px;
  width: 50%;

  @media screen and (max-width: ${helpers.mobile}px) {
    width: 100%;
  }
`;

const styles = {
  gridDescriptionWrapper : {
    margin: `${helpers.rhythmDiv * 2}px 0`,
    marginBottom: 4,
    border: `1px solid #ddd`
  },
  descriptionHeader : {
    marginTop: `${helpers.rhythmDiv}px`,
    fontSize: '17px',
    fontWeight: 500
  }
}


const ClassTypeCardDescription = (props) => {

  const {cardRevealInfo, schoolData} = props;
  // console.log("ClassTypeCardDescription props-->>",props);
  return(
    <MuiThemeProvider theme={MuiTheme}>
        <Fragment>
            <RatingsWrapper itemScope itemType="http://schema.org/AggregateRating">
                <ReactStars size={15} value={props.ratings} edit={false} itemProp="ratingCount"/>
                <Reviews href="#">
                    <Typography>
                      <span itemProp="reviewCount">{props.reviews}</span> Reviews</Typography>
                </Reviews>
            </RatingsWrapper>

            <Description className="description">
              {/*
                <Grid container spacing={8}>
                 <Grid item xs={12} classes={{typeItem: props.classes.gridDescriptionWrapper}}>
                    {cardRevealInfo.ageMin && <Text>Age: {cardRevealInfo.ageMin} {cardRevealInfo.ageMax && `to ${cardRevealInfo.ageMax}`}</Text>}
                    {cardRevealInfo.gender && <Text>{cardRevealInfo.gender && (cardRevealInfo.gender !== "All") && `${cardRevealInfo.gender}`}</Text>}
                    {cardRevealInfo.experienceLevel && <Text>Level: {cardRevealInfo.experienceLevel == "All" ? "All levels are welcomed": cardRevealInfo.experienceLevel}</Text>}
                 <Grid item xs={12}>
                    <Typography classes={{root: props.classes.descriptionHeader}}>Class Description: </Typography>
                    {cardRevealInfo.description && <ClassDescriptionContent>{cardRevealInfo.description}</ClassDescriptionContent>}
                 </Grid>
               </Grid> */}

               <DescriptionInnerWrapper>
                 <ClassTypeRequirements>
                   {cardRevealInfo.ageMin && <Text>Age: {cardRevealInfo.ageMin} {cardRevealInfo.ageMax && `to ${cardRevealInfo.ageMax}`}</Text>}
                   {cardRevealInfo.gender && <Text>{cardRevealInfo.gender && (cardRevealInfo.gender !== "All") && `${cardRevealInfo.gender}`}</Text>}
                   {cardRevealInfo.experienceLevel && <Text>Level: {cardRevealInfo.experienceLevel == "All" ? "All levels are welcomed": cardRevealInfo.experienceLevel}</Text>}
                 </ClassTypeRequirements>

                 <DescriptionContentWrapper>
                   <Typography classes={{root: props.classes.descriptionHeader}}>Class Description: </Typography>
                   {cardRevealInfo.description && <ClassDescriptionContent>{cardRevealInfo.description}</ClassDescriptionContent>}
                 </DescriptionContentWrapper>
               </DescriptionInnerWrapper>

               <Buttons>
                {this.props && !this.props.hideClassTypeOptions &&
                  <ButtonsWrapper>
                   <ButtonWrapper>
                     <SecondaryButton
                      noMarginBottom
                      fullWidth
                      onClick={() => goToClassTypePage(addDelimiter(cardRevealInfo.name),cardRevealInfo._id )}
                      label="Class Details"/>
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
                }
                {
                    props.classTimeCheck ?
                    <PrimaryButton
                      label="View Class Times"
                      fullWidth
                      onClick={props.onClassTimeButtonClick}
                      itemScope
                      itemType="http://schema.org/ViewAction"
                      />
                    : <PrimaryButton
                      label="Request Class Times"
                      fullWidth
                      onClick={props.onRequestClassTimeButtonClick}
                    />
                }
              </Buttons>
            </Description>
        </Fragment>
    </MuiThemeProvider>
)
};

ClassTypeCardDescription.propTypes = {
    ratings : PropTypes.number,
    reviews: PropTypes.number,
    description: PropTypes.string,
    onClassTimeButtonClick: PropTypes.func
};

export default withStyles(styles)(ClassTypeCardDescription);
