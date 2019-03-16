import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import IconButton from "material-ui/IconButton";
import EditIcon from 'material-ui-icons/Edit';
import ProgressiveImage from 'react-progressive-image';

import { withImageExists } from '/imports/util';
import { schoolLogo } from '/imports/ui/components/landing/site-settings.js';

import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

let positionLeft = 0;
let positionTop = 0;

const imageExistsConfig = {
    originalImagePath: 'src',
    defaultImage: schoolLogo
};

const ImageContainer = styled.div`
  ${helpers.coverBg};
  flex-shrink: 0;
  background-color: rgba(0, 0, 0, 0.12);
  position: ${props => props.position || 'static'};  
  width: ${props => props.width || 100}px;
  height: ${props => props.height || 96}px;
  margin-right: ${props => props.marginRight || helpers.rhythmDiv * 2}px;
  margin-bottom: ${ helpers.rhythmDiv}px;
  background-position: ${props => props.bgPosition || '50% 50%'};
  background-image: url('${props => props.src}');
  background-size: ${props => props.bgSize || 'contain'};
  border-radius: ${props => props.borderRadius || '3px'};
  transition: background-image 1s linear;
  ${props => props.noMarginRight && 'margin-right: 0'};
  ${props => props.noMarginBottom && 'margin-bottom: 0'};
`;

const styles = {
    imgIconRoot: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        color: 'white',
        borderRadius: '50%',
        position: "absolute",
        zIndex: 5,
        textAlign: "center",
        top: 8,
        right: 8,
        width: helpers.rhythmDiv * 3,
        height: helpers.rhythmDiv * 3
    },
    imgIconLabel: {
        fontSize: helpers.baseFontSize
    },
}

const SSIconButton = withStyles(styles)(props => {
    return (
        <IconButton
            classes={{ root: props.classes.imgIconRoot, label: props.classes.imgIconLabel }}
            onClick={props.onEditImg}
        >
            <EditIcon />
        </IconButton>
    )
});


export const SSAvatar = (props) => {
    return (
        <ProgressiveImage src={props.bgImg} placeholder={config.blurImage}>
            {(src) => <ImageContainer src={src} {...props.imageContainerProps}>
                <React.Fragment>
                    {props.children}
                    {props.editable && <SSIconButton onEditImg={props.onEditImg} />}
                </React.Fragment>
            </ImageContainer>}
        </ProgressiveImage >
    );
}


const ProfileImage = withImageExists(SSAvatar, imageExistsConfig);

ProfileImage.propTypes = {
    imageContainerProps: PropTypes.object,
    editable: PropTypes.bool,
    onEditImg: PropTypes.func,
    src: PropTypes.string,
}

ProfileImage.defaultProps = {
    editable: false,
    onEditImg: () => { }
}

export default ProfileImage;