import React from 'react';
import styled from 'styled-components';

import { SOLUTION_BOX_WIDTH, CARD_HEIGHT } from './constants.js';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';


export const SolutionGfx = styled.img`	
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 10px;
  background-position: 50% 50%; 
  box-shadow: ${helpers.buttonBoxShadow}; 	
`;


