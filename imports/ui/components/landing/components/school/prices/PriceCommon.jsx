import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { MuiThemeProvider} from 'material-ui/styles';
import Typography from 'material-ui/Typography';

import PrimaryButton from '../../buttons/PrimaryButton';

//TODO: Automatic imports depending upon variables used - intellij
import * as helpers from '../../jss/helpers.js';

const Price = styled.article`
  ${helpers.flexDirectionColumn}
  padding: 0 ${helpers.rhythmDiv * 2}px;
  border: 1px solid ${helpers.panelColor};
`;

const Title = styled.h2`
  font-family: ${helpers.specialFont};
  font-weight: 400;
  text-align: center;
`;

const Body = styled.section`
  padding: ${helpers.rhythmDiv}px;
`;

const Footer = styled.footer`
  ${helpers.flexCenter}
  padding: ${helpers.rhythmDiv}px;
`;

const PriceCommon = (props) => (
  <Price>
    <Title>{props.title}</Title>
    <Body>
      <Typography>{props.currency} {props.amount} {props.perClassPackage && `for ${props.noOfClasses} classes`}</Typography>
      {props.perClassPackage && <Typography>Expiration: {props.expirationTime || 'Contact School for Details'}</Typography>}
      <Typography>Covers: {props.classTypesCovered}</Typography>
    </Body>
    <Footer>
      {props.footerButton || <PrimaryButton label="Purchase" onClick={props.onPurchaseButtonClick} />}
    </Footer>
  </Price>
);

PriceCommon.propTypes = {
  title: PropTypes.string,
  amount: PropTypes.number,
  currency: PropTypes.string,
  noOfClasses: PropTypes.number,
  classTypesCovered: PropTypes.string,
  perClassPackage: PropTypes.bool,
  footerButton: PropTypes.element
}

PriceCommon.defaultProps = {
  packagePerClass: false
}

export default PriceCommon;