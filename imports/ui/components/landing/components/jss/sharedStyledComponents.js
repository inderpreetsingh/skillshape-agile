import styled from "styled-components";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

export const GenericText = styled.p`
  font-family: ${helpers.specialFont}px;
  line-height: 1;
`;

export const Text = GenericText.extend`
  font-weight: 400;
  color: ${props => props.color || helpers.black};
  font-size: ${props => props.fontSize || helpers.baseFontSize}px;
  margin-bottom: ${props => props.marginBottom || helpers.rhythmDiv}px;
`;

export const Heading = GenericText.withComponent("h2").extend`
  font-weight: 500;
  font-size: ${props => props.fontSize || helpers.baseFontSize * 2}px;
  color: ${props => props.color || helpers.black};
`;

export const SlantedHeading = Heading.extend`
  font-weight: 300;
  font-style: italic;
`;

export const SubHeading = GenericText.withComponent("h3").extend`
  font-weight: 400;
  font-size: ${props => props.fontSize || helpers.baseFontSize * 1.25}px;
  color: ${props => props.color || helpers.black};
`;

export const Capitialize = styled.span`
  text-transform: Capitialize;
`;

export const Bold = styled.span`
  font-weight: 500;
`;
