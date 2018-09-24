"use strict";
import React from "react";
import { createTable } from "/imports/util";

const getTableProps = () => {
    console.log("this",this)
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
      className: "wd-150"
    },
    {
      columnName: "Class Type Name",
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
      className: "wd-211"
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

export const ClassTypeTableRender = createTable(getTableProps());
