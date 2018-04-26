import React , {Fragment} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton.jsx';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const Wrapper = styled.div`
  ${helpers.flexCenter}
  justify-content: space-evenly;
  background: white;
  padding: ${helpers.rhythmDiv * 2}px 0;
  margin: ${helpers.rhythmDiv * 2}px 0;
  border-radius: 5px;
  max-width: 496px;
  width: 100%;

  @media screen and (max-width: ${helpers.mobile}px) {
    padding: ${helpers.rhythmDiv * 2}px;
    flex-wrap: wrap;
  }
`;

const BestPriceWrapper = styled.div`
  ${helpers.flexCenter}
  flex-direction: column;
  margin-right: ${helpers.rhythmDiv}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    margin-bottom: ${helpers.rhythmDiv * 2}px;
  }
`;

const ButtonWrapper = styled.div`
  @media screen and (max-width: ${helpers.mobile}px) {
    ${helpers.flexCenter}
    width: 100%;
  }
`;

const Text = styled.p`
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.specialFont};
  font-style: italic;
  margin-bottom: ${helpers.rhythmDiv}px;
  line-height: 1;

  @media screen and (max-width: ${helpers.mobile}px) {
    margin-bottom: 0;
  }
`;

const PriceText = Text.extend`
  font-size: ${helpers.baseFontSize * 1.5}px;
  line-height: 1;
  margin: 0;
  font-weight: 400;
`;

const BestPrice = (props) => (<BestPriceWrapper>
  <Text>{props.type} packages from</Text>
  <PriceText>{props.currency} {props.price} per {props.priceFor}</PriceText>
</BestPriceWrapper>);

const BestPrices = (props) => (<Wrapper>

  {props.bestPriceDetails.monthly && <BestPrice
      type="Monthly"
      price={props.bestPriceDetails.monthly}
      priceFor="month"
      currency={props.currency}
  />}
  {props.bestPriceDetails.class && <BestPrice
      type="Class"
      price={props.bestPriceDetails.class}
      priceFor="class"
      currency={props.currency}
    />}
  <ButtonWrapper>
    <FormGhostButton icon iconName="attach_money" fullWidth label="Pricing" onClick={props.onPricingButtonClick}/>
  </ButtonWrapper>
</Wrapper>);

BestPrices.propTypes = {
  text: PropTypes.string,
  price: PropTypes.number,
  priceFor: PropTypes.string,
  currency: PropTypes.string,
}

BestPrices.defaultProps = {
  currency: '$'
}

export default BestPrices;
