"use strict";
import React from "react";
import { createTable } from "/imports/util";

const getTableProps = () => {
  const tableProps = {
    className: "table-view"
  };
  const tableHeaderProps = {
    adjustForCheckbox: false,
    displaySelectAll: false
  };
  const tableRowProps = {
    className: "table-header"
  };
  const tableHeaderColumns = [
    {
      columnName: "Type",
      tooltip: "",
      className: "wd-150"
    },
    {
      columnName: "Net",
      tooltip: "",
      className: "wd-150"
    },
    {
      columnName: "Amount",
      tooltip: "",
      className: "wd-150"
    },
    {
      columnName: "Fee",
      tooltip: "",
      className: "wd-211"
    },
    {
      columnName: "Description",
      tooltip: "",
      className: "wd-100"
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

export const TransactionDetailsTable = createTable(getTableProps());
