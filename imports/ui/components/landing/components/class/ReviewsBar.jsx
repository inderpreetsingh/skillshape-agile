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
`;

const ReviewsContainer = styled.div`
  overflow: hidden;
`;


const ReviewsBar = (props) => (
  <Wrapper>
    <ReviewsContainer>
      <Grid container spacing={24}>
        {props.reviewsData && props.reviewsData.map(review => {
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
  reviewsData: PropTypes.arrayOf(ReviewStructure)
}

export default ReviewsBar;
