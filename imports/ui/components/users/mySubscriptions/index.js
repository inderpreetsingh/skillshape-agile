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
<<<<<<< db497c255fa6ab4959b1ebff05e717445dfa72a4
          this.props.currentUser._id &&
          Meteor.settings.public.paymentEnabled && (
            <SubscriptionDetails activeUserId={this.props.currentUser._id} />
=======
          this.props.currentUser._id && (
            <SubscriptionDetails userId={this.props.currentUser._id} />
>>>>>>> email on expiration of package,table data from the purchases table
          )}
      </div>
    );
  }
}
