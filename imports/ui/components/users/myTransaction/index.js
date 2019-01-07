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
const packageTypes = [{ label: 'Package Type All', value: 0 }, { label: "CP", value: "CP" }, { label: "MP", value: 'MP' }, { label: "EP", value: 'EP' }]
const packageStatus = [{ label: 'Package Status All', value: 0 }, { label: 'Active', value: 'active' }, { label: 'Expired', value: 'expired' }, { label: 'In Active', value: 'inActive' }]
const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    backgroundColor: "#4caf50",
    margin: "10px",
    borderRadius: "10px"
  },
rootGrid:{
  margin:"0px"
}
})
class MyTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      purchaseData: [],
      perPage: 3,
      pageCount: 1,
      selectedPackageType: null,
      selectedPackageStatus: null,
      packageStatusOptions: packageStatus,
      packageTypeOptions: packageTypes,
      filter: {
        userId: Meteor.userId()
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
    this.setState({ isLoading: true });
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
  handleFilter = (value, filterName, stateName) => {
    this.setState(state => {
      let { filter } = state;
      if (value.value && filterName)
        filter[filterName] = value.value;
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
  render() {
    const { tableHeaderColumns } = getTableProps();
    const { purchaseData, isLoading } = this.state;
    const { classes } = this.props;
    return (
      <div>
        {isLoading && <ContainerLoader />}
        <center>
          {" "}
          <h1>My Transactions </h1>
        </center>
        <Paper className={classes.root}>
        {filterForTransaction.call(this)}
        </Paper>
        <TransactionDetailsTable>
          {isEmpty(purchaseData)
            ? "No payout found"
            : purchaseData.reverse().map((purchase, index) => {
              return (
                <Fragment>
                  <FncTableRow key={index} selectable={false}>
                    <FncTableCell data-th={tableHeaderColumns[0].columnName}>
                      {index + 1}
                    </FncTableCell>
                    <FncTableCell data-th={tableHeaderColumns[1].columnName}>
                      {this.getColumnValue(purchase, 'userName')}
                    </FncTableCell>
                    <FncTableCell data-th={tableHeaderColumns[2].columnName}>
                      {this.getColumnValue(purchase, 'packageName')}
                    </FncTableCell>
                    <FncTableCell data-th={tableHeaderColumns[3].columnName}>
                      {this.packageType(purchase)}
                    </FncTableCell>
                    <FncTableCell data-th={tableHeaderColumns[4].columnName}>
                      {this.getColumnValue(purchase, 'amount')}
                    </FncTableCell>
                    <FncTableCell data-th={tableHeaderColumns[5].columnName}>
                      {dateFriendly(this.getColumnValue(purchase, 'startDate'), "MMMM Do YYYY, h:mm:ss a")}
                    </FncTableCell>
                    <FncTableCell data-th={tableHeaderColumns[6].columnName}>
                      {this.getColumnValue(purchase, 'paymentMethod')}
                    </FncTableCell>
                    <FncTableCell data-th={tableHeaderColumns[7].columnName}>
                      {dateFriendly(this.getColumnValue(purchase, 'endDate'), "MMMM Do YYYY, h:mm:ss a")}
                    </FncTableCell>
                    <FncTableCell data-th={tableHeaderColumns[8].columnName}>
                      {this.getColumnValue(purchase, 'noClasses') == null ? 'Unlimited' : this.getColumnValue(purchase, 'noClasses')}
                    </FncTableCell>
                    <FncTableCell data-th={tableHeaderColumns[9].columnName}>
                      {this.getColumnValue(purchase, 'packageStatus')}
                    </FncTableCell>
                  </FncTableRow>
                </Fragment>
              );
            })}
        </TransactionDetailsTable>
        <Pagination
          {...this.state}
          onChange={this.changePageClick}
        />
      </div>
    );
  }
}
export default withStyles(styles)(MyTransaction);