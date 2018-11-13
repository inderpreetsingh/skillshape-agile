"use strict"
import React from "react"
import './tableCss'
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from 'material-ui/Table';

const appendTableColumns = (tableRows) => {
  return React.children.map(tableRows, (tableRow) => {
    if (!React.isValidElement(tableRow)) return tableRow;
  })

}

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
    <TableHead {...tableHeaderProps}>
      <TableRow {...tableRowProps}>
        {
          tableHeaderColumns && Array.isArray(tableHeaderColumns) && tableHeaderColumns.map(({ tooltip, columnName, className }, id) => (
            <TableCell key={id} className={className} tooltip={tooltip} {...tableHeaderColumnProps}>{columnName}</TableCell>
          ))
        }
      </TableRow>
    </TableHead>
    <TableBody {...tableBodyProps}>
      {tableRows}
    </TableBody>
  </Table>
)
