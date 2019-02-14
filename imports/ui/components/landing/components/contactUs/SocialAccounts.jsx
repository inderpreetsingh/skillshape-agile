import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Twitter from '/imports/ui/components/landing/components/icons/social/Twitter.jsx';
import Facebook from '/imports/ui/components/landing/components/icons/social/Facebook.jsx';
import GooglePlus from '/imports/ui/components/landing/components/icons/social/GooglePlus.jsx';
import Instagram from '/imports/ui/components/landing/components/icons/social/Instagram.jsx';
import Dribbble from '/imports/ui/components/landing/components/icons/social/Dribbble.jsx';

import * as helpers from '../jss/helpers.js';

const Wrapper = styled.div`
  ${helpers.flexCenter}
  margin: ${helpers.rhythmDiv * 2}px 0;
`;

const IconWrapper = styled.div`
  margin-right: ${helpers.rhythmDiv}px;
`;

const SocialAccounts = () => (<Wrapper>
    <IconWrapper>
      <a href="https://twitter.com/skillshape" target="_blank">
        <Twitter className="social-icon sc-twitter"/>
      </a>
    </IconWrapper>
    <IconWrapper>
      <a href="https://business.facebook.com/SkillShapeLearning" target="_blank">
        <Facebook className="social-icon sc-facebook"/>
      </a>
    </IconWrapper>
    <IconWrapper>
      <a href="https://plus.google.com/117321700113912820761" target="_blank">
        <GooglePlus className="social-icon sc-google-plus"/>
      </a>
    </IconWrapper>
    <IconWrapper>
      <a href="https://www.instagram.com/skillshape/" target="_blank">
        <Instagram className="social-icon sc-instagram"/>
      </a>
    </IconWrapper>
    {/* <IconWrapper>
      <a href="https://dribbble.com/" target="_blank">
        <Dribbble className="social-icon sc-dribbble" />
      </a>
    </IconWrapper> */}
  </Wrapper>
);

export default SocialAccounts;
