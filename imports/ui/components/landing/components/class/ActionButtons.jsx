import React, {Fragment} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import ClassTimeButton from '../buttons/ClassTimeButton.jsx';

import * as helpers from '../jss/helpers.js';

const ActionButtonsWrapper = styled.div`
  position: absolute;
  left: ${props => props.rightSide ? 'auto' : helpers.rhythmDiv * 2}px;
  bottom: ${helpers.rhythmDiv * 2}px;
  right: ${props => props.rightSide ? helpers.rhythmDiv * 2 + 'px' : 'auto'};
  ${helpers.flexCenter}

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    bottom: 0;
  }

  @media screen and (max-width: ${helpers.tablet}px) {
    position: initial;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const ActionButtonsRightSideWrapper = styled.div`
  position: absolute;
  left: 'auto';
  bottom: ${helpers.rhythmDiv * 2}px;
  right: ${helpers.rhythmDiv * 2 + 'px'};
  ${helpers.flexCenter}

  @media screen and (max-width: 1100px) {
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    flex-wrap: wrap;
  }



  @media screen and (max-width: ${helpers.tablet}px) {
    position: initial;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
  }

`;

const ActionButton = styled.div`
  margin-right: ${helpers.rhythmDiv}px;

  @media screen and (max-width: 1100px) {
    margin-bottom: ${props => props.rightSide ? helpers.rhythmDiv * 2 : 0}px;
  }

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    margin-right: 0;
    margin-bottom: ${helpers.rhythmDiv * 2}px;
  }

  @media screen and (max-width: ${helpers.tablet}px) {
    margin-right: ${helpers.rhythmDiv}px;
  }
`;


const ActionButtons = (props) => {
  const ActionButtonsContainer = props.rightSide ? ActionButtonsRightSideWrapper : ActionButtonsWrapper;
  return(<ActionButtonsContainer>
    {props.isEdit ? <Fragment></Fragment> :
    <Fragment>
      {props.callUsButton && <ActionButton rightSide={props.rightSide}>
        <ClassTimeButton icon iconName='phone' label="Call Us" onClick={props.onCallUsButtonClick}/>
      </ActionButton>}

      {props.emailUsButton && <ActionButton rightSide={props.rightSide}>
        <ClassTimeButton secondary noMarginBottom label="Email Us" icon iconName="email" onClick={props.onEmailButtonClick} />
      </ActionButton>}

      {props.pricingButton && <ActionButton rightSide={props.rightSide}>
        <ClassTimeButton secondary noMarginBottom label="Pricing" icon iconName="attach_money" onClick={props.onPricingButtonClick} />
      </ActionButton>}
    </Fragment>}
  </ActionButtonsContainer>)
}

ActionButtons.propTypes = {
  onCallUsButtonClick: PropTypes.func,
  onEmailButtonClick: PropTypes.func,
  onPricingButtonClick: PropTypes.func,
  emailUsButton: PropTypes.bool,
  callUsButton: PropTypes.bool,
  pricingButton: PropTypes.bool,
  rightSide: PropTypes.bool
}

ActionButtons.defaultProps = {
  editButton: false,
  rightSide: false,
  emailUsButton: true,
  callUsButton: true,
  pricingButton: true
}

export default ActionButtons;
