import React,{ Component,Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import BrandBar from './components/BrandBar';
import SchoolHeader from './components/school/SchoolHeader.jsx';

import * as helpers from './components/jss/helpers.js';

const Wrapper = styled.div`
  background-color: ${helpers.schoolPageColor}
`;

const School = () => (
  <Wrapper>
    <BrandBar navBarHeight="70" navBgColor={helpers.schoolPageColor} barButton={<span></span>} positionStatic={true}/>
    <SchoolHeader />
  </Wrapper>
);

export default School;
