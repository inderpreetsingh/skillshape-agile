import styled from 'styled-components';
import { SubHeading } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

export const SectionTitle = SubHeading.extend`
    font-size: ${helpers.baseFontSize * 1.5}px;
    width: 100%;
	text-align: center;
	font-weight: 300;
    font-style: italic;
    word-break: break-all;
    ${props => props.bgColor && `background-color: ${props.bgColor}`};

	@media screen and (max-width: ${helpers.mobile}px) {
        font-size: ${helpers.baseFontSize * 1.5}px;
        margin-bottom: ${helpers.rhythmDiv * 2}px;
	}
`;