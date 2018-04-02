import React, {Fragment} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import ClassTimeButton from '../buttons/ClassTimeButton.jsx';

import * as helpers from '../jss/helpers.js';

const ActionButtonsWrapper = styled.div`
  position: absolute;
  left: ${helpers.rhythmDiv * 2}px;
  bottom: ${helpers.rhythmDiv * 2}px;
  right: auto;
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

const ActionButton = styled.div`
  margin-right: ${helpers.rhythmDiv}px;

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    margin-right: 0;
    margin-bottom: ${helpers.rhythmDiv * 2}px;
  }

  @media screen and (max-width: ${helpers.tablet}px) {
    margin-right: ${helpers.rhythmDiv}px;
  }
`;

const MyTel = styled.a`
  @media screen and (max-width: ${helpers.mobile}px) {
    display: none;
  }
`;

const MyTelMobile = styled.a`
  display: none;
  @media screen and (max-width: ${helpers.mobile}px) {
    display: initial;
  }
`;

const ActionButtons = (props) => {
  const EditButton = props.editButton;
  return(<ActionButtonsWrapper>
    {props.isEdit ?
    <Fragment>
      <ClassTimeButton icon iconName='edit' label="Logo" onClick={props.onEditLogoButtonClick} />
    </Fragment>
    :
    <Fragment>
      {props.editButton && <EditButton />}
      <ActionButton>
        <ClassTimeButton icon iconName='phone' label="Call Us" onClick={props.onCallUsButtonClick}/>
      </ActionButton>

      <ActionButton>
        <ClassTimeButton secondary noMarginBottom label="Email Us" icon iconName="email" onClick={props.onEmailButtonClick} />
      </ActionButton>

      <ActionButton>
        <ClassTimeButton secondary noMarginBottom label="Pricing" icon iconName="attach_money" onClick={props.onPricingButtonClick} />
      </ActionButton>
    </Fragment>}
  </ActionButtonsWrapper>)
}

ActionButtons.propTypes = {
  onCallUsButtonClick: PropTypes.func,
  onEmailButtonClick: PropTypes.func,
  onPricingButtonClick: PropTypes.func
}

ActionButtons.defaultProps = {
  editButton: false
}

export default ActionButtons;
