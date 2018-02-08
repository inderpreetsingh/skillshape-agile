import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Cart from '../../icons/Cart.jsx';

import PrimaryButton from '../../buttons/PrimaryButton';

//TODO: Automatic imports depending upon variables used - intellij
import * as helpers from '../../jss/helpers.js';

const Wrapper = styled.div`
  ${helpers.flexCenter}
  justify-content: space-between;

  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
  }
`;

const OuterWrapper = styled.div`
  background-color: white;
  padding: ${helpers.rhythmDiv * 2}px ${helpers.rhythmDiv * 3}px;
  padding-right: ${helpers.rhythmDiv * 2}px;
  border-radius: ${helpers.rhythmDiv * 6}px;
  width: 100%;
  color: ${helpers.textColor};

  @media screen and (max-width: ${helpers.mobile}px) {
    border-radius: ${helpers.rhythmDiv}px;

    max-width: 320px;
    width: 100%;
    margin: 0 auto;
  }

`;

const Title = styled.h2`
  font-size: 12px;
  font-family: ${helpers.commonFont};
  letter-spacing: 2px;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0;
  color: rgba(0,0,0,1);
  line-height: 1;

  @media screen and (max-width: ${helpers.mobile}px) {
    text-align: center;
  }
`;

const Body = styled.section`
  padding: ${helpers.rhythmDiv}px;
`;

const ClassDetailsSection = styled.div`
  ${helpers.flexDirectionColumn}
  max-width: 65%;

  @media screen and (max-width: ${helpers.mobile}px) {
    max-width: 100%;
  }
`;

const ClassDetailsText = styled.p`
  margin: 0;
  font-size: 14px;
  font-family: ${helpers.specialFont};
  font-weight: 400;
  line-height: 1;

  @media screen and (max-width: ${helpers.mobile}px) {
    text-align: center;
    margin-bottom: ${helpers.rhythmDiv}px;
  }
`;

const PriceSection = styled.div`
  ${helpers.flexDirectionColumn}
  margin: 0;
  padding-bottom: ${helpers.rhythmDiv/2}px;
`;

const Price = styled.p`
  margin: 0;
  font-family: ${helpers.specialFont};
  font-weight: 300;
  color: ${helpers.primaryColor};
  font-size: 28px;
  line-height: 1;
`;

const NoOfClasses = styled.p`
  font-style: italic;
  font-family: ${helpers.specialFont};
  font-weight: 400;
  font-size: 14px;
  margin: 0;
  line-height: 1;
`;

const AddToCartSection = styled.div`
  margin-left: ${helpers.rhythmDiv * 2}px;
  cursor: pointer;
`;

const RightSection = styled.div`
  ${helpers.flexCenter}
`;

const Package = (props) => (
  <OuterWrapper>
    <Wrapper>
      <ClassDetailsSection>
        <Title>{props.title}</Title>
        <ClassDetailsText>Expiration: {props.expiration}</ClassDetailsText>
        <ClassDetailsText>Covers: {props.classesCovered}</ClassDetailsText>
      </ClassDetailsSection>

      <RightSection>
        <PriceSection>
          <Price>{props.price}</Price>
          <NoOfClasses>for {props.noOfClasses} classes</NoOfClasses>
        </PriceSection>

        <AddToCartSection >
          <Cart onClick={props.onAddToCartIconButtonClick} />
        </AddToCartSection>
      </RightSection>
    </Wrapper>
  </OuterWrapper>
);

Package.propTypes = {
  title: PropTypes.string,
  expiration: PropTypes.string,
  price: PropTypes.string,
  noOfClasses: PropTypes.number,
  classesCovered: PropTypes.string,
  onAddToCartIconButtonClick: PropTypes.func
}

Package.defaultProps = {
  expiration: '29th May, 2018',
  classes: 'Karatey, Yoga, Meditation',
  packagePerClass: false,
  noOfClasses: 2,
  price: '$620',
  onAddToCartIconButtonClick: () => console.log('cart Icon Clicked')
}

export default Package;
