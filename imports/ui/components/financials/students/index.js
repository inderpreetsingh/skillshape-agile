import React, { Fragment } from "react";
import Pagination from "/imports/ui/componentHelpers/pagination";
import { StudentsDetailsTable } from "./studentsDetailsTable";
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
class Students extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      PurchaseData: [],
      perPage: 10
    };
  }
  componentWillMount() {
    console.log("this.props in payout", this.props);

    // Meteor.call("purchases.getAllPurchaseData", this.props.params.slug, (err, res) => {
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
    const { pageCount } = this.props;
    console.log("PurchaseData in students--->", this.props);
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
                  <Fragment>
                    <TableRow key={purchase._id} selectable={false}>
                      <TableCell style={style.w150}>
                        {purchase.profile && purchase.profile.emails
                          ? purchase.profile.emails[0].address
                          : "Unavilable"}
                      </TableCell>
                      <TableCell style={style.w150}>
                        {purchase.stripeRequest &&
                        purchase.stripeRequest.description
                          ? purchase.stripeRequest.description
                          : "Unavilable"}
                      </TableCell>
                      <TableCell style={style.w150}>
                        {purchase && purchase.packageType
                          ? purchase.packageType
                          : "Unavilable"}
                      </TableCell>
                      <TableCell style={style.w150}>
                        {purchase.profile && purchase.profile.profile
                          ? purchase.profile.profile.name
                          : "Unavilable"}
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
        </StudentsDetailsTable>
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
  console.log("payout props----->", props);
  let purchaseSubscription = Meteor.subscribe(
    "purchases.getAllPurchaseData",
    props.params.slug,
    props.filters
  );
  // let purchaseData = [];
  // if (purchaseSubscription.ready()) {
  let purchaseData = Purchases.find().fetch();
  console.log("in createcontainer", purchaseData);
  // }

  return {
    purchaseData,
    props
  };
}, Students);
