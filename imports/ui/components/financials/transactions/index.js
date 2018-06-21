import React from "react";
export default class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selecetdView: "Settings",
      queryTabValue: null
    };
  }

  render() {
    return <h1>Transactions</h1>;
  }
}
