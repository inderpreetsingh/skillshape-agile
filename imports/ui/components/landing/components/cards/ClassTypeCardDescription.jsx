import React, {Fragment} from 'react';
import styled from 'styled-components';
import ReactStars from 'react-stars';
import PropTypes from 'prop-types';
import { MuiThemeProvider} from 'material-ui/styles';
import Typography from 'material-ui/Typography';

import PrimaryButton from '../buttons/PrimaryButton.jsx';
import SecondaryButton from '../buttons/SecondaryButton.jsx';

import * as helpers from '../jss/helpers.js';
import MuiTheme from '../jss/muitheme';

import Grid from 'material-ui/Grid'

const Reviews = styled.a`
    color: ${helpers.primaryColor};
`;
const NoFoundResultWapper = styled.div`
    text-align: center;
`

const ClassTypeCardDescription = (props) => {

  const {cardRevealInfo} = props;
  // console.log("props in ClassTypeCardDescription",cardRevealInfo);
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
                  {cardRevealInfo.description && <Typography>{cardRevealInfo.description}</Typography>}
               </Grid>
               </Grid>
               <Grid item xs={12} sm={6}>
                    <SecondaryButton
                      fullWidth
                      label="View Details"/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <SecondaryButton
                      fullWidth
                      label="View School" />
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
