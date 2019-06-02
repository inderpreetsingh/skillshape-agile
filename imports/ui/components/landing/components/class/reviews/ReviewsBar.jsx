import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import Review from './Review';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import ReviewStructure from '/imports/ui/components/landing/constants/structure/review';

const Wrapper = styled.div`
  ${helpers.flexDirectionColumn}
`;

const ReviewsContainer = styled.div`
  overflow: hidden;
`;

const ReviewsGrid = styled.div`
  ${helpers.flexCenter}
  padding: ${helpers.rhythmDiv * 2}px;
`;

const ReviewWrapper = styled.div`
  max-width: 400px;
  width: 100%;
  padding-right: ${helpers.rhythmDiv * 2}px;

  @media screen (and max-width: ${helpers.tablet}px) {
    max-width: 50%;
  }

  @media screen (and max-width: ${helpers.mobile}px) {
    max-width: 100%;
  }
`;

/*
const ReviewsBar = (props) => (
  <Wrapper>
    <ReviewsContainer>
      <Grid container spacing={24}>
        {props.reviewsData && props.reviewsData.map(data => {
          return (
            <Grid item key={data._id} md={4} sm={6} lg={4} xs={12}>
              <Review {...data} />
            </Grid>
          );
        })}
      </Grid>
    </ReviewsContainer>

  </Wrapper>
);
*/

const ReviewsBar = props => (
  <Wrapper>
    <ReviewsContainer>
      <ReviewsGrid>
        {props.reviewsData
          && props.reviewsData.map(data => (
            <ReviewWrapper key={data._id}>
              <Review {...data} />
            </ReviewWrapper>
          ))}
      </ReviewsGrid>
    </ReviewsContainer>
  </Wrapper>
);

ReviewsBar.propTypes = {
  reviewsData: PropTypes.arrayOf(ReviewStructure),
};

export default ReviewsBar;
