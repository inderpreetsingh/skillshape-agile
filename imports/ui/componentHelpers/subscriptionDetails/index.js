import React from "react";
import { dateFriendly } from "/imports/util";
import { createContainer } from "meteor/react-meteor-data";
import Purchases from "/imports/api/purchases/fields";
class SubscriptionsDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { memberInfo } = this.props;
    return (
      <div
        style={{
          width: "400px",
          border: "solid 2px",
          margin: "20px"
        }}
      >
        <div style={{ margin: "10px" }}>Active Subscription</div>
        {memberInfo &&
          memberInfo.map(index => {
            return (
              <center>
                <div
                  style={{
                    border: "solid 2px",
                    backgroundColor: "#90EE90",
                    display: "flex",
                    justifyContent: "space-between",
                    width: "368px",
                    height: "50px",
                    borderRadius: "16px",
                    marginBottom: "2px"
                  }}
                >
                  <div style={{ margin: "10px" }}>
                    {index && index.packageName
                      ? index.packageName
                      : "Unavilable"}
                    <br />
                    {index && index.startDate
                      ? dateFriendly(index.startDate, "MMMM Do YYYY, h:mm:ss a")
                      : "Unavilable"}
                  </div>
                  {"  "}

                  <div
                    style={{
                      border: "solid 2px",
                      width: "155px",
                      height: "41px",
                      marginTop: "3px",
                      borderRadius: "14px"
                    }}
                  >
                    {(index &&
                      index.endDate &&
                      dateFriendly(index.endDate, "MMMM Do YYYY, h:mm:ss a")) ||
                      " "}
                  </div>
                </div>
              </center>
            );
          })}
        {/* old subscription code */}
        {/* <PackageDetailsTable>
        {memberInfo &&
          memberInfo.packageDetails &&
          Object.values(memberInfo.packageDetails).map(index => {
            return (
              <TableRow>
                <TableCell style={style.w150}>
                  {}
                  {index && index.createdOn
                    ? dateFriendly(
                        index.createdOn,
                        "MMMM Do YYYY, h:mm:ss a"
                      )
                    : "Unavilable"}
                </TableCell> */}
        {/* <TableCell style={style.w150}>
                  {index && index.packageName
                    ? index.packageName
                    : "Unavilable"}
                </TableCell>
              </TableRow>
            );
          })}
        {/* 
              
            );
          })} */}
        {/* </PackageDetailsTable> */}
        {/* <a href="#" style={{ float: "right" }}>
          See Past Purchases
        </a> */}
      </div>
    );
  }
}
export default createContainer(props => {
  let filter;
  if (props && props.memberId) {
    filter = {
      memberId: props.memberId
    };
  }
  if (props && props.userId) {
    filter = {
      userId: props.userId
    };
  }

  let memberInfo = [];
  let subscription = Meteor.subscribe(
    "purchases.getPurchasesListByMemberId",
    filter
  );
  memberInfo = Purchases.find().fetch();
  return {
    memberInfo,
    props
  };
}, SubscriptionsDetails);
