import React from "react";
export default class Payouts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selecetdView: "Settings",
      queryTabValue: null
    };
  }

  render() {
    return <h1>Payouts</h1>;
  }
}
