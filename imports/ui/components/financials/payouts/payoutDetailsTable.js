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
    responsive: true,
  };
  const tableRowProps = {
    className: "table-header"
  };
  const tableHeaderColumns = [
    {
      columnName: "Amount",
      tooltip: "",
      // className: "wd-150"
    },
    {
      columnName: "Bank/Card",
      tooltip: "",
      // className: "wd-211"
    },
    {
      columnName: "Date",
      tooltip: "",
      // className: "wd-100"
    }
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

export const PayoutDetailsTable = createTable(getTableProps());
