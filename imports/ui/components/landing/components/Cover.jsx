import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import * as helpers from './jss/helpers.js';
import {coverSrc} from '../site-settings.js';

const CoverDiv = styled.div`
    background-image: url('${props => props.coverSrc ? props.coverSrc : coverSrc}');
    min-height:${helpers.coverHeight};
    ${helpers.coverBg}
`;

const Polythene = styled.div`
    width:100%;
    min-height:400px;
    height:${helpers.coverHeight};
    padding: ${helpers.rhythmDiv};
    background: ${props => props.gradient ? 
    `linear-gradient(to ${props.gradientDirection}, rgba(${props.gradientRGB},1) 64px, rgba(${props.gradientRGB},0.96) 21%,rgba(${props.gradientRGB},0) 55%, rgba(${props.gradientRGB},0) 100%)`
    : 'none'};
    ${helpers.flexCenter}
`;

const Cover = (props) => (
    <CoverDiv coverSrc={props.coverSrc}> 
        <Polythene gradient={props.gradient} gradientDirection={props.gradientDirection} gradientRGB={props.gradientRGB}> 
            {props.children}
        </Polythene>
    </CoverDiv >)
    
Cover.propTypes = {
    children: PropTypes.node,
    coverSrc: PropTypes.string,
    gradientDirection: PropTypes.string,
    gradientRGB: PropTypes.string,
}    
    
Polythene.defaultProps = {
    gradientDirection:helpers.gradientDirection,
    gradientRGB:helpers.gradientRGB,
    gradient: true,
}    

export default Cover;