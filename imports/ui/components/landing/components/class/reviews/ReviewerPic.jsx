import React from 'react';
import styled from 'styled-components';

import withImageExists from '/imports/util/withImageExists.js';
import { reviewerImgSrc } from '/imports/ui/components/landing/site-settings.js';

const ProfilePic = styled.div`
  width: 100%;
  height: 100%;
  background-image: url('${props => props.imgSrc}');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
`;

const imageExistsConfig = {
  originalImagePath : 'imgSrc',
  defaultImage: reviewerImgSrc
}

const MyProfilePic = (props) => <ProfilePic imgSrc={props.bgImg}/>

export default withImageExists(MyProfilePic,imageExistsConfig);
