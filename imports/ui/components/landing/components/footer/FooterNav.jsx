import React from 'react';
import styled from 'styled-components';
import { browserHistory } from 'react-router';

import * as helpers from '../jss/helpers.js';

import { FooterSectionHeader,FooterLink } from './FooterHelpers';


const FooterNavWrapper = styled.div`
    ${helpers.flexDirectionColumn}
`;

const FooterNav = () => (
    <FooterNavWrapper itemScope itemType="http://www.schema.org/SiteNavigationElement">
        <FooterSectionHeader>Links</FooterSectionHeader>
        <FooterLink itemProp="url" onClick={() => browserHistory.push('/Aboutus') }>
          <span itemProp="name">About</span>
        </FooterLink>
        <FooterLink itemProp="url" onClick={() => browserHistory.push('/faq') }>
          <span itemProp="name">FAQ</span>
        </FooterLink>
        <FooterLink itemProp="url" onClick={() => browserHistory.push('/ContactUs') }>
          <span itemProp="name">Contact</span>
        </FooterLink>
        <FooterLink itemProp="url" onClick={() => browserHistory.push('/claimSchool') }>
          <span itemProp="name">Claim School</span>
        </FooterLink>
    </FooterNavWrapper>
);

export default FooterNav;
