import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import PrimaryButton from '../buttons/PrimaryButton.jsx';
import SecondaryButton from '../buttons/SecondaryButton.jsx';

//TODO: Automatic imports depending upon variables used - intellij
import * as helpers from '../jss/helpers.js';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    font-family: ${helpers.commonFont};
    padding: ${helpers.rhythmDiv}px;
    border: 1px solid ${helpers.darkBgColor};
    border-radius: ${helpers.rhythmDiv}px;
    
    @media screen and (max-width: ${helpers.tablet}px) {
        flex-direction: row;
        border: none;
        border-radius: 0px;
        padding: 0;
    }
    
    @media screen and (max-width: ${helpers.mobile}px) {
        flex-direction: column-reverse;
    }
`;

const PricingSection = styled.div`
    ${helpers.flexCenter}
    flex-direction: column;
    border: 1px solid ${helpers.darkBgColor};
    margin: ${helpers.rhythmDiv} 0;
    padding: ${helpers.rhythmDiv}px;
    
    @media screen and (max-width: ${helpers.tablet}px) {
        margin: 0;
    }
`;

const AddressSection = styled.div`
    ${helpers.flexCenter}
    flex-direction: column;
    border: 1px solid ${helpers.darkBgColor};
    margin: ${helpers.rhythmDiv} 0;
    padding: ${helpers.rhythmDiv}px;
    
    @media screen and (max-width: ${helpers.tablet}px) {
        margin: 0;
    }
`;

const ButtonsWrapper = styled.div`
    display: flex;
    padding: 0 ${helpers.rhythmDiv};
`;

const PriceDetails = (props) => (
    <Wrapper>
        
        <PricingSection>
            <p>Monthly Packages from ${props.monthlyCharges} per Month</p>
            <p>Class Packages from ${props.perClassCharges} per Class</p>
            <ButtonsWrapper>
                <PrimaryButton label="Schedule" icon iconName="schedule" />
                <SecondaryButton label="Pricing" icon iconName="attach_money" />
            </ButtonsWrapper>
        </PricingSection>
        
        <AddressSection>
            {props.schoolSite && <p>{props.schoolSite}</p>}
            <p>{props.schoolAddress}</p>
        </AddressSection>
    
    </Wrapper>
);

PriceDetails.propTypes = {
    monthlyCharges: PropTypes.number,
    perClassCharges: PropTypes.number,
    schoolSite: PropTypes.string,
    schoolAddress: PropTypes.string
}

PriceDetails.defaultProps = {
    monthlyCharges: 100,
    perClassCharges: 10,
    schoolSite: 'someschool.com',
    schoolAddress: '123, someschool nearby some place, city, state'
}

export default PriceDetails;