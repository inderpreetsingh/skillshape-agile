import React, { Fragment } from "react";
import styled from 'styled-components';
import { get, isEmpty } from "lodash";
import Paper from 'material-ui/Paper';
import { withStyles } from "material-ui/styles";
import { rhythmDiv, panelColor } from '/imports/ui/components/landing/components/jss/helpers.js';
import { Heading } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';

import { filterForTransaction } from './filterCode';
import { FncTableCell, FncTableRow } from './styles';
import { getTableProps, TransactionDetailsTable } from "./transactionDetailsTable";
import Pagination from "/imports/ui/componentHelpers/pagination";
import { SubscriptionsDetailsDialogBox } from '/imports/ui/components/landing/components/dialogs/';
import { ContainerLoader } from "/imports/ui/loading/container";
import {
  capitalizeString,
  dateFriendly,
  goToClassTypePage,
  goToSchoolPage,
  withPopUp, confirmationDialog
} from "/imports/util";

import config from "../../../../config";
const packageTypes = [{ label: 'Package Type All', value: 0 }, { label: "Per Class", value: "CP" }, { label: "Monthly Package", value: 'MP' }, { label: "Enrollment Package", value: 'EP' }];
const packageStatus = [{ label: 'Package Status All', value: 0 }, { label: 'Active', value: 'active' }, { label: 'Expired', value: 'expired' }, { label: 'In Active', value: 'inActive' }];
const paymentMethods = [{ label: 'Payment Method All', value: 0 }, { label: 'SkillShape', value: 'stripe' }, { label: 'Cash', value: 'cash' }, { label: 'Check', value: 'check' }, { label: 'External Card', value: 'creditCard' }, { label: 'Bank Transfer', value: 'bankTransfer' }, { label: 'Others', value: 'other' }];
const transactionType = [{ label: 'Transaction Type All', value: 0 }, { label: 'Purchase', value: 'purchase' }, { label: 'Attendance', value: 'attendance' }, { label: 'Expired', value: 'expired' }, { label: 'Contract Cancelled', value: 'contractCancelled' }]

const TableWrapper = styled.div`
  padding: ${rhythmDiv * 2}px;
  padding-top: ${rhythmDiv * 4}px;
  background: ${panelColor};
`;

const PageHeading = Heading.extend`
  text-align: center;
  font-weight: 400;
  margin-bottom: ${rhythmDiv * 6}px;
`;

const Wrapper = styled.div`
  background: white;
`;

const PaginationWrapper = styled.div`
  background: ${panelColor};
`;

const styles = theme => ({
  root: {
    maxWidth: `calc(90% - ${rhythmDiv * 4}px)`,
    margin: `0 auto`,
    boxShadow: 'none',
    background: 'transparent',
    marginBottom: rhythmDiv * 2,
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
      sddb: false,
      contractDialog:false,
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
      isLoading: true
    };
  }

  componentWillMount() {
    this.getPurchaseData();
  }
  // get transaction data from db on page load and page number click.
  getPurchaseData = () => {
      let { filter } = this.state;
      let { limit, skip } = this.state;
      let limitAndSkip = { limit, skip };
      Meteor.call('transactions.getFilteredPurchases', filter, limitAndSkip, (err, res) => {
        let state = {};
        if (res) {
          state = { pageCount: Math.ceil(res.count / 10), transactionData: res.records }
        }
        state.isLoading = false;
        this.setState(state);
      })
  }
  changePageClick = (skip) => {
    this.setState({ skip: skip.skip, isLoading: true }, () => { this.getPurchaseData(); });
  }
  getColumnValue = (data, fieldName, secondFieldName = null) => {
    let result = get(data, fieldName, get(data, secondFieldName, null));
    if(result == 'contractCancelled'){
      return 'Contract Cancelled';
    }
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
    const { transactionData, isLoading, selectedFilter, sddb, index,contractDialog } = this.state;
    let columnData = getTableProps()
    const { tableHeaderColumns } = columnData;
    const { classes, popUp } = this.props;
    let columnValues = tableHeaderColumns;
    let TableName = TransactionDetailsTable;
    if (!Meteor.userId()) {
      return 'Please Login First.'
    }
    else if (get(this.props.params, 'id', null) != Meteor.userId()) {
      return 'Unable to Access Other User Account';
    }
    const color = { color: 'green', cursor: "pointer" };

    return (
      <Wrapper>
        {isLoading && <ContainerLoader />}
        <PageHeading>My Transactions</PageHeading>
        <Paper className={classes.root}>
          {filterForTransaction.call(this)}
        </Paper>
        {sddb &&
          <SubscriptionsDetailsDialogBox
            {...transactionData[index]}
            open={sddb}
            contractDialog = {contractDialog}
						toggleContractDialog = {()=>{this.setState({contractDialog:!this.state.contractDialog})}}
            onModalClose={() => { this.setState({ sddb: false ,contractDialog:false}) }}
          />
        }
        <TableWrapper>
          <TableName>
            {isEmpty(transactionData)
              ? "No payout found"
              : transactionData.map((transaction, index) => {
                let { classTypeName, classTypeId, schoolSlug, schoolId, schoolName } = transaction || {};
                let classTypePageCondition = classTypeName && classTypeId;
                let dataForClassType = {}, dataForSchool = {};
                dataForClassType = {
                  popUp,
                  title: 'Confirmation',
                  type: 'inform',
                  content: <div>{classTypePageCondition ? `You will be redirected to ${classTypeName} page.` : 'Please Create New Data to use this functionality.'}</div>,
                  buttons: [{ label: 'Cancel', onClick: () => { }, greyColor: true }, { label: 'Go', onClick: () => { classTypePageCondition && goToClassTypePage(classTypeName, classTypeId) } }]
                };
                dataForSchool = {
                  popUp,
                  title: 'Confirmation',
                  type: 'inform',
                  content: <div>You will be redirected to {schoolName} page.</div>,
                  buttons: [{ label: 'Cancel', onClick: () => { }, greyColor: true }, { label: 'Go', onClick: () => { goToSchoolPage(schoolId, schoolSlug) } }]
                }
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
                      <FncTableCell data-th={columnValues[5].columnName} style={color} onClick={() => { confirmationDialog(dataForSchool) }}>
                        {this.getColumnValue(transaction, 'schoolName') || "..."}
                      </FncTableCell>
                      <FncTableCell data-th={columnValues[6].columnName} style={color} onClick={() => { confirmationDialog(dataForClassType) }}>
                        {this.getColumnValue(transaction, 'classTypeName') || "..."}
                      </FncTableCell>
                      <FncTableCell data-th={columnValues[7].columnName} style={color} onClick={() => { this.setState({ sddb: !this.state.sddb, index }) }}>
                        {this.getColumnValue(transaction, 'packageName') || "..."}
                      </FncTableCell>
                      <FncTableCell data-th={columnValues[8].columnName}>
                        {this.packageType(transaction)}
                      </FncTableCell>
                    </FncTableRow>
                  </Fragment>
                );
              })}
          </TableName>
        </TableWrapper>
        <PaginationWrapper>
          <Pagination
            style={{
              marginBottom: 0
            }}
            {...this.state}
            onChange={this.changePageClick}
          />
        </PaginationWrapper>
      </Wrapper>
    );
  }
}
export default withStyles(styles)(withPopUp(MyTransaction));