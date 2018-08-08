import React from "react";
// import Meteor from "meteor/meteor";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router";

import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import {
  rhythmDiv,
  mobile
} from "/imports/ui/components/landing/components/jss/helpers.js";

// console.log(Meteor, Meteor.absoluteUrl);
//const APP_URL = Meteor.absoluteUrl();

const Wrapper = styled.div`
  padding: 0 ${rhythmDiv * 2}px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: ${rhythmDiv * 4}px;

  @media screen and (max-width: ${mobile}px) {
    justify-content: flex-start;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
`;

const ActionButtons = props => (
  <Wrapper>
    <Link
      to={`${Meteor.absoluteUrl()}/classType/my_class/${props.classTypeId}`}
      target="_blank"
    >
      <ButtonWrapper>
        <PrimaryButton label="Visit ClassType" />
      </ButtonWrapper>
    </Link>
    <Link
      to={`${Meteor.absoluteUrl()}/schools/${props.schoolName}`}
      target="_blank"
    >
      <ButtonWrapper>
        <PrimaryButton label="Visit School" />
      </ButtonWrapper>
    </Link>

    <ButtonWrapper>
      <PrimaryButton
        label="Schedule"
        icon
        iconName="schedule"
        onClick={props.onScheduleButtonClick}
      />
    </ButtonWrapper>
  </Wrapper>
);

ActionButtons.propTypes = {
  classTypeId: PropTypes.string,
  schoolName: PropTypes.string,
  onScheduleButtonClick: PropTypes.func
};

ActionButtons.defaultProps = {};

export default ActionButtons;
