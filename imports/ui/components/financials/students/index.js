import React, { Fragment } from "react";
import Pagination from "/imports/ui/componentHelpers/pagination";
import { StudentsDetailsTable, getTableProps } from "./studentsDetailsTable";
import isEmpty from "lodash/isEmpty";
import { createContainer } from "meteor/react-meteor-data";
import Purchases from "/imports/api/purchases/fields";
import { dateFriendly } from "/imports/util";
import { FncTableCell, FncTableRow, length } from '../styles.js';

class Students extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      PurchaseData: [],
      perPage: 10
    };
  }
  componentWillMount() {
    // Meteor.call("purchases.getAllPurchaseData", this.props.params.slug, (err, res) => {
    //   this.setState({ PurchaseData: res });
    // });
  }
  handlePageClick = ({ skip }) => {
    this.setState({ isBusy: true });
    this.getUsers({ limit: this.state.perPage, skip: skip });
  };

  render() {
    const { purchaseData } = this.props;
    const { pageCount } = this.props;
    const { tableHeaderColumns } = getTableProps();
    return (
      <div>
        <center>
          {" "}
          <h1>Students</h1>
        </center>
        <StudentsDetailsTable>
          {isEmpty(purchaseData)
            ? "No payout found"
            : purchaseData.reverse().map(purchase => {
              return (
                <FncTableRow key={purchase._id} selectable={false}>
                  <FncTableCell
                    data-th={tableHeaderColumns[0].columnName}
                  >
                    {purchase.profile && purchase.profile.emails
                      ? purchase.profile.emails[0].address
                      : "Unavilable"}
                  </FncTableCell>
                  <FncTableCell
                    data-th={tableHeaderColumns[1].columnName}
                  >
                    {
                      purchase.stripeRequest &&
                        purchase.stripeRequest.description
                        ? purchase.stripeRequest.description
                        : "Unavilable"}
                  </FncTableCell>
                  <FncTableCell
                    data-th={tableHeaderColumns[2].columnName}
                  >
                    {purchase && purchase.packageType
                      ? purchase.packageType
                      : "Unavilable"}
                  </FncTableCell>
                  <FncTableCell
                    data-th={tableHeaderColumns[3].columnName}
                  >
                    {purchase.profile && purchase.profile.profile
                      ? purchase.profile.profile.name
                      : "Unavilable"}
                  </FncTableCell>
                  <FncTableCell
                    data-th={tableHeaderColumns[4].columnName}
                  >
                    {
                      dateFriendly(
                        purchase.createdOn,
                        "MMMM Do YYYY, h:mm:ss a"
                      )
                    }
                  </FncTableCell>
                </FncTableRow >
              );
            })
          }
        </StudentsDetailsTable >
        <Pagination
          {...this.state}
          pageCount={pageCount}
          onChange={skip => {
            this.props.ChangePageClick(skip);
          }}
        />
      </div >
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
}, Students);
