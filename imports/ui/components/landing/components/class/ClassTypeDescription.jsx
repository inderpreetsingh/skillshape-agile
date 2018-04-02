import React, {Fragment} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

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
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  font-size: ${helpers.baseFontSize}px;
`;

const Title = styled.h2`
  font-size: ${helpers.baseFontSize * 3}px;
  font-family: ${helpers.specialFont};
  line-height: 1;
  margin: 0;
  font-weight: 100;
  text-transform: capitalize;
`;

const NoOfReviews = styled.p`
  font-family: ${helpers.specialFont};
  font-style: italic;
  line-height: 1;
  margin: 0;
`;

const Description = styled.p`
  color: ${helpers.black};
  font-size: ${helpers.baseFontSize}px;
  font-weight: 400;
  font-family: ${helpers.specialFont};
  line-height: 1;
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
  line-height: 1;
`;

const ClassTypeDescription = (props) => {
  return (
    <Wrapper>
      {props.isClassTypeNameAvailable ?
      <Title>{props.classTypeName.toLowerCase()} {props.schoolName && props.classTypeName ? <span>in</span> : ''} {props.schoolName.toLowerCase()}</Title>
      :
      <Title>{props.schoolName.toLowerCase()}</Title>}

      <ReviewsWrapper>
        {props.noOfStars && <StarsBar noOfStars={props.noOfStars} />}

        <NoOfReviews>
          {props.noOfReviews && <Reviews href="#">({props.noOfReviews} Reviews)</Reviews>}
        </NoOfReviews>
      </ReviewsWrapper>

      <Description>
        {props.description && ReactHtmlParser(props.description)}
      </Description>
    </Wrapper>
  )
}

ClassTypeDescription.propTypes = {
  classTypeName: PropTypes.string.isRequired,
  schoolName: PropTypes.string.isRequired,
  description: PropTypes.string,
  noOfReviews: PropTypes.number,
  noOfStars: PropTypes.number
}

export default ClassTypeDescription;
