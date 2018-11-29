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
  width: ${props => props.width || 100}px;
  height: ${props => props.height || 100}px;
  flex-shrink: 0;
  ${helpers.coverBg};
  margin-right: ${helpers.rhythmDiv * 2}px;
  margin-bottom: ${helpers.rhythmDiv}px;
  background-position: 50% 50%;
  background-image: url('${(props) => props.src}');
  background-size: contain;
  transition: background-image 1s linear;
`;


const LogoImage = withImageExists((props) => {
    return (
        <ProgressiveImage src={props.bgImg} placeholder={config.blurImage}>
            {(src) => <ImageContainer src={src} {...props.imageContainerProps} />}
        </ProgressiveImage>
    );
}, imageExistsConfig);

LogoImage.defaultProps = {
    imageContainerProps: PropTypes.object,
    src: PropTypes.string,
}

export default LogoImage;