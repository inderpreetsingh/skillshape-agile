"use strict"
import React from "react";
import styled from 'styled-components';

import { mobile } from '/imports/ui/components/landing/components/jss/helpers.js';
import './tableCss';

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from 'material-ui/Table';

const MyTableHead = styled(TableHead)`
  @media screen and (max-width: ${mobile}px) {
    ${props => props.responsive && 'display: none'}
  }
`

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
    bodyStyle={{ overflow: 'visible' }}
  >
    <MyTableHead {...tableHeaderProps}>
      <TableRow {...tableRowProps}>
        {
          tableHeaderColumns && Array.isArray(tableHeaderColumns) && tableHeaderColumns.map(({ tooltip, columnName, className }, id) => (
            <TableCell key={id} className={className} tooltip={tooltip} {...tableHeaderColumnProps}>{columnName}</TableCell>
          ))
        }
      </TableRow>
    </MyTableHead>
    <TableBody {...tableBodyProps}>
      {tableRows}
    </TableBody>
  </Table>
)
