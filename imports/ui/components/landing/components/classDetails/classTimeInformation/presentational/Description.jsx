import React from "react";
import styled from "styled-components";

import { Text } from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import { rhythmDiv } from "/imports/ui/components/landing/components/jss/helpers.js";

const Wrapper = styled.div`
  padding: ${rhythmDiv * 2}px;
  padding-top: ${rhythmDiv}px;
`;

const Description = props => (
  <Wrapper>
    <Text>{props.description}</Text>
  </Wrapper>
);

export default Description;
