import React, { Fragment } from 'react';
import styled from 'styled-components';
import ProgressiveImage from 'react-progressive-image';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
import { schoolLogo } from '/imports/ui/components/landing/site-settings.js';
import { withImageExists } from '/imports/util';

const Logo = styled.div`
  transition: background-image 1s linear !important;
  width: ${helpers.rhythmDiv * 20}px;
  height: ${helpers.rhythmDiv * 20}px;
  border-radius: 5px;
  position: ${(props) => (props.position ? props.position : 'absolute')};
  left: ${(props) => (props.left ? props.left : 0)}px;
  bottom: ${(props) => (props.bottom ? props.bottom : 0)}px;
  margin-right: ${helpers.rhythmDiv * 2}px;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  background-size: ${helpers.rhythmDiv * 16}px;
  background-color: white;
  background-position: center center;
  background-repeat: no-repeat;
  background-image: url('${(props) => props.logoSrc}');

  @media screen and (max-width: 875px) {
    bottom: ${(props) => (props.publicView ? props.bottom + 112 : 0)}px;
  }
`;

const imageExistsConfig = {
	originalImagePath: 'logoSrc',
	defaultImage: schoolLogo
};

const LogoImg = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

const ClassTypeLogo = (props) => (
	<ProgressiveImage src={props.logoSrc ? props.bgImg : props.logoSrc} placeholder={config.blurImage}>
		{(src) => (
			<Logo
				bottom={props.bottom}
				left={props.left}
				publicView={props.publicView}
				position={props.position}
				logoSrc={src}
			>
				{props.children}
			</Logo>
		)}
	</ProgressiveImage>
);

export default withImageExists(ClassTypeLogo, imageExistsConfig);
