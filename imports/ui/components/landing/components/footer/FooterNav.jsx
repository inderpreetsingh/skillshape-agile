import React from 'react';
import styled from 'styled-components';

import * as helpers from '../jss/helpers.js';

import { FooterSectionHeader,FooterLink } from './FooterHelpers';


const FooterNavWrapper = styled.div`
    ${helpers.flexDirectionColumn}
`;

const FooterNav = () => (
    <FooterNavWrapper itemScope itemType="http://www.schema.org/SiteNavigationElement">
        <FooterSectionHeader>Links</FooterSectionHeader>

        <FooterLink itemProp="url" to="/about">
          <span itemProp="name">About</span>
        </FooterLink>
        <FooterLink itemProp="url" to="/faq">
          <span itemProp="name">FAQ</span>
        </FooterLink>
        <FooterLink itemProp="url" to="/contact">
          <span itemProp="name">Contact</span>
        </FooterLink>
        <FooterLink itemProp="url" to="/claim-school">
          <span itemProp="name">Claim School</span>
        </FooterLink>
    </FooterNavWrapper>
);

export default FooterNav;
