import React, { Fragment } from "react";
import Pagination from "/imports/ui/componentHelpers/pagination";
import { TransactionDetailsTable } from "./transactionDetailsTable";
import { TableRow, TableCell } from "material-ui/Table";
import isEmpty from "lodash/isEmpty";
import { createContainer } from "meteor/react-meteor-data";
import Purchases from "/imports/api/purchases/fields";
import { dateFriendly } from "/imports/util";
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
      perPage: 10
    };
  }

  render() {
    const { purchaseData } = this.props;
    const { pageCount } = this.props;
    return (
      <div>
        <center>
          {" "}
          <h1>Transactions</h1>
        </center>
        <TransactionDetailsTable>
          {isEmpty(purchaseData)
            ? "No payout found"
            : purchaseData.reverse().map((purchase, index) => {
                return (
                  <Fragment>
                    <TableRow key={index} selectable={false}>
                      <TableCell style={style.w150}>
                        {"Payout" || "Unavailable"}
                      </TableCell>
                      <TableCell style={style.w150}>
                        {purchase.stripeResponse &&
                        purchase.stripeResponse.amount
                          ? "$" +
                            purchase.stripeRequest.destination.amount / 100
                          : "Unavailable"}
                      </TableCell>
                      <TableCell style={style.w150}>
                        {purchase.stripeResponse &&
                        purchase.stripeResponse.amount
                          ? "$" +
                            purchase.stripeRequest.destination.amount / 100
                          : "Unavailable"}
                      </TableCell>
                      <TableCell style={style.w211}>-----</TableCell>
                      <TableCell style={style.w150}>
                        {"Stripe Transfer" || "Unavailable"}
                      </TableCell>
                      <TableCell style={style.w150}>
                        {dateFriendly(
                          purchase.createdOn,
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow selectable={false}>
                      <TableCell style={style.w150}>
                        {"Charge" || "Unavailable"}
                      </TableCell>
                      <TableCell style={style.w150}>
                        {purchase.stripeResponse &&
                        purchase.stripeResponse.amount
                          ? "$" +
                            purchase.stripeResponse.amount / 100 -
                            purchase.fee / 100
                          : "Unavailable"}
                      </TableCell>
                      <TableCell style={style.w150}>
                        {purchase.stripeResponse &&
                        purchase.stripeResponse.amount
                          ? "$" + purchase.stripeResponse.amount / 100
                          : "Unavailable"}
                      </TableCell>
                      <TableCell style={style.w211}>
                        {purchase && purchase.fee
                          ? "$" + purchase.fee / 100
                          : "Unavailable"}
                      </TableCell>
                      <TableCell style={style.w150}>
                        {purchase.stripeResponse
                          ? purchase.stripeResponse.description
                          : "Unavailable"}
                      </TableCell>
                      <TableCell style={style.w150}>
                        {dateFriendly(
                          purchase.createdOn,
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              })}
        </TransactionDetailsTable>
        <Pagination
          {...this.state}
          pageCount={pageCount}
          onChange={skip => {
            this.props.ChangePageClick(skip);
          }}
        />
      </div>
    );
  }
}
export default createContainer(props => {
  let purchaseSubscription = Meteor.subscribe(
    "purchases.getAllPurchaseData",
    props.slug,
    props.filters
  );

  let purchaseData = Purchases.find().fetch();
  // }

  return {
    purchaseData,
    props
  };
}, Transactions);
