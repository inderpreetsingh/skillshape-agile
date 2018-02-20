import React,{ Component,Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import BrandBar from './components/BrandBar';
import SchoolHeader from './components/school/SchoolHeader.jsx';
import SchoolIssues from './components/school/SchoolIssues.jsx';

import schoolIssuesData from './constants/schoolIssues.js'

import * as helpers from './components/jss/helpers.js';

const Wrapper = styled.div`

`;

const School = () => (
  <Wrapper>
    <BrandBar
      navBarHeight="70"
      positionStatic={true}
      overlay={true}
      navBgColor={helpers.schoolPageColor}
      barButton={<span></span>} />

    <SchoolHeader />

    <SchoolIssues issues={schoolIssuesData} />
  </Wrapper>
);

export default School;
