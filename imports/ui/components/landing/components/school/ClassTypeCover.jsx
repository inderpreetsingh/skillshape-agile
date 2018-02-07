import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import * as helpers from '../jss/helpers.js';
import { classTypeImgSrc } from '../../site-settings.js';

const CoverDiv = styled.div`
    ${helpers.coverBg}
    background-position: center center;
    background-image: url('${props => props.coverSrc}');
    min-height: ${helpers.baseFontSize * 30}px;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: white;
      opacity: 0.9;
      z-index: 0;
    }
`;

const ClassTypeCover = (props) => {
    if(props.itemScope && props.itemType) {
        return(
          <CoverDiv coverSrc={props.coverSrc} itemScope itemType={props.itemType}>

          </CoverDiv >
        )
    }
    return(
      <CoverDiv coverSrc={props.coverSrc}>
        {props.children}
      </CoverDiv >
    )
  }

ClassTypeCover.propTypes = {
  coverSrc: PropTypes.string,
}

ClassTypeCover.defaultProps = {
  coverSrc: classTypeImgSrc
}

export default ClassTypeCover;
