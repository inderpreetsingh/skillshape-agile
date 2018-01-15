import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
`;

const ContactSchoolButtons = (props) => (
  <Wrapper>
    <PrimaryButton label="Email Us" icon iconName="email" onClick={props.onEmailButtonClick}/>
    <SecondaryButton label="Call Us" icon iconName="call" onClick={props.onCallUsButtonClick}/>
  </Wrapper>
)

ContactSchoolButtons.propTypes = {
  onEmailButtonClick: PropTypes.func,
  onCallUsButtonClick: PropTypes.func,
}

export default ContactSchoolButtons;
