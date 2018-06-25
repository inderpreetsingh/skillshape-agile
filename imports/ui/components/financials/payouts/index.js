import React from "react";
import Pagination from "/imports/ui/componentHelpers/pagination";
import { PayoutDetailsTable } from "./payoutDetailsTable";
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
class Payouts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      PurchaseData: []
    };
  }
  componentWillMount() {
    console.log("this.props in payout", this.props);

    // Meteor.call("getAllPurchaseData", this.props.params.slug, (err, res) => {
    //   console.log("------------->AllPurchaseData<---------", res);
    //   this.setState({ PurchaseData: res });
    // });
  }
  handlePageClick = ({ skip }) => {
    console.log("skip -->>", skip);
    this.setState({ isBusy: true });
    this.getUsers({ limit: this.state.perPage, skip: skip });
  };

  render() {
    const { purchaseData } = this.props;
    console.log("PurchaseData--->", this.props);
    return (
      <div>
        <h1>Payouts</h1>
        <PayoutDetailsTable>
          {isEmpty(purchaseData)
            ? "No payout found"
            : purchaseData.reverse().map(purchase => {
                return (
                  <TableRow key={purchase._id} selectable={false}>
                    <TableCell style={style.w150}>
                      {purchase.stripe_Request.destination.amount}
                    </TableCell>
                    <TableCell style={style.w211}>
                      {purchase.stripe_Request.destination.account}
                    </TableCell>
                    <TableCell style={style.w150}>
                      {moment(purchase.createdOn).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
        </PayoutDetailsTable>
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

  return {
    purchaseData,
    props
  };
}, Payouts);
