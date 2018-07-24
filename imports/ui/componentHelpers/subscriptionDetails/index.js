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
          width: "400px",
          border: "solid 2px",
          margin: "20px"
        }}
      >
        <div style={{ margin: "10px" }}>Active Subscription</div>
        {memberInfo &&
          memberInfo.packageDetails &&
          Object.values(memberInfo.packageDetails).map(value => {
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
                    {value && value.packageName
                      ? value.packageName
                      : "Unavilable"}
                    <br />
                    {value && value.createdOn
                      ? dateFriendly(value.createdOn, "MMMM Do YYYY, h:mm:ss a")
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
                    {(value &&
                      value.expDuration &&
                      "Duration  " + value.expDuration + ",") ||
                      " "}
                    {(value &&
                      value.expPeriod &&
                      "Period " + value.expPeriod + ",") ||
                      ""}
                    {(value &&
                      value.noClasses &&
                      "Classes " + value.noClasses) ||
                      ""}
                    {!value.expDuration &&
                      !value.expPeriod &&
                      !value.noClasses &&
                      "1 Month"}
                  </div>
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
        {/* <a href="#" style={{ float: "right" }}>
          See Past Purchases
        </a> */}
      </div>
    );
  }
}
export default createContainer(props => {
  const filter = {
    activeUserId: props.activeUserId
  };
  let memberInfo = [];
  if (props && props.activeUserId) {
    let subscription = Meteor.subscribe(
      "schoolMemberDetails.getschoolMemberDetailsByMemberId",
      filter
    );
    memberInfo = SchoolMemberDetails.findOne();
  }
  if (props && props.memberInfo) {
    memberInfo = props.memberInfo;
  }

  return {
    memberInfo,
    props
  };
}, SubscriptionsDetails);
