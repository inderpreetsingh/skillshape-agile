import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import * as helpers from '../jss/helpers.js';

const Wrapper = styled.div`
  padding-top: ${helpers.rhythmDiv * 4}px;
  background-color: ${helpers.black};
  max-width: 100vw;
  min-height: 100vh;
`;

const PricingBoxWrapper = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: ${helpers.schoolPageContainer}px;
  padding: ${helpers.rhythmDiv * 2}px;
`;

const Title = styled.h2`
  font-style: italic;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize * 1.5}px;
  font-weight: 300;
  color: white;
  text-align: center;
  margin: 0 auto;
  max-width: 800px;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const PricingWrapper = styled.div`
  ${helpers.flexCenter};

  @media screen and (max-width: ${helpers.tablet}px) {
    flex-direction: column;
  }
`;

const Pricing = styled.div`
  border-radius: ${helpers.rhythmDiv * 6}px;
  padding: ${helpers.rhythmDiv * 2}px;
  max-width: 300px;
  width: 100%;
  min-height: 400px;
  background-color: white;
  margin: 0 ${helpers.rhythmDiv}px;

  @media screen and (max-width: ${helpers.tablet}px) {
    max-width: 100%;
    min-height: 200px;
    margin: ${helpers.rhythmDiv}px 0;
  }
`;

const Price = styled.p`
  margin: 0;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.rhythmDiv * 4}px;
  color: ${helpers.black};
  text-align: center;
`;

const SchoolPricing = (props) => {
  return(<Wrapper>
    <PricingBoxWrapper>
      <Title>{props.title}</Title>
      <PricingWrapper>
        <Pricing>
          <Price>0$</Price>
        </Pricing>
        <Pricing>
          <Price>17$</Price>
        </Pricing>
        <Pricing>
          <Price>37$</Price>
        </Pricing>
      </PricingWrapper>
    </PricingBoxWrapper>
  </Wrapper>)
}

SchoolPricing.defaultProps = {
  title: 'So Sign Up for a skillshape account and see what everyone is talking about.'
}

export default SchoolPricing;
