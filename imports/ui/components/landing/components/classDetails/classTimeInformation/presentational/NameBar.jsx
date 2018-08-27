import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";

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
    margin-right: ${rhythmDiv}px;
  }
`;

const NameBar = props => {
  return (
    <Wrapper>
      <Left>
        <ClassTimeName>
          {props.classTimeName} : {props.classTypeName}
        </ClassTimeName>
        {props.schoolName && (
          <SubHeading color={secondaryTextColor}>
            <Capitalize>{props.schoolName}</Capitalize>
          </SubHeading>
        )}
      </Left>
      <Right>
        <PrimaryButton
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
