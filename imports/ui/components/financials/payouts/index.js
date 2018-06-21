import React from "react";
import Pagination from "/imports/ui/componentHelpers/pagination";
import { PayoutDetailsTable } from "./payoutDetailsTable";
import { TableRow, TableCell } from "material-ui/Table";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
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
export default class Payouts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      PurchaseData: []
    };
  }
  componentWillMount() {
    Meteor.call("getAllPurchaseData", (err, res) => {
      console.log("------------->AllPurchaseData<---------", res);
      this.setState({ PurchaseData: res });
    });
  }
  handlePageClick = ({ skip }) => {
    console.log("skip -->>", skip);
    this.setState({ isBusy: true });
    this.getUsers({ limit: this.state.perPage, skip: skip });
  };

  render() {
    const { PurchaseData } = this.state;
    console.log("PurchaseData--->", PurchaseData);
    return (
      <div>
        <h1>Payouts</h1>
        <PayoutDetailsTable>
          {isEmpty(PurchaseData)
            ? "No payout found"
            : PurchaseData.map(purchase => {
                return (
                  <TableRow key={purchase._id} selectable={false}>
                    <TableCell style={style.w150}>
                      {purchase.stripe_Response.amount || "Unavailable"}
                    </TableCell>
                    <TableCell style={style.w211}>
                      {purchase.stripe_Response.source.last4 || "Unavailable"}
                    </TableCell>
                    <TableCell style={style.w150}>
                      {moment(purchase.createdOn).format("YYYY-MM-DD") ||
                        "Unavailable"}
                    </TableCell>
                  </TableRow>
                );
              })}
        </PayoutDetailsTable>
      </div>
    );
  }
}
