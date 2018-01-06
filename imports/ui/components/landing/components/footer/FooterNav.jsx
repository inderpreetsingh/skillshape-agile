import React from 'react';
import styled from 'styled-components';

import * as helpers from '../jss/helpers.js';

import { FooterSectionHeader,FooterLink } from './FooterHelpers';


const FooterNavWrapper = styled.div`
    ${helpers.flexDirectionColumn}
`;

const FooterNav = () => (
    <FooterNavWrapper>
        <FooterSectionHeader>Links</FooterSectionHeader>
                    
        <FooterLink to="/about">About</FooterLink>
        <FooterLink to="/faq">FAQ</FooterLink>
        <FooterLink to="/contact">Contact</FooterLink>
        <FooterLink to="/claim-school">Claim School</FooterLink>
    </FooterNavWrapper>
);

export default FooterNav;

