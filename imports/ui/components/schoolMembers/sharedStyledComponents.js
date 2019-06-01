import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import { SubHeading } from '/imports/ui/components/landing/components/jss/sharedStyledComponents';

export const SectionTitle = SubHeading.extend`
    font-size: font-size: ${helpers.baseFontSize * 1.5}px;
    width: 100%;
	text-align: center;
	font-weight: 400;
    font-style: italic;
    word-break: break-all;
    font-family: ${helpers.commonFont};
    ${props => props.bgColor && `background-color: ${props.bgColor}`};

	@media screen and (max-width: ${helpers.mobile}px) {
        font-size: ${helpers.baseFontSize * 1.5}px;
        margin-bottom: ${helpers.rhythmDiv * 2}px;
	}
`;
