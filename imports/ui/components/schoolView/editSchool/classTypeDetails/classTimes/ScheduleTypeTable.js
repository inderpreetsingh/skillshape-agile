"use strict"
import React from "react"
import { createTable } from '/imports/util';

const getTableProps = () => {
  const tableProps = {
    className: "schedule-type-table",
  }
  const tableHeaderProps = {
    adjustForCheckbox: false,
    displaySelectAll: false,
  }
  const tableRowProps = {}
  const tableHeaderColumns = [{
    columnName: "",
    tooltip: "",
    className: "wd-50"
  },{
    columnName: "Day",
    tooltip: "",
    className: "wd-100"
  }, {
    columnName: "Start Time",
    tooltip: "",
    className: "wd-100"
  }, {
    columnName: "Duration",
    tooltip: "",
    className: "wd-150"
  }, {
    columnName: "Room",
    tooltip: "",
    className: "wd-211"
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

export const ScheduleTypeTable = createTable(getTableProps())

export const scheduleDetails = {
  "Monday": {
    startTime: {},
    duration: "",
    roomId: null,
    isSeleted: false,
    day: 1,
  },
  "Tuesday": {
    startTime: {},
    duration: "",
    roomId: null,
    isSeleted: false,
    day: 2,
  },
  "Wednesday": {
    startTime: {},
    duration: "",
    roomId: null,
    isSeleted: false,
    day: 3,
  },
  "Thursday": {
    startTime: {},
    duration: "",
    roomId: null,
    isSeleted: false,
    day: 4,
  },
  "Friday": {
    startTime: {},
    duration: "",
    roomId: null,
    isSeleted: false,
    day: 5,
  },
  "Saturday": {
    startTime: {},
    duration: "",
    roomId: null,
    isSeleted: false,
    day: 6,
  },
  "Sunday": {
    startTime: {},
    duration: "",
    roomId: null,
    isSeleted: false,
    day: 7,
  }
}