import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ReactStars from 'react-stars';

import StarsBar from '/imports/ui/components/landing/components/StarsBar.jsx';

import { reviewImgSrc } from '/imports/ui/components/landing/site-settings.js';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

console.log(reviewImgSrc,'review img srouc');

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  flex-direction: column;
`;

const Container = styled.div`
  ${helpers.flexDirectionColumn}
  align-items: flex-end;
`;

const Person = styled.div`
  ${helpers.flexCenter};
  align-items: flex-end;
  margin-top: ${helpers.rhythmDiv/2}px;
`;

const ProfilePicContainer = styled.div`
  width: 40px;
  height: 40px;
`;

const ProfilePic = styled.div`
  width: 100%;
  height: 100%;
  background-image: url('${props => props.imgSrc}');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
`;

const Name = styled.p`
  font-family: ${helpers.specialFont};
  color: ${helpers.headingColor};
  margin: 0;
  padding-right: ${helpers.rhythmDiv/2}px;
  font-weight: 500;
  color: ${helpers.black};
  text-transform: capitalize;
`;

const CommentWrapper = styled.div`
  width: 100%;
  padding: ${helpers.rhythmDiv * 2}px;
  position: relative;
  min-height: ${helpers.rhythmDiv * 8}px;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: ${helpers.caution};
    opacity: 0.1;
    border-radius: 8px;
  }
`;

const Comment = styled.p`
  font-style: italic;
  font-family: ${helpers.specialFont};
  margin: 0;
  padding-right: ${helpers.rhythmDiv/2}px;
  font-weight: 500;
  font-size: ${helpers.baseFontSize}px;
  color: ${helpers.black};
`;

const Review = (props) => (
    <Wrapper>
      <CommentWrapper>
        <Comment>{props.comment}</Comment>
      </CommentWrapper>

      <Person>
        <Container>
          <StarsBar noOfStars={props.ratings} />
          <Name>{props.name}</Name>
        </Container>

        <ProfilePicContainer>
          <ProfilePic imgSrc={props.imgSrc} />
        </ProfilePicContainer>
      </Person>

    </Wrapper>
);

Review.propTypes = {
  imgSrc: PropTypes.string,
  name: PropTypes.string,
  comment: PropTypes.string,
  ratings: PropTypes.number
};

Review.defaultProps = {
  imgSrc: reviewImgSrc
}

export default Review;
