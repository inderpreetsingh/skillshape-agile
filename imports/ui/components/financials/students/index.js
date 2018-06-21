import React from "react";
export default class Students extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selecetdView: "Settings",
      queryTabValue: null
    };
  }

  render() {
    return <h1>Students</h1>;
  }
}
