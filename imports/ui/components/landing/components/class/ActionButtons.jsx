import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import ClassTimeButton from '/imports/ui/components/landing/components/buttons/ClassTimeButton';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import { addHttp, handleOutBoundLink } from '/imports/util';

const ActionButtonsWrapper = styled.div`
  ${helpers.flexCenter}
  padding-bottom: ${helpers.rhythmDiv * 2}px;

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
  ${helpers.flexCenter}
  padding-bottom: ${helpers.rhythmDiv * 2}px;
  align-items: flex-end;

  @media screen and (max-width: ${helpers.tablet + 150}px) {
    flex-direction: column;
    align-items: flex-start;
  }

  @media screen and (max-width: ${helpers.tablet}px) {
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const ActionButton = styled.div`
  margin-right: ${helpers.rhythmDiv}px;
  min-height: ${helpers.rhythmDiv * 4}px;

  @media screen and (max-width: 1100px) {
    margin-bottom: ${props => (props.rightSide ? helpers.rhythmDiv * 2 : 0)}px;
  }

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    margin-right: 0;
    margin-bottom: ${helpers.rhythmDiv * 2}px;
  }

  @media screen and (max-width: ${helpers.tablet}px) {
    margin-right: ${helpers.rhythmDiv}px;
  }
`;

const ShowOnSmallScreen = styled.div`
  display: none;
  @media screen and (max-width: ${helpers.tablet}px) {
    display: block;
  }
`;

const ActionButtons = (props) => {
  const ActionButtonsContainer = props.rightSide
    ? ActionButtonsRightSideWrapper
    : ActionButtonsWrapper;
  const EditButton = props.editButton;
  return (
    <ActionButtonsContainer>
      {props.isEdit ? (
        <Fragment />
      ) : (
        <Fragment>
          {props.editButton && (
            <ShowOnSmallScreen>
              <ActionButton rightSide={props.rightSide}>
                <EditButton />
              </ActionButton>
            </ShowOnSmallScreen>
          )}

          {props.callUsButton && (
            <ActionButton rightSide={props.rightSide}>
              <ClassTimeButton
                icon
                iconName="phone"
                label="Call Us"
                onClick={props.onCallUsButtonClick}
              />
            </ActionButton>
          )}

          {props.emailUsButton && (
            <ActionButton rightSide={props.rightSide}>
              <ClassTimeButton
                secondary
                noMarginBottom
                label="Email Us"
                icon
                iconName="email"
                onClick={props.onEmailButtonClick}
              />
            </ActionButton>
          )}

          {props.pricingButton && (
            <ActionButton rightSide={props.rightSide}>
              <ClassTimeButton
                secondary
                noMarginBottom
                label="Pricing"
                icon
                iconName="attach_money"
                onClick={props.onPricingButtonClick}
              />
            </ActionButton>
          )}

          {props.scheduleButton && (
            <ActionButton rightSide={props.rightSide}>
              <ClassTimeButton
                secondary
                noMarginBottom
                label="Schedule"
                icon
                iconName="schedule"
                onClick={props.onScheduleButtonClick}
              />
            </ActionButton>
          )}

          {props.visitSiteButton && !isEmpty(props.siteLink) && (
            <a
              href={addHttp(props.siteLink.toLowerCase())}
              target="_blank"
              onClick={handleOutBoundLink}
            >
              <ActionButton rightSide={props.rightSide}>
                <ClassTimeButton secondary noMarginBottom label="Visit Site" icon iconName="web" />
              </ActionButton>
            </a>
          )}
        </Fragment>
      )}
    </ActionButtonsContainer>
  );
};

ActionButtons.propTypes = {
  onCallUsButtonClick: PropTypes.func,
  onEmailButtonClick: PropTypes.func,
  onPricingButtonClick: PropTypes.func,
  onScheduleButtonClick: PropTypes.func,
  onVisitSiteButtonClick: PropTypes.func,
  emailUsButton: PropTypes.bool,
  callUsButton: PropTypes.bool,
  pricingButton: PropTypes.bool,
  scheduleButton: PropTypes.bool,
  visitSiteButton: PropTypes.bool,
  rightSide: PropTypes.bool,
  editButton: PropTypes.element,
};

ActionButtons.defaultProps = {
  editButton: false,
  rightSide: false,
  emailUsButton: true,
  callUsButton: true,
  pricingButton: true,
  scheduleButton: false,
  visitSiteButton: false,
};

export default ActionButtons;
