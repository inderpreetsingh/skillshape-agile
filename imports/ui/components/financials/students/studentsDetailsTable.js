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
      columnName: "Customer",
      tooltip: "",
      className: "wd-150"
    },
    {
      columnName: "Package Name",
      tooltip: "",
      className: "wd-150"
    },
    {
      columnName: "Package Type",
      tooltip: "",
      className: "wd-150"
    },
    {
      columnName: "Card",
      tooltip: "",
      className: "wd-150"
    },
    {
      columnName: "Created",
      tooltip: "",
      className: "wd-150"
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

export const StudentsDetailsTable = createTable(getTableProps());
