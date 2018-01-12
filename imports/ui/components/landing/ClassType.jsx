import React,{ Component } from 'react';

import ReviewsBar from './components/school/ReviewsBar';
import SchoolDetails from './components/school/SchoolDetails';

import reviewsData from './constants/reviewsData.js';

class ClassType extends Component {
  render() {
    return (
      <ReviewsBar totalReviews={reviewsData.length} averageRatings={4.5}  reviewsData={reviewsData} />
    );
  }
}

export default ClassType;
