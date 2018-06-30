import React from "react";
import SubscriptionDetails from "/imports/ui/componentHelpers/subscriptionDetails";
export default class Mysubscriptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log("memberInfo", this.props);
    return (
      <div>
        {this.props &&
          this.props.currentUser &&
          this.props.currentUser._id && (
            <SubscriptionDetails activeUserId={this.props.currentUser._id} />
          )}
      </div>
    );
  }
}
