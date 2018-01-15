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
  padding: 0 ${helpers.rhythmDiv}px;
  border: 1px solid ${helpers.panelColor};
`;

const Title = styled.h2`
  font-family: ${helpers.specialFont};
  text-align: center;
  font-weight: 400;
`;

const Body = styled.section`

`;

const ListWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  border: 1px solid ${helpers.panelColor};
  border-right: 0;
  border-left: 0;
  padding: ${helpers.rhythmDiv}px;
  padding-bottom: 0;

  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
  }
`;

const PriceListItem = (props) => (
  <ListWrapper key={props.amount + props.currency + props.noOfMonths}>
    <Typography>{props.currency} {props.amount} for {props.noOfMonths}</Typography>
    <PrimaryButton label="Purchase" onClick={props.onPurchaseButtonClick} />
  </ListWrapper>
);

const PriceMonthly = (props) => (
  <Price>
    <Title>{props.title}</Title>
    <Body>
      <Typography>{props.paymentType}</Typography>
      <Typography>{props.classTypesCovered}</Typography>
      {props.packages.map((data) => <PriceListItem {...data}/>)}
    </Body>
  </Price>
);

PriceMonthly.propTypes = {
  title: PropTypes.string,
  classTypesCovered: PropTypes.string,
  onPurchaseButtonClick: PropTypes.func,
  packages: PropTypes.arrayOf({
    currency: PropTypes.number,
    amount: PropTypes.number,
    noOfMonths: PropTypes.number
  })
}

export default PriceMonthly;
