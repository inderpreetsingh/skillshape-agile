import React, { Fragment } from "react";
import { isEmpty, get } from "lodash";
import Pagination from "/imports/ui/componentHelpers/pagination";
import { TransactionDetailsTable, getTableProps } from "./transactionDetailsTable";
import { dateFriendly, capitalizeString } from "/imports/util";
import { FncTableCell, FncTableRow } from './styles';
import { ContainerLoader } from "/imports/ui/loading/container";
import { filterForTransaction } from './filterCode';
import { withStyles } from "material-ui/styles";
import Paper from 'material-ui/Paper'
import Tooltip from 'rc-tooltip';
import { SubscriptionsDetailsDialogBox } from '/imports/ui/components/landing/components/dialogs/';
import 'rc-tooltip/assets/bootstrap_white.css';
import config from "../../../../config";
const packageTypes = [{ label: 'Package Type All', value: 0 }, { label: "Per Class", value: "CP" }, { label: "Monthly Package", value: 'MP' }, { label: "Enrollment Package", value: 'EP' }];
const packageStatus = [{ label: 'Package Status All', value: 0 }, { label: 'Active', value: 'active' }, { label: 'Expired', value: 'expired' }, { label: 'In Active', value: 'inActive' }];
const paymentMethods = [{ label: 'Payment Method All', value: 0 }, { label: 'Stripe', value: 'stripe' }, { label: 'Cash', value: 'cash' }, { label: 'Check', value: 'check' }, { label: 'External Credit Card', value: 'creditCard' }, { label: 'Bank Transfer', value: 'bankTransfer' }, { label: 'Others', value: 'other' }];
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
      purchaseData: [],
      perPage: 3,
      pageCount: 1,
      packageName: '',
      selectedPackageType: null,
      selectedPackageStatus: null,
      selectedPaymentMethod: null,
      paymentMethodsOptions: paymentMethods,
      packageStatusOptions: packageStatus,
      packageTypeOptions: packageTypes,
      filter: {
        userId: get(this.props.params, 'id', Meteor.userId())
      },
      limit: 3,
      skip: 0,
      isLoading: false
    };
  }

  componentWillMount() {
    this.getPurchaseData();
  }
  // get purchase data from db on page load and page number click.
  getPurchaseData = () => {
    this.setState({ isLoading: true }, () => {
      let { filter } = this.state;
      let { limit, skip } = this.state;
      let limitAndSkip = { limit, skip };
      Meteor.call('purchases.getFilteredPurchases', filter, limitAndSkip, (err, res) => {
        let state = {};
        if (res) {
          state = { pageCount: Math.ceil(res.count / 3), purchaseData: res.records }
          state.isLoading = false;
          this.setState(state);
        }
      })
    });
  }
  changePageClick = (skip) => {
    this.setState({ skip: skip.skip, isLoading: true }, () => { this.getPurchaseData(); });
  }
  getColumnValue = (data, fieldName) => {
    let result = get(data, fieldName, 'Missing');
    if (typeof result == "string") {
      return capitalizeString(result)
    }
    return result;
  }
  packageType = (purchase) => {
    let pt = get(purchase, 'packageType', 'Unavailable');
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
  amountGenerator = (purchase) => {
    let currency = get(purchase, 'currency', '$');
    let amount = get(purchase, 'amount', 0);
    config.currency.map((obj) => {
      if (obj.label == currency)
        currency = obj.value;
    })
    return `${currency + amount}`;
  }
  classesCovered = (purchase) => {
    let covers = get(purchase, 'covers', []);
    covers = covers.join(', ');
    return covers;
  }
  render() {
    const { purchaseData, isLoading ,selectedFilter} = this.state;
    let columnData = getTableProps() 
    const { tableHeaderColumns } = columnData;
    const { classes } = this.props;
    let columnValues = tableHeaderColumns;
    let TableName = TransactionDetailsTable 
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
          {isEmpty(purchaseData)
            ? "No payout found"
            :  purchaseData.reverse().map((purchase, index) => {
              let transactionType = get(purchase, 'packageStatus', '') == 'expired' ? 'Expiration' : 'Purchase';
              return (
                <Fragment>
                  <FncTableRow key={index} selectable={false}>
                    <FncTableCell data-th={columnValues[0].columnName}>
                      {this.getColumnValue(purchase, 'userName')}
                    </FncTableCell>
                    <FncTableCell data-th={columnValues[1].columnName}>
                      {dateFriendly(this.getColumnValue(purchase, 'startDate'), "MMMM Do YYYY, h:mm:ss a")}
                    </FncTableCell>
                    <FncTableCell data-th={columnValues[2].columnName}>
                      {transactionType}
                    </FncTableCell>
                    <FncTableCell data-th={columnValues[3].columnName}>
                      {this.getColumnValue(purchase, 'paymentMethod')}
                    </FncTableCell>
                    <FncTableCell data-th={columnValues[4].columnName}>
                      {this.amountGenerator(purchase)}
                    </FncTableCell>
                    <FncTableCell data-th={columnValues[5].columnName}>
                      {this.getColumnValue(purchase, 'schoolName.name')}
                    </FncTableCell>
                    <Tooltip
                      animation="zoom"
                      placement="top"
                      trigger={['hover']}
                      overlay={
                        <span>{this.classesCovered(purchase)}</span>
                      }
                      overlayStyle={{ zIndex: 9999 }}>

                      <FncTableCell data-th={columnValues[6].columnName}>
                        Click Me
                    </FncTableCell>
                    </Tooltip>
                    <Tooltip
                      animation="zoom"
                      placement="top"
                      trigger={['click']}
                      destroyTooltipOnHide
                      overlay={
                        <SubscriptionsDetailsDialogBox
                          {...purchase}
                          open={true}
                          onModalClose={() => { }}

                        />
                      }
                      overlayStyle={{ zIndex: -9999 }}>
                      <FncTableCell data-th={columnValues[7].columnName}>
                        {this.getColumnValue(purchase, 'packageName')}
                      </FncTableCell>
                    </Tooltip>
                    <FncTableCell data-th={columnValues[8].columnName}>
                      {this.packageType(purchase)}
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