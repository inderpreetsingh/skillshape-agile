import React from "react";
// import Meteor from "meteor/meteor";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router";

import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import {
  rhythmDiv,
  mobile,
  tablet
} from "/imports/ui/components/landing/components/jss/helpers.js";

// console.log(Meteor, Meteor.absoluteUrl);
//const APP_URL = Meteor.absoluteUrl();

const OuterWrapper = styled.div`
  width: 100%;
  display: flex;
`;

const Wrapper = styled.div`
  padding: 0 ${rhythmDiv * 2}px;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: flex-start;
  margin: 0 auto ${rhythmDiv * 3}px; auto;

  @media screen and (min-width: ${mobile - 100}px) {
    width: 100%;
    justify-content: space-evenly;
  }

  @media screen and (min-width: ${tablet}px) {
    justify-content: flex-end;
    padding: 0 ${rhythmDiv}px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;

  @media screen and (min-width: ${tablet}px) {
    ${props => props.marginRight && `margin-right: ${rhythmDiv}px;`};
  }

  @media screen and (min-width: 300px) and (max-width: 400px) {
    margin-right: ${rhythmDiv}px;
  }
`;

const ActionButtons = props => (
  <OuterWrapper>
    <Wrapper>
      <ButtonWrapper marginRight>
        <PrimaryButton
          noMarginRight
          icon
          iconName="class"
          label="Visit ClassType"
        />
      </ButtonWrapper>
      <ButtonWrapper marginRight>
        <PrimaryButton
          noMarginRight
          icon
          iconName="school"
          label="Visit School"
        />
      </ButtonWrapper>
      {/*<Link
        to={
          "#" ||
          `/classType/my_class/${props.classTypeId}`
        }
        target="_blank"
      >
      </Link>
      <Link
        to={"#" || `/schools/${props.schoolName}`}
        target="_blank"
      >

      </Link> */}

      {/*<ButtonWrapper>
        <PrimaryButton
          label="Schedule"
          icon
          iconName="schedule"
          onClick={props.onScheduleButtonClick}
        />
      </ButtonWrapper> */}
    </Wrapper>
  </OuterWrapper>
);

ActionButtons.propTypes = {
  classTypeId: PropTypes.string,
  schoolName: PropTypes.string,
  onScheduleButtonClick: PropTypes.func
};

ActionButtons.defaultProps = {};

export default ActionButtons;
