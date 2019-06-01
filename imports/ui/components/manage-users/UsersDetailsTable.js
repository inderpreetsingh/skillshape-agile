
import { createTable } from '/imports/util';

const getTableProps = () => {
  const tableProps = {
    className: 'table-view',
  };
  const tableHeaderProps = {
    adjustForCheckbox: false,
    displaySelectAll: false,
  };
  const tableRowProps = {
    className: 'table-header',
  };
  const tableHeaderColumns = [
    {
      columnName: 'Name',
      tooltip: '',
      className: 'wd-150',
    },
    {
      columnName: 'Email',
      tooltip: '',
      className: 'wd-211',
    },
    {
      columnName: 'CreatedAt',
      tooltip: '',
      className: 'wd-100',
    },
    {
      columnName: 'Roles',
      tooltip: '',
      className: 'wd-100',
    },
  ];
  const tableHeaderColumnProps = {
    className: 'table-column',
  };
  const tableBodyProps = {
    displayRowCheckbox: false,
    className: 'table-body',
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

export const UsersDetailsTable = createTable(getTableProps());
