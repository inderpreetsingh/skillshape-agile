import React from "react";
import styled from "styled-components";

import { Text } from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import {
  rhythmDiv,
  baseFontSize
} from "/imports/ui/components/landing/components/jss/helpers.js";

const Wrapper = styled.div`
  padding: 0 ${rhythmDiv * 2}px;
  margin-bottom: ${rhythmDiv * 2}px;
`;

const Content = Text.extend`
  font-style: italic;
  font-weight: 300;
  font-size: 18px;
`;

const Description = props => (
  <Wrapper>
    <Content>{props.description}</Content>
  </Wrapper>
);

export default Description;
