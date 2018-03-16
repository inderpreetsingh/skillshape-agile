import React, {Fragment} from 'react';
import styled from 'styled-components';
import { browserHistory } from 'react-router';
import ReactStars from 'react-stars';
import PropTypes from 'prop-types';
import { MuiThemeProvider} from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid'

import PrimaryButton from '../buttons/PrimaryButton.jsx';
import SecondaryButton from '../buttons/SecondaryButton.jsx';

import * as helpers from '../jss/helpers.js';
import MuiTheme from '../jss/muitheme';

import { cutString } from '/imports/util';

const Reviews = styled.a`
    color: ${helpers.primaryColor};
`;
const NoFoundResultWapper = styled.div`
    text-align: center;
`
function goToSchoolPage(school) {
  console.log("goToSchoolPage --->>",school)
  if(school && school.slug) {
    browserHistory.push(`/schools/${school.slug}`)
  }
  return
}

const ClassTypeCardDescription = (props) => {

  const {cardRevealInfo, schoolData} = props;
  // console.log("ClassTypeCardDescription props-->>",props);
  return(
    <MuiThemeProvider theme={MuiTheme}>
        <Fragment>
            <div itemScope itemType="http://schema.org/AggregateRating">
                <ReactStars size={15} value={props.ratings} edit={false} itemProp="ratingCount"/>
                <Reviews href="#">
                    <Typography> <span itemProp="reviewCount">{props.reviews}</span> Reviews</Typography>
                </Reviews>
            </div>

            <div className="description">
             <Grid container spacing={8}>
               <Grid item xs={12} style={{marginTop: '22px',marginBottom: '22px',border: '1px solid #ddd'}}>
                  {cardRevealInfo.ageMin && <Typography>Age: {cardRevealInfo.ageMin} {cardRevealInfo.ageMax && `to ${cardRevealInfo.ageMax}`}</Typography>}
                  {cardRevealInfo.gender && <Typography>{cardRevealInfo.gender && (cardRevealInfo.gender === "Any") ? "All are welcome" : `${cardRevealInfo.gender} only`}</Typography>}
                  {cardRevealInfo.experienceLevel && <Typography>Level: {cardRevealInfo.experienceLevel == "All" ? "All levels are welcomed": cardRevealInfo.experienceLevel}</Typography>}
               <Grid item xs={12}>
                  <Typography style={{marginTop: '15px',fontSize: '17px',fontWeight: 500}}>Class Description: </Typography>
                  {cardRevealInfo.description && <Typography>{cutString(cardRevealInfo.description, 250)}</Typography>}
               </Grid>
               </Grid>
               <Grid item xs={12} sm={6}>
                    <SecondaryButton
                      fullWidth
                      onClick={() => browserHistory.push(`/classType/${cardRevealInfo._id}`)}
                      label="View Details"/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <SecondaryButton
                      fullWidth
                      label="View School"
                      onClick={() => goToSchoolPage(schoolData)}
                    />
                </Grid>
                <Grid item xs={12}>
                    {
                        props.classTimeCheck ?
                        <PrimaryButton
                          label="View Class Times"
                          fullWidth
                          onClick={props.onClassTimeButtonClick}
                          itemScope
                          itemType="http://schema.org/ViewAction"
                          />
                        : <NoFoundResultWapper>No Class Time Found</NoFoundResultWapper>
                    }
                </Grid>
              </Grid>
            </div>
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

export default ClassTypeCardDescription;
