import React from 'react';
import { SocialIcon } from 'react-social-icons';
import styled from 'styled-components';
import * as helpers from '../jss/helpers';
import { FooterSectionHeader } from './FooterHelpers';

// These are inline styles
const socialIconStyles = {
  width: 35,
  height: 35,
  marginRight: 10,
};

const ConnectWithUsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const SocialIconsWrapper = styled.div`
  display: flex;
`;

const ConnectWithUs = () => (
  <ConnectWithUsWrapper>
    <FooterSectionHeader itemScope itemType="http://schema.org/Thing">
      <span itemProp="description">Connect with Us</span>
    </FooterSectionHeader>
    <SocialIconsWrapper>
      <div className="social-container">
        <SocialIcon
          url="https://business.facebook.com/SkillShapeLearning"
          network="facebook"
          style={socialIconStyles}
          color={helpers.lightTextColor}
        />
      </div>
      <div className="social-container">
        <SocialIcon
          url="https://plus.google.com/117321700113912820761"
          network="google"
          style={socialIconStyles}
          color={helpers.lightTextColor}
        />
      </div>
      <div className="social-container">
        <SocialIcon
          url="https://twitter.com/skillshape"
          network="twitter"
          style={socialIconStyles}
          color={helpers.lightTextColor}
        />
      </div>
      <div className="social-container">
        <SocialIcon
          url="https://www.instagram.com/skillshape/"
          network="instagram"
          style={socialIconStyles}
          color={helpers.lightTextColor}
        />
      </div>
    </SocialIconsWrapper>
  </ConnectWithUsWrapper>
);

export default ConnectWithUs;
