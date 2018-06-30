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
      <div>
        <center>
          <div
            style={{
              height: "300px",
              width: "400px",
              border: "solid 2px",
              margin: "20px"
            }}
          >
            Subscription
            <center>
              <div style={{ border: "solid 2px", backgroundColor: "green" }}>
                Package Name<br />
                Package Type
              </div>
            </center>{" "}
            {memberInfo &&
              memberInfo.packageDetails &&
              Object.values(memberInfo.packageDetails).map(value => {
                return (
                  <div
                    style={{
                      border: "solid 2px",
                      backgroundColor: "green",
                      display: "flex",
                      justifyContent: "space-evenly"
                    }}
                  >
                    <div>
                      {value && value.createdOn
                        ? dateFriendly(
                            value.createdOn,
                            "MMMM Do YYYY, h:mm:ss a"
                          )
                        : "Unavilable"}
                    </div>
                    {"  "}
                    <div>
                      {value && value.packageName
                        ? value.packageName
                        : "Unavilable"}
                    </div>
                  </div>
                );
              })}
          </div>
        </center>
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
