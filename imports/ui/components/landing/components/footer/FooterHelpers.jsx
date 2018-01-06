import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

//TODO: Automatic imports depending upon variables used - intellij
import * as helpers from '../jss/helpers.js';


const FooterSectionHeader = styled.h2`
    font-family: ${helpers.specialFont};
    font-size: ${helpers.baseFontSize * 1.25};
    color: ${helpers.lightTextColor};
    margin-top: 0;
    margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const FooterText = styled.p`
    font-family: ${helpers.commonFont};
    color: ${helpers.lightTextColor};
    font-size: ${helpers.baseFontSize * 0.75}px;
    margin-top: 0;
    transition: color .1s linear;
`;

const FooterLink = styled.a`
    color: ${helpers.lightTextColor};
    text-decoration: none;
    padding: ${helpers.rhythmDiv} 0;
    font-size: ${helpers.baseFontSize * 0.75}px;

    &:first-of-type {
        padding-top: 0;
    }

    &:hover {
        color: ${helpers.primaryColor};
    }
`;

const SocialIconLink = styled.a`
    font-size: ${helpers.baseFontSize * 0.75}px;
`;

export {
    FooterSectionHeader,
    FooterText,
    FooterLink,
    SocialIconLink
}
