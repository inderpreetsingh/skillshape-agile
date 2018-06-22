import React, { Fragment } from "react";
import Pagination from "/imports/ui/componentHelpers/pagination";
import { TransactionDetailsTable } from "./transactionDetailsTable";
import { TableRow, TableCell } from "material-ui/Table";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
import { createContainer } from "meteor/react-meteor-data";
import Purchases from "/imports/api/purchases/fields";
const style = {
  w211: {
    width: 211
  },
  w100: {
    width: 100
  },
  w150: {
    width: 150
  }
};
class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      PurchaseData: [],
      isBusy: true,
      perPage: 10,

      usersCount: 0,
      errorText: null,
      pageCount: 0
    };
  }
  componentWillMount() {
    console.log("this.props in payout", this.props);

    // Meteor.call("getAllPurchaseData", this.props.params.slug, (err, res) => {
    //   console.log("------------->AllPurchaseData<---------", res);
    //   this.setState({ PurchaseData: res });
    // });
  }

  render() {
    const { isBusy, pageCount, usersCount } = this.state;
    const { purchaseData, handlePageClick } = this.props;
    console.log("PurchaseData--->", this.props);
    return (
      <div>
        <h1>Payouts</h1>
        <TransactionDetailsTable>
          {isEmpty(purchaseData)
            ? "No payout found"
            : purchaseData.map(purchase => {
                return (
                  <Fragment>
                    <TableRow key={purchase._id} selectable={false}>
                      <TableCell style={style.w150}>
                        {"Payout" || "Unavailable"}
                      </TableCell>
                      <TableCell style={style.w150}>
                        {purchase.stripe_Response.amount || "Unavailable"}
                      </TableCell>
                      <TableCell style={style.w150}>
                        {purchase.stripe_Response.amount || "Unavailable"}
                      </TableCell>
                      <TableCell style={style.w211}>
                        {purchase.stripe_Response.source.last4 || "Unavailable"}
                      </TableCell>
                      <TableCell style={style.w150}>
                        {"Stripe Transfer" || "Unavailable"}
                      </TableCell>
                    </TableRow>
                    <TableRow key={purchase._id} selectable={false}>
                      <TableCell style={style.w150}>
                        {"Charge" || "Unavailable"}
                      </TableCell>
                      <TableCell style={style.w150}>
                        {purchase.stripe_Response.amount || "Unavailable"}
                      </TableCell>
                      <TableCell style={style.w150}>
                        {purchase.stripe_Response.amount || "Unavailable"}
                      </TableCell>
                      <TableCell style={style.w211}>
                        {purchase.stripe_Response.source.last4 || "Unavailable"}
                      </TableCell>
                      <TableCell style={style.w150}>
                        {purchase.stripe_Response.description || "Unavailable"}
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              })}
        </TransactionDetailsTable>
        <Pagination
          {...this.state}
          pageCount={pageCount}
          onChange={handlePageClick}
        />
      </div>
    );
  }
}
export default createContainer(props => {
  console.log("payout props----->", props);
  let purchaseSubscription = Meteor.subscribe(
    "getAllPurchaseData",
    props.params.slug
  );
  // let purchaseData = [];
  // if (purchaseSubscription.ready()) {
  let purchaseData = Purchases.find().fetch();
  // }
  handlePageClick = ({ skip }) => {
    console.log("skip -->>", skip);
    this.setState({ isBusy: true });
    this.getUsers({ limit: this.state.perPage, skip: skip });
  };
  return {
    purchaseData,
    props,
    handlePageClick
  };
}, Transactions);
