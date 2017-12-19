"use strict"

import React from "react"
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from "material-ui/Table"


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
      bodyStyle={{overflow:'visible'}}
    >
      <TableHeader {...tableHeaderProps}>
        <TableRow {...tableRowProps}>
          {
            tableHeaderColumns && Array.isArray(tableHeaderColumns) && tableHeaderColumns.map(({ tooltip, columnName, className }, id) => (
              <TableHeaderColumn key={id} className={className}  tooltip={tooltip} {...tableHeaderColumnProps}>{columnName}</TableHeaderColumn>
            ))
          }
        </TableRow>
      </TableHeader>
      <TableBody {...tableBodyProps}>
        {tableRows}
      </TableBody>
    </Table>
  )
