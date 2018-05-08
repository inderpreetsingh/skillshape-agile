import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import * as helpers from '../jss/helpers.js';

import SchoolPriceCard from '/imports/ui/components/landing/components/cards/SchoolPriceCard.jsx';

const Wrapper = styled.div`
  max-width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${helpers.schoolPageColor};
`;


const Title = styled.h2`
  font-style: italic;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize * 1.5}px;
  font-weight: 300;
  color: white;
  margin: 0 auto;
  max-width: 500px;
`;

const TitleWrapper = styled.div`
  background-color: ${helpers.black};
  padding: ${helpers.rhythmDiv * 4}px ${helpers.rhythmDiv * 2}px;
  text-align: center;
`;

const PricingBoxWrapper = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: ${helpers.schoolPageContainer}px;
  padding: ${helpers.rhythmDiv * 4}px;
  height: 100%;
  flex-grow: 1;
  ${helpers.flexCenter};
`;

const PricingWrapper = styled.div`
  width: 100%;
  ${helpers.flexCenter};
  justify-content: space-between;

  @media screen and (max-width: ${helpers.tablet + 50}px) {
    flex-direction: column;
  }
`;


const SchoolPricing = (props) => {
  return(<Wrapper>
    <TitleWrapper><Title>{props.title}</Title></TitleWrapper>
    <PricingBoxWrapper>
      <PricingWrapper>
        {props.cardsData && props.cardsData.map( (card, index) => <SchoolPriceCard key={index} {...card} />) }
      </PricingWrapper>
    </PricingBoxWrapper>
  </Wrapper>)
}

SchoolPricing.defaultProps = {
  title: 'So sign up for a skillshape account and see what everyone is talking about.'
}

export default SchoolPricing;
