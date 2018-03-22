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
      <Twitter className="social-icon sc-twitter"/>
    </IconWrapper>
    <IconWrapper>
      <Facebook className="social-icon sc-facebook"/>
    </IconWrapper>
    <IconWrapper>
      <GooglePlus className="social-icon sc-google-plus"/>
    </IconWrapper>
    <IconWrapper>
      <Instagram className="social-icon sc-instagram"/>
    </IconWrapper>
    <IconWrapper>
      <Dribbble className="social-icon sc-dribbble" />
    </IconWrapper>
  </Wrapper>
);

export default SocialAccounts;
