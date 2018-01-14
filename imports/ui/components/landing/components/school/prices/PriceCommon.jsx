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
  font-weight: 500;
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
  <MuiThemeProvider>
    <Price>
      <Title>{props.title}</Title>
      <Body>
        <Typography>{props.currency} {props.amount} {props.packagePerClass && `for ${props.noOfClasses} classes`}</Typography>
        {props.packagePerClass && <Typography>Expiration: {props.expirationTime || 'Contact School for Details'}</Typography>}
        <Typography>Covers: {props.classTypesCovered}</Typography>
      </Body>
      <Footer>
        {props.footerButton || <PrimaryButton label="Purchase" onClick={props.onPurchaseButtonClick} />}
      </Footer>
    </Price>
  </MuiThemeProvider>
);

PriceCommon.propTypes = {
  title: PropTypes.sting,
  amount: PropTypes.number,
  currency: PropTypes.string,
  noOfClasses: PropTypes.number,
  classTypesCovered: PropTypes.string,
  packagePerClass: PropTypes.bool,
  footerButton: PropTypes.element
}

PriceCommon.defaultProps = {
  packagePerClass: false
}

export default PriceCommon;
