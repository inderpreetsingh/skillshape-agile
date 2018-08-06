import React from "react";
import Meteor from "meteor/meteor";
import styled from "styled-components";
import { Link } from "react-router";

import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const APP_URL = Meteor.absoluteUrl();

const Wrapper = styled.div`
  padding: ${helpers.rhythmDiv * 2}px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const ActionButtons = props => (
  <Wrapper>
    <Link
      to={`${APP_URL}/classType/my_class/${props.classTypeId}`}
      target="_blank"
    >
      <PrimaryButton label="Visit ClassType" />
    </Link>
    <Link to={`${APP_URL}/schools/${props.schoolName}`} target="_blank">
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
