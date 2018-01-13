import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';

import PriceCommon from './PriceCommon';
import PriceMonthly from './PriceMonthly';

import perClassPackagesData from '../../../constants/perClassPackagesData.js';
import monthlyPackagesData from '../../../constants/monthlyPackagesData.js';

import * as helpers from '../../jss/helpers.js';

const Container = styled.div`
  overflow: hidden;
  width: 500px;

  @media screen and (max-width: ${helpers.mobile}px) {
    width: 100%;
  }
`;

const PackagesList = (props) => {
  const { priceComponent } = props
  return (
    <div>
      <h2>Prices Component</h2>
      <Container>
        <Grid container>
            {perClassPackagesData.map(data => (
              <Grid item sm={6} md={6} xs={12}>
                <PriceCommon packagePerClass={true} {...data} />
              </Grid>
            ))}
        </Grid>
      </Container>

      <h2>Monthly Packages Component</h2>
      <Container>
        <Grid container>
            {monthlyPackagesData.map(data => (
              <Grid item sm={6} md={6} xs={12}>
                <PriceMonthly {...data} />
              </Grid>
            ))}
        </Grid>
      </Container>
    </div>
  )
}

PackagesList.propTypes = {
  priceComponent: PropTypes.element,
  title: PropTypes.string
}

export default PackagesList;
