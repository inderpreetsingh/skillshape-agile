import React, { Fragment } from "react";
import styled from 'styled-components';
import { get, isEmpty ,isArray} from "lodash";
import Paper from 'material-ui/Paper';
import { withStyles } from "material-ui/styles";
import { rhythmDiv, panelColor } from '/imports/ui/components/landing/components/jss/helpers.js';
import { Heading } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import { filterForTransaction } from './filterCode';
import { getTableProps, TransactionDetailsTable } from "./transactionDetailsTable";
import Pagination from "/imports/ui/componentHelpers/pagination";
import { SubscriptionsDetailsDialogBox } from '/imports/ui/components/landing/components/dialogs/';
import { SSTableCell, SSTableRow } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import { ContainerLoader } from "/imports/ui/loading/container";
import {
  capitalizeString,
  dateFriendly,
  goToClassTypePage,
  goToSchoolPage,
  withPopUp, confirmationDialog
} from "/imports/util";
import {ChartComponent} from './chart.jsx'

import config from "../../../../config";
const packageTypes = [{ label: 'Package Type All', value: 1 }, { label: "Per Class", value: "CP" }, { label: "Monthly Package", value: 'MP' }, { label: "Enrollment Package", value: 'EP' }];
const packageStatus = [{ label: 'Package Status All', value: 1 }, { label: 'Active', value: 'active' }, { label: 'Expired', value: 'expired' }, { label: 'In Active', value: 'inActive' }];
const paymentMethods = [{ label: 'Payment Method All', value: 1 }, { label: 'SkillShape', value: 'stripe' }, { label: 'Cash', value: 'cash' }, { label: 'Check', value: 'check' }, { label: 'External Card', value: 'creditCard' }, { label: 'Bank Transfer', value: 'bankTransfer' }, { label: 'Others', value: 'other' }];
const transactionType = [{ label: 'Transaction Type All', value: 1 }, { label: 'Purchase', value: 'purchase' }, { label: 'Attendance', value: 'attendance' }, { label: 'Expired', value: 'expired' }, { label: 'Contract Cancelled', value: 'contractCancelled' }]

const maxFilterValues = {
  packageType: 'Package Type All',
  packageStatus: 'Package Status All',
  paymentMethod: 'Payment Method All',
  transactionType: 'Transaction Type All'
}

const ContentWrapper = styled.div`
  padding: ${rhythmDiv * 2}px;
  padding-top: ${rhythmDiv * 4}px;
  background: ${panelColor};
`;

const TableWrapper = styled.div`
  max-width: 90%;
  margin: 0 auto;
  overflow: auto;
`;

const PageHeading = Heading.extend`
  text-align: center;
  font-weight: 400;
  margin-bottom: ${rhythmDiv * 6}px;
`;

const Wrapper = styled.div`
  background: ${panelColor};
  padding-top: ${rhythmDiv * 2}px;
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
        };
  }

  componentWillMount() {
   this.setInitialFilters(this.props);
  }
  componentWillReceiveProps(nextProps){
    this.setInitialFilters(nextProps);
  }
  setInitialFilters = (props) => {
    const {schoolView,schoolData} = props;
    let state = {
      transactionData: [],
      perPage: 10,
      pageCount: 1,
      packageName: '',
      sddb: false,
      contractDialog: false,
      selectedPackageType: null,
      selectedPackageStatus: null,
      selectedPaymentMethod: null,
      selectedTransactionType: null,
      paymentMethodsOptions: paymentMethods,
      packageStatusOptions: packageStatus,
      packageTypeOptions: packageTypes,
      transactionTypeOptions: transactionType,
      limit: 10,
      skip: 0,
      isLoading: false,
      stripeIDealDialog:false,
    };
    let isDashboard = false;
    let schoolOptions = [{label:'All',value:1}];
    let schoolId=[];
    if(schoolView && !isEmpty(schoolData)){
      if(isArray(schoolData) ){
        isDashboard = true;
        schoolData.map((obj)=>{
          const {_id:value,name:label} = obj;
          schoolId.push(value);
          schoolOptions.push({label,value});
        });
      }
      else{
        const {_id} = schoolData;
        schoolId = [_id];
      }
      state.filter = {
        schoolId,
        }
    }else{
      isDashboard = false;
      state.filter = {
        userId: get(props.params, 'id', Meteor.userId()),
      }
    }
    state.isDashboard = isDashboard;
    state.schoolOptions = schoolOptions;
    state.allSchoolIds = schoolId;
    this.setState({...state},()=>{this.getPurchaseData()});
  }
  // get transaction data from db on page load and page number click.
  getPurchaseData = () => {
    let { filter } = this.state;
    let { limit, skip } = this.state;
    let limitAndSkip = { limit, skip };
    this.setState({isLoading:true})
    Meteor.call('transactions.getFilteredPurchases', filter, limitAndSkip, (err, res) => {
			console.log(": getPurchaseData -> err, res", err, res)
      let state = {};
      if (res) {
        state = { pageCount: Math.ceil(res.count / 10), transactionData: res.records ,graphData:res.graphData}
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
    if (result == 'contractCancelled') {
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


  handleFilter = (event, filterName, stateName) => {
    let filterValue = filterValueOriginal = get(event.target, 'value', null);
    let reg = false;
    if (filterName == 'packageName' || filterName == 'userName') {
      reg = true;
    }
    this.setState(state => {
      const { filter ,allSchoolIds} = state;
      if (filterValue && typeof filterValue === 'number' && filterName!='schoolId') filterValue = 0;
      if (filterValue && filterName ) {
        if(filterName == 'schoolId' && filterValue)
        {
          if(filterValue == 1){
           filter[filterName] = allSchoolIds;
          }
          else
          filter[filterName] = [filterValue]
        }
        else
        filter[filterName] = !reg ? filterValue : new RegExp(`.*${filterValue}.*`, 'i');;
      } else {
        delete filter[filterName];
      }

      return {
        [stateName]: filterValueOriginal,
        filter,
        isLoading: true,
        skip: 0
      }
    }, () => {
      this.getPurchaseData();
    });
  }
  amountGenerator = (transaction,field) => {
    let currency = get(transaction, 'currency', '$');
    let amount = get(transaction, 'amount', 0);
    let fee = get(transaction,'fee',0)/100;
    let cost = 0;
    config.currency.map((obj) => {
      if (obj.label == currency)
        currency = obj.value;
    })
    cost = field == 'fee' ? fee : field == 'net' ? amount-fee : amount ;
    return `${currency + cost}`;
  }
  classesCovered = (transaction) => {
    let covers = get(transaction, 'covers', []);
    covers = covers.join(', ');
    return covers;
  }
  handleError = (error) => {
    console.log('TCL: handleError -> error', error)
    const {popUp} = this.props;
    let data = {
      popUp,
      title: 'Error',
      type: 'alert',
      content: `${error.message}`,
      buttons: [{ label: 'Ok', onClick: () => { }, greyColor: true }]
    };
    confirmationDialog(data);
  }
  render() {
    const { transactionData, isLoading, isDashboard, sddb, index, contractDialog ,graphData} = this.state;
    const { classes, popUp,schoolView } = this.props;
    let columnData = getTableProps(schoolView)
    const { tableHeaderColumns } = columnData;
    let columnValues = tableHeaderColumns;
    let TableName = TransactionDetailsTable(schoolView);
    if (!Meteor.userId()) {
      return 'Please Login First.'
    }
    else if (get(this.props.params, 'id', null) != Meteor.userId() && !schoolView) {
      return 'Unable to Access Other User Account';
    }
    const color = { color: 'green', cursor: "pointer" };
    return (
      <Wrapper>
        {isLoading && <ContainerLoader />}
        <PageHeading>{schoolView ? "Transactions": "My Transactions"}</PageHeading>
        <Paper className={classes.root}>
          {filterForTransaction.call(this)}
         {isDashboard &&  <ChartComponent graphData={graphData}/>} 
        </Paper>
        {sddb &&
          <SubscriptionsDetailsDialogBox
            {...transactionData[index]}
            open={sddb}
            contractDialog={contractDialog}
            toggleContractDialog={() => { this.setState({ contractDialog: !this.state.contractDialog }) }}
            onModalClose={() => { this.setState({ sddb: false, contractDialog: false }) }}
          />
        }
        <ContentWrapper>
          <TableWrapper>
            <TableName>
              {isEmpty(transactionData)
                ? "There are no transactions yet!" 
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
                      <SSTableRow key={index} selectable={false}>
                        <SSTableCell className="pd-normal" data-th={columnValues[0].columnName}>
                          {this.getColumnValue(transaction, 'userName') || "..."}
                        </SSTableCell>
                        <SSTableCell className="pd-normal" data-th={columnValues[1].columnName}>
                          {dateFriendly(this.getColumnValue(transaction, 'transactionDate'), "MMMM Do YYYY, h:mm a")}
                        </SSTableCell>
                        <SSTableCell className="pd-normal" data-th={columnValues[2].columnName}>
                          {this.getColumnValue(transaction, 'transactionType')}
                        </SSTableCell>
                        <SSTableCell data-th={columnValues[3].columnName}>
                          {this.getColumnValue(transaction, 'paymentMethod') || "..."}
                        </SSTableCell>
                        <SSTableCell data-th={columnValues[4].columnName}>
                          {this.amountGenerator(transaction,'amount')}
                        </SSTableCell>
                        {schoolView && (
                          <SSTableCell data-th={columnValues[5].columnName}>
                          {this.amountGenerator(transaction,'net')}
                        </SSTableCell>
                        )
                        }
                        {schoolView && (
                          <SSTableCell data-th={columnValues[6].columnName}>
                          {this.amountGenerator(transaction,'fee')}
                        </SSTableCell>
                        )
                        }
                        <SSTableCell data-th={columnValues[schoolView ? 7 : 5].columnName} style={color} onClick={() => { confirmationDialog(dataForSchool) }}>
                          {this.getColumnValue(transaction, 'schoolName') || "..."}
                        </SSTableCell>
                        <SSTableCell data-th={columnValues[schoolView ? 8 : 6].columnName} style={color} onClick={() => { confirmationDialog(dataForClassType) }}>
                          {this.getColumnValue(transaction, 'classTypeName') || "..."}
                        </SSTableCell>
                        <SSTableCell data-th={columnValues[schoolView ? 9 : 7].columnName} style={color} onClick={() => { this.setState({ sddb: !this.state.sddb, index }) }}>
                          {this.getColumnValue(transaction, 'packageName') || "..."}
                        </SSTableCell>
                        <SSTableCell data-th={columnValues[schoolView ? 10 : 8].columnName}>
                          {this.packageType(transaction)}
                        </SSTableCell>
                      </SSTableRow>
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
        </ContentWrapper>
      </Wrapper>
    );
  }
}
export default withStyles(styles)(withPopUp(MyTransaction));