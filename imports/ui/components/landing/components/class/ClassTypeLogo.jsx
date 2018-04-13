import React, {Fragment} from 'react';
import styled from 'styled-components';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
import {schoolLogo} from '/imports/ui/components/landing/site-settings.js';

const Logo = styled.div`
  ${helpers.coverBg}
  width: ${helpers.rhythmDiv * 20}px;
  height: ${helpers.rhythmDiv * 20}px;
  border-radius: 5px;
  position: ${props => props.position ? props.position : 'absolute'};
  left: ${props => props.left ? props.left : 0}px;
  bottom: ${props => props.bottom ? props.bottom: 0}px;
  background-color: ${helpers.cancel};
  background-position: center center;
  background-image: url('${props => props.logoSrc}');

  @media screen and (max-width: 1100px) {
    bottom: ${props => props.publicView ? props.bottom + 64 : 0}px;
    left: ${props => props.publicView ? '50%' : (props.left || 0)+'px'};
    transform: translateX(${props => props.publicView ? '-50%' : 0});
  }

  @media screen and (max-width: 875px) {
    bottom: ${props => props.publicView ? props.bottom + 112 : 0}px;
  }
`;

const imageExistsConfig = {
  image: 'logoSrc',
  defaultImg: schoolLogo
}

const ClassTypeLogo = (props) => (<Logo
  bottom={props.bottom}
  left={props.left}
  publicView={props.publicView}
  position={props.position}
  logoSrc={props.logoSrc ? props.bgImg : props.logoSrc}
>{props.children}</Logo>);

export default withImageExists(ClassTypeLogo,imageExistsConfig);
