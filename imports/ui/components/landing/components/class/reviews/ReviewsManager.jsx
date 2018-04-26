import React, {Fragment,Component} from 'react';
import styled from 'styled-components';
import ReviewsBar from './ReviewsBar.jsx';
import ReviewsSlider from './ReviewsSlider.jsx';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const SliderWrapper = styled.div`
  ${helpers.flexCenter}
`;

class ReviewsManager extends Component {
  state = {
    screenSize: '',
    minNoOfReviews: {
      mobile: 2,
      tablet: 3,
      desktop: 4
    }
  }

  handleScreenResize = () => {
    if(window.innerWidth < (helpers.mobile + 120)) {
      this.handleSetScreenSize('mobile')
    }else if(window.innerWidth < helpers.tablet + 20) {
      this.handleSetScreenSize('tablet');
    }else {
      this.handleSetScreenSize('desktop');
    }
  }

  handleSetScreenSize = (screenSize) => {
    if(this.state.screenSize !== screenSize)
      this.setState({ screenSize: screenSize});
  }

  componentWillMount = () => {
    window.addEventListener('resize',this.handleScreenResize);
  }

  componentDidMount = () => {
    this.handleScreenResize();
  }

  componentWillUnMount = () => {
    window.removeEventListener('resize',this.handleScreenResize);
  }

  render() {
    const minNoOfReviewsRequired = this.state.minNoOfReviews[this.state.screenSize];
    return(<Fragment>
        {(this.props.reviewsData.length >= minNoOfReviewsRequired) ?
          <ReviewsSlider data={this.props.reviewsData} paddingLeft={helpers.rhythmDiv} padding={helpers.rhythmDiv * 2} />
          :
          <ReviewsBar reviewsData={this.props.reviewsData} />
        }
      </Fragment>
    )
  }
}

export default ReviewsManager;
