import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ProgressiveImage from 'react-progressive-image';

import { schoolLogo } from '/imports/ui/components/landing/site-settings.js';

import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const imageExistsConfig = {
    originalImagePath: 'src',
    defaultImage: schoolLogo
};

const ImageContainer = styled.div`
  ${helpers.coverBg};
  flex-shrink: 0;
  width: ${props => props.width || 100}px;
  height: ${props => props.height || 100}px;
  margin-right: ${props => props.marginRight || helpers.rhythmDiv * 2}px;
  position: ${props => props.position || 'static'};  
  margin-bottom: ${ helpers.rhythmDiv}px;
  background-position: 50% 50%;
  background-image: url('${(props) => props.src}');
  background-size: contain;
  border-radius: ${ props => props.borderRadius || '3px'};
  transition: background-image 1s linear;
  ${props => props.noMarginRight && 'margin-right: 0'};
`;

export const SSImage = (props) => {
    return (
        <ProgressiveImage src={props.bgImg} placeholder={config.blurImage}>
            {(src) => <ImageContainer src={src} {...props.imageContainerProps}>
                {props.children}
            </ImageContainer>}
        </ProgressiveImage>
    );
}


const ProfileImage = withImageExists(SSImage, imageExistsConfig);

ProfileImage.propTypes = {
    imageContainerProps: PropTypes.object,
    src: PropTypes.string,
}

export default ProfileImage;