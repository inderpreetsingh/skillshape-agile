import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";

import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import {
  Text,
  Heading,
  SubHeading,
  Capitalize
} from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";

const Wrapper = styled.div`
  /* prettier-ignore */
  ${helpers.flexHorizontalSpaceBetween}
  padding: ${helpers.rhythmDiv * 2}px;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
`;

const Right = styled.div`
  flex-shrink: 0;
`;

const NameBar = props => {
  return (
    <Wrapper>
      <Left>
        <Heading weight={400}>
          <Capitalize>
            {props.classTimeName} : {props.classTypeName}
          </Capitalize>
        </Heading>
        {props.schoolName && (
          <SubHeading color={helpers.secondaryTextColor}>
            <Capitalize>{props.schoolName}</Capitalize>
          </SubHeading>
        )}
      </Left>
      <Right>
        <PrimaryButton label="join class" />
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
