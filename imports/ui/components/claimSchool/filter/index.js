import React from "react";
import ClaimSchoolFilterRender from "./claimSchoolFilterRender";

export default class ClaimSchoolFilter extends React.Component {

  render() {
    console.log("this.props", this.props);
    return ClaimSchoolFilterRender.call(this, this.props);
  }

}