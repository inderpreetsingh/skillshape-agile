import React from "react";
export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selecetdView: "Settings",
      queryTabValue: null
    };
  }

  render() {
    return <h1>Settings</h1>;
  }
}
