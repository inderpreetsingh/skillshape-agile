import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Twitter from '../icons/social/Twitter.jsx';
import Facebook from '../icons/social/Facebook.jsx';
import GooglePlus from '../icons/social/GooglePlus.jsx';
import Instagram from '../icons/social/Instagram.jsx';
import Dribbble from '../icons/social/Dribbble.jsx';

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
      <a href="https://www.twitter.com/" target="_blank">
        <Twitter className="social-icon sc-twitter"/>
      </a>
    </IconWrapper>
    <IconWrapper>
      <a href="https://www.facebook.com/" target="_blank">
        <Facebook className="social-icon sc-facebook"/>
      </a>
    </IconWrapper>
    <IconWrapper>
      <a href="https://plus.google.com/" target="_blank">
        <GooglePlus className="social-icon sc-google-plus"/>
      </a>
    </IconWrapper>
    <IconWrapper>
      <a href="https://www.instagram.com/?hl=en" target="_blank">
        <Instagram className="social-icon sc-instagram"/>
      </a>
    </IconWrapper>
    <IconWrapper>
      <a href="https://dribbble.com/" target="_blank">
        <Dribbble className="social-icon sc-dribbble" />
      </a>
    </IconWrapper>
  </Wrapper>
);

export default SocialAccounts;
