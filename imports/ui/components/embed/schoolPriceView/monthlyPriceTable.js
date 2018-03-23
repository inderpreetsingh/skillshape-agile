"use strict"
import React from "react"
import { createTable } from '/imports/util';

const getTableProps = () => {
  const tableProps = {
    className: "monthly-price-table",
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
    columnName: "Payment Type",
    tooltip: "",
  }, {
    columnName: "Class Type includes",
    tooltip: "",
  }, {
    columnName: "1 month",
    tooltip: "",
  }, {
    columnName: "3 month",
    tooltip: "",
  }, {
    columnName: "3 month",
    tooltip: "",
  }, {
    columnName: "6 month",
    tooltip: "",
  }, {
    columnName: "1 year",
    tooltip: "",
  }, {
    columnName: "Life Time Cost",
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

export const MonthlyPriceTable = createTable(getTableProps())
