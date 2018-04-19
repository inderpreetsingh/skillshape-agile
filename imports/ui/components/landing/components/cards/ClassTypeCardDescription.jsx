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

import * as helpers from '../jss/helpers.js';
import MuiTheme from '../jss/muitheme';

import School from "/imports/api/school/fields";

import { cutString } from '/imports/util';
import { goToSchoolPage, goToClassTypePage } from "/imports/util";

const Reviews = styled.a`
    color: ${helpers.primaryColor};
`;
const NoFoundResultWapper = styled.div`
    text-align: center;
`

const ClassDescriptionContent = styled.p`
  max-height: 100px;
  overflow-y: auto;
  color: ${helpers.black};
  font-size: ${helpers.baseFontSize}px;
`;

const Text = styled.p`
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.commontFont};
  color: ${helpers.black};
  line-height: 1.2;
  margin: 0;
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
            <div itemScope itemType="http://schema.org/AggregateRating">
                <ReactStars size={15} value={props.ratings} edit={false} itemProp="ratingCount"/>
                <Reviews href="#">
                    <Typography>
                      <span itemProp="reviewCount">{props.reviews}</span> Reviews</Typography>
                </Reviews>
            </div>

            <div className="description">
              <Grid container spacing={8}>
                 <Grid item xs={12} classes={{typeItem: props.classes.gridDescriptionWrapper}}>
                    {cardRevealInfo.ageMin && <Text>Age: {cardRevealInfo.ageMin} {cardRevealInfo.ageMax && `to ${cardRevealInfo.ageMax}`}</Text>}
                    {cardRevealInfo.gender && <Text>{cardRevealInfo.gender && (cardRevealInfo.gender === "Any") ? "All are welcome" : `${cardRevealInfo.gender}`}</Text>}
                    {cardRevealInfo.experienceLevel && <Text>Level: {cardRevealInfo.experienceLevel == "All" ? "All levels are welcomed": cardRevealInfo.experienceLevel}</Text>}
                 <Grid item xs={12}>
                    <Typography classes={{root: props.classes.descriptionHeader}}>Class Description: </Typography>
                    {cardRevealInfo.description && <ClassDescriptionContent>{cardRevealInfo.description}</ClassDescriptionContent>}
                 </Grid>
               </Grid>

               <Grid item xs={12} sm={6}>
                    <SecondaryButton
                      noMarginBottom
                      fullWidth
                      onClick={() => goToClassTypePage(cardRevealInfo.name,cardRevealInfo._id )}
                      label="Class Details"/>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <SecondaryButton
                      noMarginBottom
                      fullWidth
                      label="View School"
                      onClick={() => goToSchoolPage(cardRevealInfo.schoolId)}
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

export default withStyles(styles)(ClassTypeCardDescription);
