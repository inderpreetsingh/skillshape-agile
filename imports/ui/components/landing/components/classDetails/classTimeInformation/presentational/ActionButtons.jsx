import React from "react";
import Meteor from "meteor/meteor";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router";

import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

// console.log(Meteor, Meteor.absoluteUrl);
//const APP_URL = Meteor.absoluteUrl();

const Wrapper = styled.div`
  padding: ${helpers.rhythmDiv * 2}px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const ActionButtons = props => (
  <Wrapper>
    <Link
      to={`${Meteor.absoluteUrl()}/classType/my_class/${props.classTypeId}`}
      target="_blank"
    >
      <PrimaryButton label="Visit ClassType" />
    </Link>
    <Link
      to={`${Meteor.absoluteUrl()}/schools/${props.schoolName}`}
      target="_blank"
    >
      <PrimaryButton label="Visit School" />
    </Link>
    <PrimaryButton
      label="Schedule"
      icon
      iconName="schedule"
      onClick={props.onScheduleButtonClick}
    />
  </Wrapper>
);

ActionButtons.propTypes = {
  classTypeId: PropTypes.string,
  schoolName: PropTypes.string,
  onScheduleButtonClick: PropTypes.func
};

ActionButtons.defaultProps = {};

export default ActionButtons;
