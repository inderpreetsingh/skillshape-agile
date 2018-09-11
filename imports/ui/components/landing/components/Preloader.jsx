import React from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";

import * as helpers from "./jss/helpers.js";
import { logoSrc } from "../site-settings.js";

//import Preload from 'react-preload';

const PreloaderAnim = keyframes`
   0% {
     transform : rotate(0deg);
   }
   100% {
     transform: rotate(360deg);
   }
}`;

const PreloaderWrapper = styled.div`
  width: 100%;
  height: 100%;
  ${helpers.flexCenter};
`;

const PreloaderIcon = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-position: 50% 50%;
  background-size: cover;
  background-image: url('${logoSrc}');
  animation: ${PreloaderAnim} 0.5s infinite;
`;

const Preloader = props => (
  <PreloaderWrapper>
    <PreloaderIcon height={props.height} width={props.width} />
  </PreloaderWrapper>
);

Preloader.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number
};

Preloader.defaultProps = {
  height: 150,
  width: 150
};

export default Preloader;
