import React from "react";
import styled from "styled-components";

import { Text } from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import {
  rhythmDiv,
  baseFontSize
} from "/imports/ui/components/landing/components/jss/helpers.js";

const Wrapper = styled.div`
  padding: ${rhythmDiv * 2}px;
  padding-top: 0;
`;

const Content = Text.extend`
  font-style: italic;
  font-weight: 300;
  font-size: ${baseFontSize * 1.25}px;
`;

const Description = props => (
  <Wrapper>
    <Content>{props.description}</Content>
  </Wrapper>
);

export default Description;
