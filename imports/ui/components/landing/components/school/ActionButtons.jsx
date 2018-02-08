import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import ClassTimeButton from '../buttons/ClassTimeButton.jsx';

import * as helpers from '../jss/helpers.js';

const ActionButtonsWrapper = styled.div`
  position: absolute;
  left: ${helpers.rhythmDiv}px;
  bottom: ${helpers.rhythmDiv * 2}px;
  right: auto;
  ${helpers.flexCenter}

  @media screen and (max-width: ${helpers.tablet}px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    bottom: 0;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    position: initial;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const ActionButton = styled.div`
  @media screen and (max-width: ${helpers.tablet}px) {
    margin-bottom: ${helpers.rhythmDiv * 2}px;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    margin-right: ${helpers.rhythmDiv * 2}px;
  }
`;

const ActionButtons = (props) => (
  <ActionButtonsWrapper>
    <ActionButton>
      <ClassTimeButton icon iconName='phone' label="Call Us" onClick={props.onCallUsButtonClick}/>
    </ActionButton>

    <ActionButton>
      <ClassTimeButton secondary noMarginBottom label="Email Us" icon iconName="email" onClick={props.onEmailButtonClick} />
    </ActionButton>

    <ActionButton>
      <ClassTimeButton secondary noMarginBottom label="Pricing" onClick={props.onPricingButtonClick} />
    </ActionButton>
  </ActionButtonsWrapper>
);

ActionButtons.propTypes = {
  onCallUsButtonClick: PropTypes.func,
  onEmailButtonClick: PropTypes.func,
  onPricingButtonClick: PropTypes.func
}

export default ActionButtons;
