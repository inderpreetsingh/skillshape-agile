"use strict";
import React from "react";
import { createTable } from "/imports/util";

export const getTableProps = () => {
  const tableProps = {
    className: "table-view"
  };
  const tableHeaderProps = {
    adjustForCheckbox: false,
    displaySelectAll: false,
    responsive: true
  };
  const tableRowProps = {
    className: "table-header"
  };
  const tableHeaderColumns = [
    {
      columnName: "User Name",
      tooltip: "",
      // className: "wd-150"
    },
    {
      columnName: "Starts On",
      tooltip: "",
      // className: "wd-211"
    },
    {
      columnName: "Transaction Type",
      tooltip: "",
      // className: "wd-150"
    },
    {
      columnName: " Payment Method",
      tooltip: "",
      // className: "wd-100"
    },
    {
      columnName: "Amount",
      tooltip: "",
      // className: "wd-150"
    },
    {
      columnName: "School Name",
      tooltip: "",
      // className: "wd-100"
    },
    {
      columnName: "Classes",
      tooltip: "",
      // className: "wd-100"
    },
    {
      columnName: "Package Name",
      tooltip: "",
      // className: "wd-150"
    },
  ];
  const tableHeaderColumnProps = {
    className: "table-column"
  };
  const tableBodyProps = {
    displayRowCheckbox: false,
    className: "table-body"
  };
  const tableComponentProps = {
    tableProps,
    tableHeaderProps,
    tableRowProps,
    tableHeaderColumns,
    tableHeaderColumnProps,
    tableBodyProps
  };
  return tableComponentProps;
};

export const TransactionDetailsTable = createTable(getTableProps());
