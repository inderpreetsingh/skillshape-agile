import React from "react";
import { createContainer } from "meteor/react-meteor-data";
import { withPopUp } from "/imports/util";
 class MySubscription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        School box here
      </div>
    );
  }
}
export default createContainer(props => {
  return {
  };
}, (withPopUp(MySubscription)));