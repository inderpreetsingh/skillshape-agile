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
      columnName: "Index",
      tooltip: "",
      // className: "wd-150"
    },
    {
      columnName: "User Name",
      tooltip: "",
      // className: "wd-150"
    },
    {
      columnName: "Package Name",
      tooltip: "",
      // className: "wd-150"
    },
    {
      columnName: "Package Type",
      tooltip: "",
      // className: "wd-150"
    },
    {
      columnName: "Amount",
      tooltip: "",
      // className: "wd-150"
    },
    {
      columnName: "Package Starts On",
      tooltip: "",
      // className: "wd-211"
    },
    {
      columnName: " Payment Method",
      tooltip: "",
      // className: "wd-100"
    },
    {
      columnName: "Expiration",
      tooltip: "",
      // className: "wd-100"
    },
    {
      columnName: "Classes Left",
      tooltip: "",
      // className: "wd-100"
    },
    {
      columnName: "Status",
      tooltip: "",
      // className: "wd-100"
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
