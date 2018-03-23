import React from 'react';
import styled from 'styled-components';
import { SocialIcon } from 'react-social-icons';


import * as helpers from '../jss/helpers.js';

import { FooterSectionHeader, FooterText, SocialIconLink } from './FooterHelpers';


// These are inline styles
const socialIconStyles = {
    width : 35,
    height: 35,
    marginRight: 10,
}

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
        <SocialIconsWrapper >
            <SocialIconLink itemProp="url" to="https://www.facebook.com">
                <div className="social-container">
                    <SocialIcon network="facebook" style={socialIconStyles} color={helpers.lightTextColor}/>
                </div>
            </SocialIconLink>
            <SocialIconLink itemProp="url" to="https://plus.google.com">
                <div className="social-container">
                    <SocialIcon network="google" style={socialIconStyles} color={helpers.lightTextColor}/>
                </div>
            </SocialIconLink>
            <SocialIconLink itemProp="url" to="https://www.twitter.com">
                <div className="social-container">
                    <SocialIcon network="twitter" style={socialIconStyles} color={helpers.lightTextColor}/>
                </div>
            </SocialIconLink>
            <SocialIconLink itemProp="url" to="https://www.instagram.com">
                <div className="social-container">
                    <SocialIcon network="instagram" style={socialIconStyles} color={helpers.lightTextColor}/>
                </div>
            </SocialIconLink>
        </SocialIconsWrapper>
    </ConnectWithUsWrapper>
);

export default ConnectWithUs;
