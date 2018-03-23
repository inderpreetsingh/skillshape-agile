"use strict"
import React from "react"
import { createTable } from '/imports/util';

const getTableProps = () => {
  const tableProps = {
    className: "class-price-table",
  }
  const tableHeaderProps = {
    adjustForCheckbox: false,
    displaySelectAll: false,
  }
  const tableRowProps = {}
  const tableHeaderColumns = [{
    columnName: "Package Name",
    tooltip: "",
  },{
    columnName: "Cost",
    tooltip: "",
  }, {
    columnName: "Class Type includes",
    tooltip: "",
  }, {
    columnName: "Number of Classes",
    tooltip: "",
  }, {
    columnName: "Expires",
    tooltip: "",
  }]
  const tableHeaderColumnProps = {
  }
  const tableBodyProps = {
    displayRowCheckbox: false,
  }
  const tableComponentProps = {
    tableProps,
    tableHeaderProps,
    tableRowProps,
    tableHeaderColumns,
    tableHeaderColumnProps,
    tableBodyProps,
  }
  return tableComponentProps
}

export const ClassPriceTable = createTable(getTableProps())
