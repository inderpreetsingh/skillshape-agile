"use strict"
import React from "react";
import { withStyles } from 'material-ui/styles';
import styled from 'styled-components';

import { mobile, specialFont, rhythmDiv } from '/imports/ui/components/landing/components/jss/helpers.js';
import './tableCss';

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from 'material-ui/Table';

const MyTableHead = styled(TableHead)`
  @media screen and (max-width: ${props => props.listViewBreakPnt || mobile}px) {
    ${props => props.responsive && 'display: none'}
  }
`;

const MyTableCell = withStyles(theme => ({
  head: {
    padding: rhythmDiv * 2,
    fontFamily: specialFont,
    fontSize: 18,
    fontWeight: 500,
    background: 'white'
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

export const createTable = ({
  tableProps,
  tableHeaderProps,
  tableRowProps,
  tableHeaderColumns,
  tableHeaderColumnProps,
  tableBodyProps,
}) => ({ children: tableRows, ...props }) => (
  <Table
    {...tableProps}
    {...props}
    bodyStyle={{ overflow: tableProps.horizontalBar ? 'none' : 'visible' }}
  >
    <MyTableHead {...tableHeaderProps}>
      <TableRow {...tableRowProps}>
        {
          tableHeaderColumns &&
          Array.isArray(tableHeaderColumns) &&
          tableHeaderColumns.map(({ tooltip, columnName, className }, id) => (
            <MyTableCell key={id} className={className} tooltip={tooltip} {...tableHeaderColumnProps}>{columnName}</MyTableCell>
          ))
        }
      </TableRow>
    </MyTableHead>
    <TableBody {...tableBodyProps}>
      {tableRows}
    </TableBody>
  </Table>
)
