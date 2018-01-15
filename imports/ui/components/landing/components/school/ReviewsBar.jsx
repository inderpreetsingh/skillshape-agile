import React from 'react';
import styled from 'styled-components';
import ReactStars from 'react-stars';
import PropTypes from 'prop-types';

import { MuiThemeProvider} from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import Review from './Review';

import ReviewStructure from '../../constants/structure/review.js';

import * as helpers from '../jss/helpers.js';

const Wrapper = styled.div`
  ${helpers.flexDirectionColumn}
  padding: ${helpers.rhythmDiv}px;
`;

const ReviewsStats = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${helpers.rhythmDiv}px;

  @media screen and (max-width: ${helpers.tablet}px) {
    ${helpers.flexDirectionColumn}
    align-items: center;
  }
`;

const ReviewsStatsText = styled.h3`
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize * 1.25}px;
  font-weight: 400;
  margin: 0;
`;

const Total = styled.p`
  color: ${helpers.headingColor};
`;

const ReviewsContainer = styled.div`
  overflow: hidden;
`;

const Average = styled.div`
  ${helpers.flexCenter}
  margin-left: ${helpers.rhythmDiv}px;
`;

const ReviewsBar = (props) => (
  <Wrapper>
    <ReviewsStats>
      <ReviewsStatsText>Reviews: {props.totalReviews} total,</ReviewsStatsText>
      <Average>
         <ReviewsStatsText>Average</ReviewsStatsText>
         <ReactStars size={25} value={props.averageRatings} edit={false} half={true}/>
      </Average>
    </ReviewsStats>

    <ReviewsContainer>
      <Grid container spacing={24}>
        {props.reviewsData.map(review => {
          return (
            <Grid item key={review._id} md={4} sm={12} lg={4} xs={12}>
              <Review {...review} />
            </Grid>
          );
        })}
      </Grid>
    </ReviewsContainer>

  </Wrapper>
);

ReviewsBar.propTypes = {
  averageRatings: PropTypes.number,
  totalReviews: PropTypes.number,
  reviewsData: PropTypes.arrayOf(ReviewStructure)
}

export default ReviewsBar;
