import styled from 'styled-components';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';

export const SolutionGfx = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 10px;
  background-position: 50% 50%;
  box-shadow: ${helpers.buttonBoxShadow};
`;
