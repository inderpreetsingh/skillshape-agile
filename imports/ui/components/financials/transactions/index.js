import React, { Fragment } from "react";
import isEmpty from "lodash/isEmpty";
import Pagination from "/imports/ui/componentHelpers/pagination";
import { TransactionDetailsTable, getTableProps } from "./transactionDetailsTable";
import Purchases from "/imports/api/purchases/fields";
import { createContainer } from "meteor/react-meteor-data";
import { dateFriendly } from "/imports/util";
import { length, FncTableCell, FncTableRow } from '../styles.js';


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
    const { tableHeaderColumns } = getTableProps();

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
                  <FncTableRow key={index} selectable={false}>
                    <FncTableCell data-th={tableHeaderColumns[0].columnName}>
                      {"Payout" || "Unavailable"}
                    </FncTableCell>
                    <FncTableCell data-th={tableHeaderColumns[1].columnName}>
                      {purchase.stripeResponse &&
                        purchase.stripeResponse.amount
                        ? "$" +
                        purchase.stripeRequest.destination.amount / 100
                        : "Unavailable"}
                    </FncTableCell>
                    <FncTableCell data-th={tableHeaderColumns[2].columnName}>
                      {purchase.stripeResponse &&
                        purchase.stripeResponse.amount
                        ? "$" +
                        purchase.stripeRequest.destination.amount / 100
                        : "Unavailable"}
                    </FncTableCell>
                    <FncTableCell data-th={tableHeaderColumns[3].columnName}>-----</FncTableCell>
                    <FncTableCell data-th={tableHeaderColumns[4].columnName}>
                      {"Stripe Transfer" || "Unavailable"}
                    </FncTableCell>
                    <FncTableCell data-th={tableHeaderColumns[5].columnName}>
                      {dateFriendly(
                        purchase.createdOn,
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </FncTableCell>
                  </FncTableRow>
                  <FncTableRow selectable={false}>
                    <FncTableCell data-th={tableHeaderColumns[0].columnName}>
                      {"Charge" || "Unavailable"}
                    </FncTableCell>
                    <FncTableCell data-th={tableHeaderColumns[1].columnName}>
                      {purchase.stripeResponse &&
                        purchase.stripeResponse.amount
                        ? "$" +
                        purchase.stripeResponse.amount / 100 -
                        purchase.fee / 100
                        : "Unavailable"}
                    </FncTableCell>
                    <FncTableCell data-th={tableHeaderColumns[2].columnName}>
                      {purchase.stripeResponse &&
                        purchase.stripeResponse.amount
                        ? "$" + purchase.stripeResponse.amount / 100
                        : "Unavailable"}
                    </FncTableCell>
                    <FncTableCell data-th={tableHeaderColumns[3].columnName}>
                      {purchase && purchase.fee
                        ? "$" + purchase.fee / 100
                        : "Unavailable"}
                    </FncTableCell>
                    <FncTableCell data-th={tableHeaderColumns[4].columnName}>
                      {purchase.stripeResponse
                        ? purchase.stripeResponse.description
                        : "Unavailable"}
                    </FncTableCell>
                    <FncTableCell data-th={tableHeaderColumns[5].columnName}>
                      {dateFriendly(
                        purchase.createdOn,
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </FncTableCell>
                  </FncTableRow>
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
