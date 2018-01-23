import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

//TODO: Automatic imports depending upon variables used - intellij
import * as helpers from './jss/helpers.js';
import * as settings from '../site-settings.js';

const BrandArea = styled.div`
  display: flex;
  align-items: ${props => props.smallBrandText ? 'center' : 'flex-start'};

  font-family: ${helpers.specialFont};

  &:hover .is-logo-area img {
    transform: rotate(360deg)
  }
`;

const BrandText = styled.h1`
  font-size: ${props => props.smallBrandText ? helpers.baseFontSize*1.5 : helpers.baseFontSize*2}px;
  margin:0;
  font-weight: 600;
  line-height:${props => props.smallBrandText ? helpers.baseFontSize * 1.25 : helpers.brandBarHeight}px;
  color: ${helpers.focalColor};

  @media screen and (min-width: 0) and (max-width : ${helpers.mobile}px) {
    text-align: left;
    font-size: ${helpers.baseFontSize * 1.5}px;
  }
`;

const BrandTagline = styled.span`
  font-weight:300;
  font-size:${props => props.smallBrandText ? (helpers.baseFontSize) : helpers.baseFontSize*1.5}px;
  line-height:${props => props.smallBrandText ? 'inherit' : helpers.brandBarHeight+'px'};
  color: ${helpers.textColor};

  @media screen and (min-width: 0) and (max-width : ${helpers.mobile}px) {
    display: block;
    line-height: 0;
    font-size: ${helpers.baseFontSize}px;
  }
`;

const LogoWrapper = styled.div`
  width: 50px;
  height: 50px;
`;

const LogoImage = styled.img`
  width: 100%;
  height: ${helpers.brandBarHeight};
  margin-right: ${helpers.oneRow/2}px;
  transition: transform 1s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: rotate(360deg);
  }

  @media screen and (min-width: 0) and (max-width : ${helpers.mobile}px) {
    margin-right: 5px;
    height: ${helpers.brandBarHeightMobile}px;
    font-size: ${helpers.baseFontSize}px;
  }
`;

const Logo = ({smallBrandText, brandText, brandTagline, logoSrc}) => (
    <BrandArea itemScope itemType="http://schema.org/Brand" smallBrandText={smallBrandText}>
        <LogoWrapper>
          <LogoImage src={logoSrc} itemProp="logo"/>
        </LogoWrapper>
        <BrandText itemProp="name" smallBrandText={smallBrandText} className={smallBrandText && 'flex-column'}>
          {brandText},
          <BrandTagline smallBrandText={smallBrandText}> {brandTagline}. </BrandTagline>
        </BrandText>
    </BrandArea>
);
Logo.propTypes = {
  brandText: PropTypes.string,
  brandTagline: PropTypes.string,
  logoSrc: PropTypes.string,
  smallBrandText: PropTypes.bool
}

Logo.defaultProps = {
  smallBrandText: false,
  brandText: settings.brandText,
  brandTagline: settings.brandTagline,
  logoSrc: settings.logoSrc
}


export default Logo;
