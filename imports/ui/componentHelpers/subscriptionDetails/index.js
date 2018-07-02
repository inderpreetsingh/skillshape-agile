import React from "react";
import { dateFriendly } from "/imports/util";
import SchoolMemberDetails from "/imports/api/schoolMemberDetails/fields";
import { createContainer } from "meteor/react-meteor-data";
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
          height: "300px",
          width: "400px",
          border: "solid 2px",
          margin: "20px"
        }}
      >
        <div style={{ margin: "10px" }}>Active Subscription</div>
        {memberInfo &&
          memberInfo.packageDetails &&
          Object.values(memberInfo.packageDetails)
            .slice(0, 4)
            .map(value => {
              return (
                <center>
                  <div
                    style={{
                      border: "solid 2px",
                      backgroundColor: "green",
                      display: "flex",
                      justifyContent: "space-between",
                      width: "368px",
                      height: "50px",
                      borderRadius: "16px",
                      marginBottom: "2px"
                    }}
                  >
                    <div style={{ margin: "10px" }}>
                      {value && value.createdOn
                        ? dateFriendly(
                            value.createdOn,
                            "MMMM Do YYYY, h:mm:ss a"
                          )
                        : "Unavilable"}
                    </div>
                    {"  "}
                    <div style={{ margin: "10px" }}>
                      {value && value.packageName
                        ? value.packageName
                        : "Unavilable"}
                    </div>
                    <div
                      style={{
                        border: "solid 2px",
                        width: "48px",
                        height: "41px",
                        marginTop: "3px",
                        borderRadius: "14px"
                      }}
                    />
                  </div>
                </center>
              );
            })}
        {/* old subscription code */}
        {/* <PackageDetailsTable>
        {memberInfo &&
          memberInfo.packageDetails &&
          Object.values(memberInfo.packageDetails).map(value => {
            return (
              <TableRow>
                <TableCell style={style.w150}>
                  {}
                  {value && value.createdOn
                    ? dateFriendly(
                        value.createdOn,
                        "MMMM Do YYYY, h:mm:ss a"
                      )
                    : "Unavilable"}
                </TableCell> */}
        {/* <TableCell style={style.w150}>
                  {value && value.packageName
                    ? value.packageName
                    : "Unavilable"}
                </TableCell>
              </TableRow>
            );
          })}
        {/* 
              
            );
          })} */}
        {/* </PackageDetailsTable> */}
        <a href="#" style={{ float: "right" }}>
          See Past Purchases
        </a>
      </div>
    );
  }
}
export default createContainer(props => {
  const filter = {
    activeUserId: props.activeUserId
  };
  let subscription = Meteor.subscribe(
    "schoolMemberDetails.getschoolMemberDetailsByMemberId",
    filter
  );
  const memberInfo = SchoolMemberDetails.findOne();

  return {
    memberInfo,
    props
  };
}, SubscriptionsDetails);
