import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';

import PriceCommon from './PriceCommon';
import PriceMonthly from './PriceMonthly';
import Package from './Package';

import monthlyPackage from '../../../constants/structure/monthlyPackage.js';
import perClassPackage from '../../../constants/structure/perClassPackage.js';

import * as helpers from '../../jss/helpers.js';

const PackagesListWrapper = styled.section`
  ${helpers.flexDirectionColumn}
`;

const Wrapper = styled.div`
  display: flex;

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    flex-direction: column;
  }
`;

const PackageWrapper = styled.div`
  width: calc(33% - ${helpers.rhythmDiv * 2}px);
  margin: ${helpers.rhythmDiv}px;

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    width: 100%;
  }
`;

const Title = styled.h1`
  font-family: ${helpers.specialFont};
  font-weight: 500;
  text-align: center;
  font-size: ${helpers.baseFontSize * 1.5}px;
`;

const PackagesList = (props) => {
  return (
    <Wrapper>
      <PackageWrapper>
        <Package
          title="Enrollment Fees"
          perClassPackage={false}
          priceComponent={PriceCommon}
        />
      </PackageWrapper>

      <PackageWrapper>
        <Package
          title="Per Class Package"
          perClassPackage={true}
          packagesData={props.perClassPackagesData}
          priceComponent={PriceCommon}
        />
      </PackageWrapper>

      <PackageWrapper>
        <Package
          title="Monthly Packages"
          packagesData={props.monthlyPackagesData}
          priceComponent={PriceMonthly} />
      </PackageWrapper>

    </Wrapper>
  )
}

PackagesList.propTypes = {
  title: PropTypes.string,
  perClassPackagesData: PropTypes.arrayOf(perClassPackage),
  monthlyPackagesData: PropTypes.arrayOf(monthlyPackage),
}

export default PackagesList;
