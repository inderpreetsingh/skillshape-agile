
import { createTable } from '/imports/util';

const getTableProps = () => {
  const tableProps = {
    className: 'schedule-type-table',
  };
  const tableHeaderProps = {
    adjustForCheckbox: false,
    displaySelectAll: false,
  };
  const tableRowProps = {};
  const tableHeaderColumns = [
    {
      columnName: 'File Name',
      tooltip: '',
      className: 'wd-211',
    },
    {
      columnName: 'Status',
      tooltip: '',
      className: 'wd-150',
    },
    {
      columnName: 'Total Record',
      tooltip: '',
      className: 'wd-100',
    },
    {
      columnName: 'Success Count',
      tooltip: '',
      className: 'wd-100',
    },
    {
      columnName: 'Error Count',
      tooltip: '',
      className: 'wd-100',
    },
    {
      columnName: 'Upload Date',
      tooltip: '',
      className: 'wd-150',
    },
  ];
  const tableHeaderColumnProps = {};
  const tableBodyProps = {
    displayRowCheckbox: false,
  };
  const tableComponentProps = {
    tableProps,
    tableHeaderProps,
    tableRowProps,
    tableHeaderColumns,
    tableHeaderColumnProps,
    tableBodyProps,
  };
  return tableComponentProps;
};

export const ImportLogTable = createTable(getTableProps());
