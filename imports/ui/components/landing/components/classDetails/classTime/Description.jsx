import React from "react";
import styled from "styled-components";

import { Text } from "/imports/ui/components/landing/components/classDetails/classTime/Description.jsx";
import { rhythmDiv } from "/imports/ui/components/landing/components/jss/helpers.js";

const Wrapper = styled.div`
  padding: ${helpers.rhythmDiv * 2}px;
  padding-top: ${helpers.rhythmDiv}px;
`;

const Description = props => (
  <Wrapper>
    <Text>{props.description}</Text>
  </Wrapper>
);

export default Description;
