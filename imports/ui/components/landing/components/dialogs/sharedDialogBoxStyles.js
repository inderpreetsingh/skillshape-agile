import styled from 'styled-components';

import { Heading } from '/imports/ui/components/landing/components/jss/helpers.js';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

export const DialogTitleContainer = styled.div`
  ${helpers.flexCenter};
  padding: 0 ${helpers.rhythmDiv}px;
`;

export const DialogTitleWrapper = styled.h1`
  ${helpers.flexCenter};
  font-family: ${helpers.specialFont};
  font-weight: 500;
  width: 100%;
  margin: 0;

  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: ${helpers.baseFontSize * 1.25}px;
  }
`;

