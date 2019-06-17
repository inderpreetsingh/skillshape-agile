import PropTypes from 'prop-types';
import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import { Link } from 'react-router';
import styled from 'styled-components';
import * as helpers from '../jss/helpers';
import StarsBar from '../StarsBar';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 496px;

  opacity: ${props => (props.isEdit ? 0 : 1)};

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    display: ${props => (props.isEdit ? 'none' : 'flex')};
  }
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

const Reviews = styled.a`
  color: ${helpers.information};
  font-weight: 400;
  line-height: 1;
`;

const SchoolLink = styled(Link)`
  color: ${helpers.primaryColor};
  position: relative;
  display: inline;

  &:hover {
    text-decoration: underline;
  }
`;

const ClassTypeDescription = (props) => {
  const {
    publishStatusButton: PublishStatusButton,
    isEdit,
    isClassTypeNameAvailable,
    friendlySlug,
    schoolName,
    classTypeName,
    noOfStars,
    noOfReviews,
    description,
  } = props;
  return (
    <Wrapper isEdit={isEdit}>
      {isClassTypeNameAvailable ? (
        <Title>
          <SchoolLink to={`/schools/${friendlySlug}`} target="_blank">
            {schoolName.toLowerCase()}
            {' '}
            {classTypeName && ':'}
          </SchoolLink>
          <span>
            {' '}
            {classTypeName.toLowerCase()}
          </span>
        </Title>
      ) : (
        <Title>
          {schoolName.toLowerCase()}
          {!isEdit && PublishStatusButton && <PublishStatusButton />}
        </Title>
      )}
      {noOfReviews > 0 && (
      <ReviewsWrapper>
        {noOfStars && <StarsBar noOfStars={noOfStars} />}

        <NoOfReviews>
          <Reviews href="#">
            (
            {noOfReviews}
            Reviews)
          </Reviews>
        </NoOfReviews>
      </ReviewsWrapper>
      )}


      <Description>{description && ReactHtmlParser(description)}</Description>
    </Wrapper>
  );
};

ClassTypeDescription.propTypes = {
  classTypeName: PropTypes.string.isRequired,
  schoolName: PropTypes.string.isRequired,
  description: PropTypes.string,
  noOfReviews: PropTypes.number,
  noOfStars: PropTypes.number,
  isEdit: PropTypes.bool,
  isClassTypeNameAvailable: PropTypes.string,
  friendlySlug: PropTypes.string,
};

ClassTypeDescription.defaultProps = {
  isEdit: false,
  description: '',
  noOfReviews: 0,
  noOfStars: 0,
  isClassTypeNameAvailable: '',
  friendlySlug: '',
};

export default ClassTypeDescription;
