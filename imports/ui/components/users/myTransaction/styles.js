import styled from 'styled-components';
import { TableCell, TableRow } from "material-ui/Table";

import {
    rhythmDiv,
    specialFont,
    mobile,
    tablet,
    baseFontSize,
    darkBgColor
} from '/imports/ui/components/landing/components/jss/helpers.js';

export const FncTableRow = styled(TableRow)`
   @media screen and (max-width: ${tablet}px) {
    border-bottom: 1px solid ${darkBgColor}; 

    :first-of-type {
        border-top: 1px solid ${darkBgColor};   
    }
   }   
`;

export const FncTableCell = styled(TableCell)`
  overflow-wrap: break-word;
  word-wrap: break-word;
  padding: ${rhythmDiv * 2}px;
  font-family: ${specialFont};

  @media screen and (max-width: ${tablet}px) {
    display: block;
    border: none;

    ::before {
      content: attr(data-th) ": ";
      font-weight: 600;
      font-size: inherit;
      margin-right: ${rhythmDiv}px;
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