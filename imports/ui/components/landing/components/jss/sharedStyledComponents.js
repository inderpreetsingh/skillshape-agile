import styled from "styled-components";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

export const GenericText = styled.p`
  font-family: ${helpers.specialFont}px;
  line-height: 1;
  margin: 0;
`;

export const Text = GenericText.extend`
  font-weight: 400;
  color: ${props => props.color || helpers.black};
  font-size: ${props => props.fontSize || helpers.baseFontSize}px;
  margin-bottom: ${props => props.marginBottom || helpers.rhythmDiv}px;
`;

export const Heading = GenericText.withComponent("h2").extend`
  font-weight: ${props => props.weight || 500};
  font-size: ${props => props.fontSize || helpers.baseFontSize * 2}px;
  color: ${props => props.color || helpers.black};

  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: ${helpers.baseFontSize * 1.5}px;
  }
`;

export const SlantedHeading = Heading.extend`
  font-weight: 300;
  font-style: italic;
`;

export const SubHeading = GenericText.withComponent("h3").extend`
  font-weight: ${props => props.weight || 500};
  font-size: ${props => props.fontSize || helpers.baseFontSize * 1.5}px;
  color: ${props => props.color || helpers.black};

  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: ${helpers.baseFontSize * 1.25}px;
  }
`;

export const Capitalize = styled.span`
  text-transform: capitalize;
`;

export const Bold = styled.span`
  font-weight: 500;
`;
