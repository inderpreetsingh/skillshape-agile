import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";

import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import {
  Text,
  Heading,
  Capitialize
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

const Right = styled.div``;

const NameBar = props => {
  return (
    <Wrapper>
      <Left>
        <Heading>
          <Capitialize>
            {props.classTimeName} : {props.classTypeName}
          </Capitialize>
        </Heading>
        {props.schoolName && (
          <Heading color={helpers.textColor}>{props.schoolName}</Heading>
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
