import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import PrimaryButton from '../buttons/PrimaryButton.jsx';
import SecondaryButton from '../buttons/SecondaryButton.jsx';

//TODO: Automatic imports depending upon variables used - intellij
import * as helpers from '../jss/helpers.js';

const Wrapper = styled.div`
  ${helpers.flexCenter}
  flex-direction: column;
  border: 1px solid ${helpers.darkBgColor};
  margin: ${helpers.rhythmDiv} 0;
  padding: ${helpers.rhythmDiv}px;
`;

const ButtonsWrapper = styled.div`
    display: flex;
    padding: 0 ${helpers.rhythmDiv};
`;

const PackageDetails = (props) => (
    <Wrapper>
      <p>Monthly Packages from ${props.monthlyCharges} per Month</p>
      <p>Class Packages from ${props.perClassCharges} per Class</p>
      <ButtonsWrapper>
        <PrimaryButton label="Schedule" icon iconName="schedule" onClick={props.onScheduleButtonClick}/>
        <SecondaryButton label="Pricing" icon iconName="attach_money" onClick={props.onPricingButtonClick}/>
      </ButtonsWrapper>
    </Wrapper>
);

PackageDetails.propTypes = {
    monthlyCharges: PropTypes.number,
    perClassCharges: PropTypes.number,
    onScheduleButtonClick: PropTypes.func,
    onPricingButtonClick: PropTypes.func,
}

PackageDetails.defaultProps = {
    monthlyCharges: 100,
    perClassCharges: 10,
}

export default PackageDetails;
