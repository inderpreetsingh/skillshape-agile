import React from "react";
import Pagination from "/imports/ui/componentHelpers/pagination";
import { PayoutDetailsTable } from "./payoutDetailsTable";
import isEmpty from "lodash/isEmpty";
import { dateFriendly } from "/imports/util";
import { createContainer } from "meteor/react-meteor-data";
import Purchases from "/imports/api/purchases/fields";
import { FncTableRow, FncTableCell } from '../styles.js';
import { getTableProps } from './payoutDetailsTable.js';

class Payouts extends React.Component {
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
          <h1>Payouts</h1>
        </center>
        <PayoutDetailsTable>
          {isEmpty(purchaseData)
            ? "No payout found"
            : purchaseData.reverse().map(purchase => {
              return (
                <FncTableRow key={purchase._id} selectable={false}>
                  <FncTableCell data-th={tableHeaderColumns[0].columnName} >
                    {"$" + purchase && purchase.stripeRequest && purchase.stripeRequest.destination.amount / 100}
                  </FncTableCell>
                  <FncTableCell data-th={tableHeaderColumns[1].columnName} >
                    {purchase && purchase.stripeRequest && purchase.stripeRequest.destination.account}
                  </FncTableCell>
                  <FncTableCell data-th={tableHeaderColumns[2].columnName}>
                    {dateFriendly(
                      purchase.createdOn,
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  </FncTableCell>
                </FncTableRow>
              );
            })}
        </PayoutDetailsTable>
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
  // let purchaseData = [];
  // if (purchaseSubscription.ready()) {
  let purchaseData = Purchases.find().fetch();
  // }

  return {
    purchaseData,
    props
  };
}, Payouts);
