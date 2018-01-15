import React from 'react';
import styled from 'styled-components';
import ReactStars from 'react-stars';
import PropTypes from 'prop-types';

import {MuiThemeProvider} from 'material-ui/styles';
import Typography from 'material-ui/Typography';

import { reviewImgSrc } from '../../site-settings.js';
import * as helpers from '../jss/helpers.js';

console.log(reviewImgSrc,'review img srouc');

const Wrapper = styled.div`
    display: flex;
`;

const Person = styled.div`
  ${helpers.flexDirectionColumn}
  align-items: center;
`;

const ProfilePicCont = styled.div`
  width: 50px;
  height: 50px;
`;

const ProfilePic = styled.img`
  width: 100%;
  height: 100%;
`;

const Name = styled.p`
  font-family: ${helpers.commonFont};
  color: ${helpers.headingColor};
`;

const Comment = styled.div`
  margin-left: ${helpers.rhythmDiv*2}px;
  ${helpers.flexDirectionColumn}
`;

const Review = (props) => (
    <Wrapper>

      <Person>
        <ProfilePicCont>
          <ProfilePic src={props.imgSrc} />
        </ProfilePicCont>

        <Name>{props.name}</Name>
      </Person>

      <Comment>
        <Typography>{props.comment}</Typography>
        <div>
            <ReactStars size={25} value={props.ratings} edit={false} half={true}/>
        </div>
      </Comment>

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
