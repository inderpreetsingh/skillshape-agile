import React, { Fragment } from "react";
import { isEmpty, get } from "lodash";
import Pagination from "/imports/ui/componentHelpers/pagination";
import { TransactionDetailsTable, getTableProps } from "./transactionDetailsTable";
import { dateFriendly, capitalizeString, cutString } from "/imports/util";
import { FncTableCell, FncTableRow } from './styles';
import { ContainerLoader } from "/imports/ui/loading/container";
import { filterForTransaction } from './filterCode';
import { withStyles } from "material-ui/styles";
import Paper from 'material-ui/Paper'
import Tooltip from 'rc-tooltip';
import { goToClassTypePage } from '/imports/util';
import { SubscriptionsDetailsDialogBox } from '/imports/ui/components/landing/components/dialogs/';
import 'rc-tooltip/assets/bootstrap_white.css';
import config from "../../../../config";
const packageTypes = [{ label: 'Package Type All', value: 0 }, { label: "Per Class", value: "CP" }, { label: "Monthly Package", value: 'MP' }, { label: "Enrollment Package", value: 'EP' }];
const packageStatus = [{ label: 'Package Status All', value: 0 }, { label: 'Active', value: 'active' }, { label: 'Expired', value: 'expired' }, { label: 'In Active', value: 'inActive' }];
const paymentMethods = [{ label: 'Payment Method All', value: 0 }, { label: 'SkillShape', value: 'stripe' }, { label: 'Cash', value: 'cash' }, { label: 'Check', value: 'check' }, { label: 'External Card', value: 'creditCard' }, { label: 'Bank Transfer', value: 'bankTransfer' }, { label: 'Others', value: 'other' }];
const transactionType  = [{label:'Transaction Type All',value: 0},{label:'Purchase',value:'purchase'},{label:'Attendance',value:'attendance'},{label:'Expired',value:'expired'}]
const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    backgroundColor: "#4caf50",
    margin: "10px",
    borderRadius: "10px"
  },
  rootGrid: {
    padding: '6px'
  }
})
class MyTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionData: [],
      perPage: 10,
      pageCount: 1,
      packageName: '',
      selectedPackageType: null,
      selectedPackageStatus: null,
      selectedPaymentMethod: null,
      selectedTransactionType: null,
      paymentMethodsOptions: paymentMethods,
      packageStatusOptions: packageStatus,
      packageTypeOptions: packageTypes,
      transactionTypeOptions: transactionType,
      filter: {
        userId: get(this.props.params, 'id', Meteor.userId())
      },
      limit: 10,
      skip: 0,
      isLoading: false
    };
  }

  componentWillMount() {
    this.getPurchaseData();
  }
  // get transaction data from db on page load and page number click.
  getPurchaseData = () => {
    this.setState({ isLoading: true }, () => {
      let { filter } = this.state;
      let { limit, skip } = this.state;
      let limitAndSkip = { limit, skip };
      Meteor.call('transactions.getFilteredPurchases', filter, limitAndSkip, (err, res) => {
        let state = {};
        if (res) {
          state = { pageCount: Math.ceil(res.count / 10), transactionData: res.records }
          state.isLoading = false;
          this.setState(state);
        }
      })
    });
  }
  changePageClick = (skip) => {
    this.setState({ skip: skip.skip, isLoading: true }, () => { this.getPurchaseData(); });
  }
  getColumnValue = (data, fieldName, secondFieldName = null) => {
    let result = get(data, fieldName, get(data, secondFieldName, null));
    if (typeof result == "string") {
      return capitalizeString(result)
    }
    return result;
  }
  packageType = (transaction) => {
    let pt = get(transaction, 'packageType', 'Unavailable');
    pt == 'MP' ? pt = 'Monthly Package' : pt == 'CP' ? pt = 'Per Class' : pt == 'EP' ? pt = 'Enrollment Package' : pt = 'Unavailable';
    return capitalizeString(pt);
  }
  handleTextFieldChange = (e) => {
    this.setState({
      textFieldValue: e.target.value
    });
  }
  handleFilter = (value, filterName, stateName) => {
    let stringValue = get(value.target, "value", null)
    if (filterName == 'packageName') {
      value = stringValue ? stringValue : "";
    }
    this.setState(state => {
      let { filter } = state;
      if (value.value && filterName || typeof value == 'string' && value)
        filter[filterName] = value.value ? value.value : new RegExp(`^${value}`, 'i');
      else
        delete filter[filterName];
      return {
        [stateName]: value,
        filter,
        isLoading: true,
        skip: 0,
      };
    }, () => { this.getPurchaseData(); });
  };
  amountGenerator = (transaction) => {
    let currency = get(transaction, 'currency', '$');
    let amount = get(transaction, 'amount', 0);
    config.currency.map((obj) => {
      if (obj.label == currency)
        currency = obj.value;
    })
    return `${currency + amount}`;
  }
  classesCovered = (transaction) => {
    let covers = get(transaction, 'covers', []);
    covers = covers.join(', ');
    return covers;
  }
  render() {
    const { transactionData, isLoading, selectedFilter } = this.state;
    let columnData = getTableProps()
    const { tableHeaderColumns } = columnData;
    const { classes } = this.props;
    let columnValues = tableHeaderColumns;
    let TableName = TransactionDetailsTable;
    if(!Meteor.userId()){
      return 'Please Login First.'
    }
    else if(get(this.props.params, 'id',null) !=  Meteor.userId()){
      return 'Unable to Access Other User Account';
    }
    return (
      <div>
        {isLoading && <ContainerLoader />}
        <center>
          {" "}
          <h1>My Transactions</h1>
        </center>
        <Paper className={classes.root}>
          {filterForTransaction.call(this)}
        </Paper>
        <TableName>
          {isEmpty(transactionData)
            ? "No payout found"
            : transactionData.reverse().map((transaction, index) => {
              let transactionType = get(transaction, 'packageStatus', '') == 'expired' ? 'Expiration' : get(transaction, 'classTypeName', '') ? 'Attendance' : 'Purchase';
              let {classTypeName,classTypeId} = transaction || {};
              let classTypePageCondition  = classTypeName && classTypeId;
              return (
                <Fragment>
                  <FncTableRow key={index} selectable={false}>
                    <FncTableCell data-th={columnValues[0].columnName}>
                      {this.getColumnValue(transaction, 'userName') || "..."}
                    </FncTableCell>
                    <FncTableCell data-th={columnValues[1].columnName}>
                      {dateFriendly(this.getColumnValue(transaction, 'transactionDate'), "MMMM Do YYYY, h:mm a")}
                    </FncTableCell>
                    <FncTableCell data-th={columnValues[2].columnName}>
                      {this.getColumnValue(transaction, 'transactionType')}
                    </FncTableCell>
                    <FncTableCell data-th={columnValues[3].columnName}>
                      {this.getColumnValue(transaction, 'paymentMethod') || "..."}
                    </FncTableCell>
                    <FncTableCell data-th={columnValues[4].columnName}>
                      {this.amountGenerator(transaction)}
                    </FncTableCell>
                    <FncTableCell data-th={columnValues[5].columnName}>
                      {this.getColumnValue(transaction, 'schoolName') || "..."}
                    </FncTableCell>
                    <div onClick={() => { classTypePageCondition && goToClassTypePage(classTypeName,classTypeId) }}>
                    <FncTableCell data-th={columnValues[6].columnName}>
                      {this.getColumnValue(transaction, 'classTypeName') || "..."}
                    </FncTableCell>
                   </div>
                    <Tooltip
                      animation="zoom"
                      placement="top"
                      trigger={['click']}
                      destroyTooltipOnHide
                      overlay={
                        <SubscriptionsDetailsDialogBox
                          {...transaction}
                          open={true}
                          onModalClose={() => { }}

                        />
                      }
                      overlayStyle={{ zIndex: -9999 }}>
                      <FncTableCell data-th={columnValues[7].columnName}>
                        {this.getColumnValue(transaction, 'packageName') || "..."}
                      </FncTableCell>
                    </Tooltip>
                    <FncTableCell data-th={columnValues[8].columnName}>
                      {this.packageType(transaction)}
                    </FncTableCell>
                  </FncTableRow>

                </Fragment>
              );
            })}
        </TableName>
        <Pagination
          {...this.state}
          onChange={this.changePageClick}
        />
      </div>
    );
  }
}
export default withStyles(styles)(MyTransaction);