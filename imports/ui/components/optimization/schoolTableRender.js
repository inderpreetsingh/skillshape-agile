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
      columnName: "Index",
      tooltip: "",
      className: "wd-64"
    },
    {
      columnName: "School Name",
      tooltip: "",
      className: "wd-150"
    },
    {
      columnName: "Status",
      tooltip: "",
      className: "wd-211"
    },
    {
      columnName: "Image Link",
      tooltip: "",
      className: "wd-121"
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

export const SchoolTableRender = createTable(getTableProps());
