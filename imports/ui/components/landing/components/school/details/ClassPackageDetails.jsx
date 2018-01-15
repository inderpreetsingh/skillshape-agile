import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Typography from 'material-ui/Typography';

import PrimaryButton from '../../buttons/PrimaryButton.jsx';
import SecondaryButton from '../../buttons/SecondaryButton.jsx';

//TODO: Automatic imports depending upon variables used - intellij
import * as helpers from '../../jss/helpers.js';

const DetailsWrapper = styled.div`
  ${helpers.flexCenter}
  flex-direction: column;
  margin: ${helpers.rhythmDiv} 0;
  padding: ${helpers.rhythmDiv}px;
  text-align: center;
  padding: ${helpers.rhythmDiv}px;
`;

const ButtonsWrapper = styled.div`
    display: flex;
    padding: ${helpers.rhythmDiv}px;
`;

const ClassPackageDetails = (props) => (
    <DetailsWrapper>
      <Typography>Monthly Packages from ${props.monthlyCharges} per Month</Typography>
      <Typography>Class Packages from ${props.perClassCharges} per Class</Typography>
      <ButtonsWrapper>
        <PrimaryButton label="Schedule" icon iconName="schedule" onClick={props.onScheduleButtonClick}/>
        <SecondaryButton label="Pricing" icon iconName="attach_money" onClick={props.onPricingButtonClick}/>
      </ButtonsWrapper>
    </DetailsWrapper>
);

ClassPackageDetails.propTypes = {
    monthlyCharges: PropTypes.number,
    perClassCharges: PropTypes.number,
    onScheduleButtonClick: PropTypes.func,
    onPricingButtonClick: PropTypes.func,
}

ClassPackageDetails.defaultProps = {
    monthlyCharges: 100,
    perClassCharges: 10,
}

export default ClassPackageDetails;
