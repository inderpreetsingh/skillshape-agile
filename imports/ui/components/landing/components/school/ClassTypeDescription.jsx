import React, {Fragment} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import StarsBar from '../StarsBar.jsx';
import * as helpers from '../jss/helpers.js';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 496px;
`;

const ReviewsWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv}px;
  font-size: ${helpers.baseFontSize}px;
`;

const Title = styled.h2`
  font-size: ${helpers.baseFontSize * 3}px;
  font-family: ${helpers.specialFont};
  margin: 0;
  font-weight: 100;
`;

const NoOfReviews = styled.p`
  font-family: ${helpers.specialFont};
  font-style: italic;
  margin: 0;
`;

const Description = styled.p`
  color: ${helpers.black};
  font-size: ${helpers.baseFontSize}px;
  font-weight: 400;
  font-family: ${helpers.specialFont};
  margin: 0;
`;

const StarsWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StarWrapper = styled.div`
  margin-right: ${helpers.rhythmDiv/2}px;
`;

const Reviews = styled.a`
  color: ${helpers.information};
  font-weight: 400;
`;

const ClassTypeDescription = (props) => {
  return (
    <Wrapper>
      <Title>{props.classTypeName} in {props.schoolName}</Title>

      <ReviewsWrapper>
        <StarsBar noOfStars={props.noOfStars} />

        <NoOfReviews>
          <Reviews href="#">({props.noOfReviews} Reviews)</Reviews>
        </NoOfReviews>
      </ReviewsWrapper>

      <Description>
        {props.description ? props.description :
        <Fragment>
          One who calls himself to be a disciple of the Guru should rise from down & meditate on the Lord's Name.
          During the early hours, he should rise and bathe, cleansing his soul in a tank of nectar, while he repeats the Name the
          Guru has spoken to him. Meditate on the Lord's Name; embrace and enshrine the comtemplative remembrance of the Naam.
        </Fragment>}
      </Description>
    </Wrapper>
  )
}

ClassTypeDescription.propTypes = {
  classTypeName: PropTypes.string,
  schoolName: PropTypes.string,
  noOfReviews: PropTypes.number,
  noOfStars: PropTypes.number
}

ClassTypeDescription.defaultProps = {
  classTypeName: 'Learn Naam Yoga',
  schoolName: 'Guru Ramdas Academy',
  noOfStars: 3.85,
  noOfReviews: 13
}

export default ClassTypeDescription;
