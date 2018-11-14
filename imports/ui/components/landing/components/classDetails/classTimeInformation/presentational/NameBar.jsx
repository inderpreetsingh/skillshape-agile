import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
// import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import ClassTimeButton from "/imports/ui/components/landing/components/buttons/ClassTimeButton.jsx";

import {
  tablet,
  rhythmDiv,
  secondaryTextColor,
  flexHorizontalSpaceBetween
} from "/imports/ui/components/landing/components/jss/helpers.js";

import {
  Text,
  Heading,
  SubHeading,
  Capitalize
} from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";

const Wrapper = styled.div`
  /* prettier-ignore */
  ${flexHorizontalSpaceBetween}
  padding: ${rhythmDiv * 2}px;
  padding-bottom: ${rhythmDiv}px;

  @media screen and (min-width: ${tablet}px) {
    padding: 0 ${rhythmDiv * 2}px ${rhythmDiv}px ${rhythmDiv * 2}px;
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
`;

const Right = styled.div`
  flex-shrink: 0;
`;

const ClassTimeName = Heading.extend`
  font-weight: 400;
  text-transform: capitalize;

  @media screen and (min-width: ${tablet}px) {
    padding-top: ${rhythmDiv}px;
    margin-right: ${rhythmDiv}px;
  }
`;

const NameBar = props => {
  return (
    <Wrapper>
      <Left>
        <ClassTimeName>
          {props.title}
        </ClassTimeName>
        {props.schoolName && (
          <SubHeading color={secondaryTextColor}>
            <Capitalize>{props.schoolName}</Capitalize>
          </SubHeading>
        )}
      </Left>
      <Right>
        <ClassTimeButton
          icon
          iconName="add_circle_outline"
          label="Join class"
          onClick={props.onJoinClassButtonClick}
        />
      </Right>
    </Wrapper>
  );
};

NameBar.propTypes = {
  classTimeName: PropTypes.string,
  classTypeName: PropTypes.string,
  schoolName: PropTypes.string
};

export default NameBar;
