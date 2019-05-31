import { tablet } from '/imports/ui/components/landing/components/jss/helpers';
import { createTable } from '/imports/util';

export const getTableProps = (schoolView) => {
  const tableProps = {
    // className: "table-view"
    horizontalBar: true,
  };
  const tableHeaderProps = {
    adjustForCheckbox: false,
    displaySelectAll: false,
    responsive: true,
    listViewBreakPnt: tablet,
  };
  const tableRowProps = {
    className: 'table-header',
  };

  let tableHeaderColumns = [];
  if (schoolView) {
    tableHeaderColumns = [
      {
        columnName: 'User Name',
        tooltip: '',
        // className: "wd-150"
      },
      {
        columnName: 'Date',
        tooltip: '',
        // className: "wd-211"
      },
      {
        columnName: 'Transaction Type',
        tooltip: '',
        // className: "wd-150"
      },
      {
        columnName: ' Payment Method',
        tooltip: '',
        // className: "wd-100"
      },
      {
        columnName: 'Amount',
        tooltip: '',
        // className: "wd-150"
      },
      {
        columnName: 'Net',
        tooltip: '',
        // className: "wd-150"
      },
      {
        columnName: 'Fee',
        tooltip: '',
        // className: "wd-150"
      },
      {
        columnName: 'School Name',
        tooltip: '',
        // className: "wd-100"
      },
      {
        columnName: 'Class',
        tooltip: '',
        // className: "wd-100"
      },
      {
        columnName: 'Package Name',
        tooltip: '',
        // className: "wd-150"
      },
      {
        columnName: 'Package Type',
        tooltip: '',
        // className: "wd-150"
      },
    ];
  } else {
    tableHeaderColumns = [
      {
        columnName: 'User Name',
        tooltip: '',
        // className: "wd-150"
      },
      {
        columnName: 'Date',
        tooltip: '',
        // className: "wd-211"
      },
      {
        columnName: 'Transaction Type',
        tooltip: '',
        // className: "wd-150"
      },
      {
        columnName: ' Payment Method',
        tooltip: '',
        // className: "wd-100"
      },
      {
        columnName: 'Amount',
        tooltip: '',
        // className: "wd-150"
      },
      {
        columnName: 'School Name',
        tooltip: '',
        // className: "wd-100"
      },
      {
        columnName: 'Class',
        tooltip: '',
        // className: "wd-100"
      },
      {
        columnName: 'Package Name',
        tooltip: '',
        // className: "wd-150"
      },
      {
        columnName: 'Package Type',
        tooltip: '',
        // className: "wd-150"
      },
    ];
  }
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

export const TransactionDetailsTable = schoolView => createTable(getTableProps(schoolView));
