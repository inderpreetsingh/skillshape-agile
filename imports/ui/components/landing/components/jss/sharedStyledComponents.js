import styled from 'styled-components';
import { TableCell, TableRow } from "material-ui/Table";
import { getContainerMaxWidth } from '/imports/util';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

export const GenericText = styled.p`
	font-family: ${helpers.specialFont};
	line-height: 1;
	margin: 0;
	text-align: ${(props) => props.align || 'left'};
	color: ${(props) => props.color || helpers.black};
	margin-bottom: ${(props) => props.marginBottom || helpers.rhythmDiv}px;
`;

export const Text = GenericText.extend`
	font-weight: 400;
	font-size: ${(props) => props.fontSize || helpers.baseFontSize}px;
`;

export const Heading = GenericText.withComponent('h2').extend`
  font-weight: ${(props) => props.weight || 500};
  font-size: ${(props) => props.fontSize || helpers.baseFontSize * 2}px;
  
  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: ${helpers.baseFontSize * 1.5}px;
  }
`;

export const SlantedHeading = Heading.extend`
	font-weight: 300;
	font-style: italic;
`;

export const SubHeading = GenericText.withComponent('h3').extend`
  font-weight: ${(props) => props.weight || 500};
  font-size: ${(props) => props.fontSize || helpers.baseFontSize * 1.5}px;
  margin-bottom: ${helpers.rhythmDiv}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: ${helpers.baseFontSize * 1.25}px;
  }
`;

/* We will describe for large screen what action we wanna perform
  based on that our small screen will respond
*/
export const ToggleVisibility = styled.div`
  display: ${props => props.show ? 'flex' : 'none'};

  @media screen and (max-width: ${helpers.mobile}px) {
	display: ${props => props.show ? 'none' : 'flex'};
  }
`;


export const Capitalize = styled.span`text-transform: capitalize;`;

export const Bold = styled.span`font-weight: 500;`;

export const Italic = styled.span`font-style: italic;`;

// GRID COMPONENTS
export const GridMaxWidthWrapper = styled.div`
	max-width: ${(props) => getContainerMaxWidth(props.cardWidth, props.spacing, 4)}px;
	margin: 0 auto;

	@media screen and (max-width: ${(props) => getContainerMaxWidth(props.cardWidth, props.spacing, 4)}px) {
		max-width: ${(props) => getContainerMaxWidth(props.cardWidth, props.spacing, 3)}px;
	}

	@media screen and (max-width: ${(props) => getContainerMaxWidth(props.cardWidth, props.spacing, 3)}px) {
		max-width: ${(props) => getContainerMaxWidth(props.cardWidth, props.spacing, 2)}px;
	}

	@media screen and (max-width: ${(props) => getContainerMaxWidth(props.cardWidth, props.spacing, 2)}px) {
		max-width: 600px;
	}
`;

export const GridContainer = styled.div`
	${helpers.flexCenter} justify-content: flex-start;
	flex-wrap: wrap;
`;

export const GridItem = styled.div`
	padding: ${(props) => (props.spacing ? props.spacing / 2 : '16')}px;
	flex-grow: 1;
	width: 100%;
	max-width: ${(props) => (props.inPopUp ? '100%' : props.cardWidth + props.spacing + 'px')};

	@media screen and (max-width: ${(props) => getContainerMaxWidth(props.cardWidth, props.spacing, 2)}px) {
		max-width: ${(props) => (props.inPopUp ? '100%' : props.cardWidth + 'px')};
	}

	media screen and(max-width: 600px) {
		max-width: ${(props) => (props.inPopUp ? '100%' : props.cardWidth + props.spacing + 'px')};
	}
`;

// Flex Table Components
export const SSTableRow = styled(TableRow)`
   @media screen and (max-width: ${props => props.listViewBreakPnt || helpers.tablet}px) {
    border-bottom: 1px solid ${helpers.darkBgColor}; 

    :first-of-type {
        border-top: 1px solid ${helpers.darkBgColor};   
    }
   }   
`;

export const SSTableCell = styled(TableCell)`
  overflow-wrap: break-word;
  word-wrap: break-word;
  padding: ${helpers.rhythmDiv * 2}px;
  font-family: ${helpers.specialFont};

  @media screen and (max-width: ${props => props.listViewBreakPnt || helpers.tablet}px) {
    display: block;
    border: none;

    ::before {
      content: attr(data-th) ": ";
      font-weight: 600;
      font-size: inherit;
      margin-right: ${helpers.rhythmDiv}px;
      display: inline-block;  
    }
  }
`;

export const length = {
	w211: {
		width: 211
	},
	w100: {
		width: 100
	},
	w150: {
		width: 150
	}
};