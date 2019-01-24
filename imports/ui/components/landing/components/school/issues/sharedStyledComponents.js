import React from 'react';
import styled from 'styled-components';

import {SOLUTION_BOX_WIDTH,CARD_HEIGHT} from './constants.js';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';


export const SolutionCards = styled.div`
	max-width: ${SOLUTION_BOX_WIDTH + 100}px;
	height: ${CARD_HEIGHT + 20}px;
	display: flex;
	justify-content: center;
	flex-grow: 1;
	width: 100%;
	padding: 0 ${helpers.rhythmDiv * 2}px;
	margin-top: ${helpers.rhythmDiv * 2}px;

	@media screen and (max-width: ${helpers.tablet + 50}px) {
		max-width: 500px;
		height: 800px;
		flex-direction: column;
		justify-content: flex-start;
	}

	@media screen and (max-width: ${helpers.mobile}px) {
		min-height: 800px;
	}
`;

export const Solutions = styled.div`
	max-width: ${SOLUTION_BOX_WIDTH}px;
	height: ${CARD_HEIGHT}px;
	width: 100%;
	display: flex;
	justify-content: center;
	padding: 0 ${helpers.rhythmDiv * 2}px;
	position: relative;
	margin: 0;

	@media screen and (max-width: ${helpers.tablet + 50}px) {
		display: none;
	}
`;

export const SolutionGfx = styled.img`	
  width: 100%;
  border-radius: 10px;
  background-position: 50% 50%; 
  box-shadow: ${helpers.buttonBoxShadow}; 	
`;


